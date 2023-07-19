// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/structs/DoubleEndedQueue.sol";

import "./mocks/UltraLightNodeMock.sol";
import "./mocks/SimpleMessageLibMock.sol";
import "@layerzerolabs/lz-evm-messagelib-v2/contracts/uln/UlnConfig.sol";
import {SetDefaultConfigParam} from "@layerzerolabs/lz-evm-messagelib-v2/contracts/uln/interfaces/IUlnConfig.sol";
import {OutboundConfigStruct} from "@layerzerolabs/lz-evm-messagelib-v2/contracts/OutboundConfig.sol";
import {VerifierNetwork, ExecuteParam} from "@layerzerolabs/lz-evm-messagelib-v2/contracts/uln/VerifierNetwork.sol";
import "@layerzerolabs/lz-evm-messagelib-v2/contracts/uln/VerifierFeeLib.sol";
import "@layerzerolabs/lz-evm-messagelib-v2/contracts/Executor.sol";
import "@layerzerolabs/lz-evm-messagelib-v2/contracts/ExecutorFeeLib.sol";
import "@layerzerolabs/lz-evm-messagelib-v2/contracts/PriceFeed.sol";
import "@layerzerolabs/lz-evm-messagelib-v2/contracts/interfaces/ILayerZeroPriceFeed.sol";

import "../contracts/OApp.sol";
import "../contracts/libs/OptionsBuilder.sol";
import "../contracts/standards/oft/interfaces/IOFT.sol";
import "./OptionsHelper.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/EndpointV2.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/BlockedMessageLib.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/PacketV1Codec.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageOrigin.sol";

contract TestHelper is Test, OptionsHelper, IMessageOrigin {
    using OptionsBuilder for bytes;

    enum LibraryType {
        UltraLightNode,
        SimpleMessageLib
    }

    using DoubleEndedQueue for DoubleEndedQueue.Bytes32Deque;
    using PacketV1Codec for bytes;

    mapping(uint32 => mapping(bytes32 => DoubleEndedQueue.Bytes32Deque)) packetsQueue; // dstEid => dstUA => guids queue
    mapping(bytes32 => bytes) packets; // guid => packet bytes
    mapping(bytes32 => bytes) optionsLookup; // guid => options

    mapping(uint32 => address) endpoints; // eid => endpoint

    uint public constant baseGasEstimate = 100000;

    bytes public defaultOption;

    function setUp() public virtual {
        defaultOption = OptionsBuilder.newOptions().addExecutorLzReceiveOption(200000, 0);
    }

    /**
     * @dev setup the endpoints
     * @param _endpointNum num of endpoints
     */
    function setUpEndpoints(uint8 _endpointNum, LibraryType _libraryType) public {
        BlockedMessageLib blockedMessageLib = new BlockedMessageLib();
        EndpointV2[] memory endpointList = new EndpointV2[](_endpointNum);
        uint32[] memory eidList = new uint32[](_endpointNum);

        // deploy _excludedContracts
        for (uint8 i = 0; i < _endpointNum; i++) {
            uint32 eid = i + 1;
            eidList[i] = eid;
            endpointList[i] = new EndpointV2(eid, address(blockedMessageLib), address(0x0));
            registerEndpoint(endpointList[i]);
        }

        // deploy
        address[] memory messageLibAddresses = new address[](_endpointNum);

        address[] memory signers = new address[](1);
        signers[0] = vm.addr(1);

        PriceFeed priceFeed = new PriceFeed();
        priceFeed.initialize(address(this));

        for (uint8 i = 0; i < _endpointNum; i++) {
            address messageLibAddress;
            if (_libraryType == LibraryType.UltraLightNode) {
                address endpointAddr = address(endpointList[i]);

                UlnConfig ulnConfig;
                UltraLightNode302Mock uln;
                {
                    ulnConfig = new UlnConfig();
                    uln = new UltraLightNode302Mock(payable(this), endpointAddr, baseGasEstimate, address(ulnConfig));
                    ulnConfig.setUln(address(uln));
                    messageLibAddress = address(uln);
                }

                Executor executor = new Executor();
                VerifierNetwork verifier;
                {
                    address[] memory admins = new address[](1);
                    admins[0] = address(this);

                    address[] memory messageLibs = new address[](1);
                    messageLibs[0] = messageLibAddress;

                    executor.initialize(
                        endpointAddr,
                        address(0x0),
                        messageLibs,
                        address(priceFeed),
                        address(this),
                        admins
                    );
                    ExecutorFeeLib executorLib = new ExecutorFeeLib();
                    executor.setWorkerFeeLib(address(executorLib));

                    verifier = new VerifierNetwork(messageLibs, address(priceFeed), signers, 1, admins);
                    VerifierFeeLib verifierLib = new VerifierFeeLib();
                    verifier.setWorkerFeeLib(address(verifierLib));
                }

                //todo: setDstGas
                uint32 endpointNum = _endpointNum;
                IExecutor.DstConfigParam[] memory dstConfigParams = new IExecutor.DstConfigParam[](endpointNum);
                for (uint32 j = 0; j < endpointNum; j++) {
                    uint32 dstEid = j + 1;
                    address[] memory defaultVerifiers = new address[](1);
                    address[] memory optionalVerifiers = new address[](0);
                    defaultVerifiers[0] = address(verifier);

                    {
                        SetDefaultConfigParam[] memory params = new SetDefaultConfigParam[](1);
                        OutboundConfigStruct memory outboundConfig = OutboundConfigStruct(
                            10000,
                            100,
                            address(executor)
                        );
                        params[0] = SetDefaultConfigParam(
                            dstEid,
                            outboundConfig,
                            100,
                            defaultVerifiers,
                            optionalVerifiers,
                            0
                        );
                        ulnConfig.setDefaultConfig(params);
                    }

                    uln.setDefaultOptions(dstEid, defaultOption);

                    // executor config
                    dstConfigParams[j] = IExecutor.DstConfigParam({
                        dstEid: dstEid,
                        baseGas: 5000,
                        multiplierBps: 10000,
                        floorMarginUSD: 1e10,
                        airdropCap: 1 gwei
                    });

                    uint128 denominator = priceFeed.getPriceRatioDenominator();
                    ILayerZeroPriceFeed.UpdatePrice[] memory prices = new ILayerZeroPriceFeed.UpdatePrice[](1);
                    prices[0] = ILayerZeroPriceFeed.UpdatePrice(
                        dstEid,
                        ILayerZeroPriceFeed.Price(1 * denominator, 1, 1)
                    );
                    priceFeed.setPrice(prices);
                }
                executor.setDstConfig(dstConfigParams);
            } else if (_libraryType == LibraryType.SimpleMessageLib) {
                SimpleMessageLibMock messageLib = new SimpleMessageLibMock(payable(this), address(endpointList[i]));
                messageLibAddress = address(messageLib);
            } else {
                revert("invalid library type");
            }

            messageLibAddresses[i] = address(messageLibAddress);
            endpointList[i].registerLibrary(messageLibAddress);
        }

        // wire up
        for (uint8 i = 0; i < _endpointNum; i++) {
            EndpointV2 endpoint = endpointList[i];
            for (uint8 j = 0; j < _endpointNum; j++) {
                if (i == j) continue;
                endpoint.setDefaultSendLibrary(j + 1, messageLibAddresses[i]);
                uint timeout = 0;
                endpoint.setDefaultReceiveLibrary(j + 1, messageLibAddresses[i], timeout);
            }
        }
    }

    /**
     * @dev setup UAs, only if the UA has `endpoint` address as the unique parameter
     */
    function setupOApps(
        bytes memory _oappCreationCode,
        uint8 _startEid,
        uint8 _oappNum
    ) public returns (address[] memory oapps) {
        oapps = new address[](_oappNum);
        for (uint8 eid = _startEid; eid < _startEid + _oappNum; eid++) {
            address oapp = _deployOApp(_oappCreationCode, abi.encode(address(endpoints[eid])));
            oapps[eid - _startEid] = oapp;
        }
        // wire
        wireOApps(oapps);
    }

    // TODO add generic function for setting up Oapps that takes in arbitrary constructor args
    function setupOFTs(
        bytes memory _oftCreationCode,
        uint8 _oftNum,
        string[] memory _names,
        string[] memory _symbols,
        uint8[] memory _localDecimals
    ) public returns (address[] memory ofts) {
        setUpEndpoints(_oftNum, LibraryType.UltraLightNode);

        ofts = new address[](_oftNum);
        for (uint8 i = 0; i < _oftNum; i++) {
            uint32 eid = i + 1;
            address oft = _deployOApp(
                _oftCreationCode,
                abi.encode(_names[i], _symbols[i], _localDecimals[i], address(endpoints[eid]))
            );
            ofts[i] = oft;
        }
        // wire
        wireOApps(ofts);
    }

    function wireOApps(address[] memory oapps) public {
        uint size = oapps.length;
        for (uint i = 0; i < size; i++) {
            OApp localOApp = OApp(payable(oapps[i]));
            for (uint j = 0; j < size; j++) {
                if (i == j) continue;
                OApp remoteOApp = OApp(payable(oapps[j]));
                uint32 remoteEid = (remoteOApp.endpoint()).eid();
                localOApp.setPeer(remoteEid, addressToBytes32(address(remoteOApp)), true);
            }
        }
    }

    function _deployOApp(bytes memory _oappBytecode, bytes memory _constructorArgs) internal returns (address addr) {
        bytes memory bytecode = bytes.concat(abi.encodePacked(_oappBytecode), _constructorArgs);
        assembly {
            addr := create(0, add(bytecode, 0x20), mload(bytecode))
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
    }

    function schedulePacket(bytes calldata _packetBytes, bytes calldata _options) public {
        uint32 dstEid = _packetBytes.dstEid();
        bytes32 dstAddress = _packetBytes.receiver();
        DoubleEndedQueue.Bytes32Deque storage queue = packetsQueue[dstEid][dstAddress];
        // front in, back out
        bytes32 guid = _packetBytes.guid();
        queue.pushFront(guid);
        packets[guid] = _packetBytes;
        optionsLookup[guid] = _options;
    }

    /**
     * @dev deliver packets to destination chain's UA address
     * @param _dstEid  destination eid
     * @param _dstAddress  destination address
     */
    function deliverPackets(uint32 _dstEid, bytes32 _dstAddress) public {
        deliverPackets(_dstEid, _dstAddress, 0, address(0x0));
    }

    /**
     * @dev deliver packets to destination chain's UA address
     * @param _dstEid  destination eid
     * @param _dstAddress  destination address
     */
    function deliverPackets(uint32 _dstEid, address _dstAddress) public {
        deliverPackets(_dstEid, bytes32(uint(uint160(_dstAddress))), 0, address(0x0));
    }

    /**
     * @dev dst UA receive/execute packets
     */
    function deliverPackets(uint32 _dstEid, bytes32 _dstAddress, uint _packetAmount, address _composer) public {
        require(endpoints[_dstEid] != address(0), "endpoint not yet registered");

        DoubleEndedQueue.Bytes32Deque storage queue = packetsQueue[_dstEid][_dstAddress];
        uint pendingPacketsSize = queue.length();
        uint numberOfPackets;
        if (_packetAmount == 0) {
            numberOfPackets = queue.length();
        } else {
            numberOfPackets = pendingPacketsSize > _packetAmount ? _packetAmount : pendingPacketsSize;
        }
        while (numberOfPackets > 0) {
            numberOfPackets--;
            // front in, back out
            bytes32 guid = queue.popBack();
            bytes memory packetBytes = packets[guid];
            this.assertGuid(packetBytes, guid);
            this.validatePacket(packetBytes);

            bytes memory options = optionsLookup[guid];
            if (_executorOptionExists(options, ExecutorOptions.OPTION_TYPE_AIRDROP)) {
                (uint amount, bytes32 receiver) = _parseExecutorAirdropOption(options);
                address to = address(uint160(uint(receiver)));
                (bool sent, ) = to.call{value: amount}("");
                require(sent, "Failed to send Ether");
            }
            if (_executorOptionExists(options, ExecutorOptions.OPTION_TYPE_LZRECEIVE)) {
                this.lzReceive(packetBytes, options);
            }
            if (_executorOptionExists(options, ExecutorOptions.OPTION_TYPE_LZCOMPOSE)) {
                this.lzCompose(packetBytes, options, guid, _composer);
            }
        }
    }

    function lzReceive(bytes calldata _packetBytes, bytes memory _options) external payable {
        EndpointV2 endpoint = EndpointV2(endpoints[_packetBytes.dstEid()]);
        (uint gas, uint value) = OptionsHelper._parseExecutorLzReceiveOption(_options);

        MessageOrigin memory origin = MessageOrigin(_packetBytes.srcEid(), _packetBytes.sender(), _packetBytes.nonce());
        endpoint.lzReceive{value: value, gas: gas}(
            origin,
            _packetBytes.receiverB20(),
            _packetBytes.guid(),
            _packetBytes.message(),
            bytes("")
        );
    }

    function lzCompose(
        bytes calldata _packetBytes,
        bytes memory _options,
        bytes32 _guid,
        address _composer
    ) external payable {
        EndpointV2 endpoint = EndpointV2(endpoints[_packetBytes.dstEid()]);
        (uint gas, uint value) = _parseExecutorLzComposeOption(_options);

        bytes memory message = _packetBytes.message();
        endpoint.lzCompose{value: value, gas: gas}(_packetBytes.receiverB20(), _composer, _guid, message, bytes(""));
    }

    function validatePacket(bytes calldata _packetBytes) external {
        EndpointV2 endpoint = EndpointV2(endpoints[_packetBytes.dstEid()]);
        (address receiveLib, ) = endpoint.getReceiveLibrary(_packetBytes.receiverB20(), _packetBytes.srcEid());
        UltraLightNode302Mock dstUln = UltraLightNode302Mock(payable(receiveLib));

        (uint64 major, , ) = IMessageLib(receiveLib).version();
        if (major == 3) {
            // it is ultra light node
            (bytes memory config, ) = dstUln.getConfig(_packetBytes.srcEid(), _packetBytes.receiverB20(), 5); //CONFIG_TYPE_VERIFIER
            address[] memory verifiers = abi.decode(config, (address[]));
            VerifierNetwork verifier = VerifierNetwork(verifiers[0]);

            bytes memory packetHeader = _packetBytes.header();
            bytes32 payloadHash = keccak256(_packetBytes.payload());

            // sign and deliver
            bytes memory verifyAndDeliverCalldata = abi.encodeWithSelector(
                verifier.verifyAndDeliver.selector,
                address(dstUln),
                packetHeader,
                payloadHash,
                100
            );
            bytes memory signatures;
            {
                bytes32 hash = verifier.hashCallData(address(verifier), verifyAndDeliverCalldata, 1000);
                bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
                (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, ethSignedMessageHash); // matches verifier signer
                signatures = abi.encodePacked(r, s, v);
            }
            ExecuteParam[] memory params = new ExecuteParam[](1);
            params[0] = ExecuteParam(address(verifier), verifyAndDeliverCalldata, 1000, signatures);
            verifier.execute(params);
        } else {
            SimpleMessageLibMock(payable(receiveLib)).validatePacket(_packetBytes);
        }
    }

    function assertGuid(bytes calldata packetBytes, bytes32 guid) external pure {
        bytes32 packetGuid = packetBytes.guid();
        require(packetGuid == guid, "guid not match");
    }

    function registerEndpoint(EndpointV2 endpoint) public {
        endpoints[endpoint.eid()] = address(endpoint);
    }

    function hasPendingPackets(uint16 _dstEid, bytes32 _dstAddress) public view returns (bool flag) {
        DoubleEndedQueue.Bytes32Deque storage queue = packetsQueue[_dstEid][_dstAddress];
        return queue.length() > 0;
    }

    function getNextInflightPacket(uint16 _dstEid, bytes32 _dstAddress) public view returns (bytes memory packetBytes) {
        DoubleEndedQueue.Bytes32Deque storage queue = packetsQueue[_dstEid][_dstAddress];
        if (queue.length() > 0) {
            bytes32 guid = queue.back();
            packetBytes = packets[guid];
        }
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint(uint160(_addr)));
    }

    receive() external payable {}
}

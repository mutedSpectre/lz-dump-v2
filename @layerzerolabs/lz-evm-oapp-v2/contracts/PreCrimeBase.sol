// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpoint.sol";
import "./interfaces/IPreCrime.sol";

abstract contract PreCrimeBase is IPreCrime {
    uint16 internal constant PRECRIME_VERSION = 1;
    uint16 internal constant CONFIG_VERSION = 1;

    //---------------- error code ----------------------
    // --- UA scope code ---
    uint16 internal constant CODE_SUCCESS = 0; // success
    uint16 internal constant CODE_PRECRIME_FAILURE = 1; // !!! crimes found

    // --- protocol scope error code ---
    // simualte
    uint16 internal constant CODE_PACKETS_OVERSIZE = 400; // packets number bigger then max size
    uint16 internal constant CODE_PACKETS_UNSORTED = 401; // packets are unsorted, need backfill and keep order
    // precrime
    uint16 internal constant CODE_MISS_SIMULATE_RESULT = 402; // miss simulation result

    ILayerZeroEndpoint internal immutable lzEndpoint;
    uint32 internal immutable localEid;

    address public pAdmin;

    uint64 public pMaxBatchSize;
    uint32[] public precrimeEids;
    bytes32[] public precrimePeers;
    mapping(uint32 eid => bytes32 peer) public precrimeEidToPeer;

    modifier onlyPrecrimeAdmin() {
        require(msg.sender == pAdmin, "only admin");
        _;
    }

    constructor(address _endpoint) {
        lzEndpoint = ILayerZeroEndpoint(_endpoint);
        localEid = lzEndpoint.eid();
        pAdmin = msg.sender;
    }

    // ----------------- admin functions -----------------
    function setPrecrimeAdmin(address _admin) external onlyPrecrimeAdmin {
        pAdmin = _admin;
    }

    function setPrecrimeMaxBatchSize(uint64 _maxBatchSize) external onlyPrecrimeAdmin {
        pMaxBatchSize = _maxBatchSize;
    }

    function setPrecrimePeers(uint32[] memory _eids, bytes32[] memory _peers) external onlyPrecrimeAdmin {
        precrimeEids = _eids;
        precrimePeers = _peers;
        for (uint i = 0; i < _eids.length; i++) {
            precrimeEidToPeer[_eids[i]] = _peers[i];
        }
    }

    // ----------------- view functions -----------------

    function getPrecrimeConfig(Packet[] calldata _packets) external view virtual override returns (bytes memory) {
        (uint32[] memory eids, bytes32[] memory peers) = _getPrecrimePeers(_packets);
        return
            abi.encodePacked(
                CONFIG_VERSION,
                //---- max packets size for simulate batch ---
                pMaxBatchSize,
                //------------- peer precrimes -------------
                eids.length,
                eids,
                peers
            );
    }

    function precrime(
        Packet[] calldata _packets,
        bytes[] calldata _simulation
    ) external view override returns (uint16 code, bytes memory reason) {
        bytes[] memory originSimulateResult = new bytes[](_simulation.length);
        uint32[] memory eids = new uint32[](_simulation.length);
        for (uint256 i = 0; i < _simulation.length; i++) {
            (uint32 eid, bytes memory simulateResult) = abi.decode(_simulation[i], (uint32, bytes));
            eids[i] = eid;
            originSimulateResult[i] = simulateResult;
        }

        (code, reason) = _checkResultsCompleteness(_packets, eids);
        if (code != CODE_SUCCESS) {
            return (code, reason);
        }

        (code, reason) = _precrime(originSimulateResult);
    }

    function precrimeVersion() external pure override returns (uint16) {
        return PRECRIME_VERSION;
    }

    function _checkResultsCompleteness(
        Packet[] calldata _packets,
        uint32[] memory _resultEids
    ) internal view returns (uint16 code, bytes memory reason) {
        // check if all peers result included
        if (_packets.length > 0) {
            (uint32[] memory eids, ) = _getPrecrimePeers(_packets);
            for (uint256 i = 0; i < eids.length; i++) {
                bool resultEidChecked;
                for (uint256 j = 0; j < _resultEids.length; j++) {
                    if (_resultEids[j] == eids[i]) {
                        resultEidChecked = true;
                        break;
                    }
                }
                if (!resultEidChecked) {
                    return (CODE_MISS_SIMULATE_RESULT, "missing peer simulation result");
                }
            }
        }
        // check if local resut included
        bool localEidResultChecked;
        for (uint256 j = 0; j < _resultEids.length; j++) {
            if (_resultEids[j] == localEid) {
                localEidResultChecked = true;
                break;
            }
        }
        if (!localEidResultChecked) {
            return (CODE_MISS_SIMULATE_RESULT, "missing local simulation result");
        }

        return (CODE_SUCCESS, "");
    }

    function _checkPacketsMaxSizeAndNonceOrder(
        Packet[] calldata _packets
    ) internal view returns (uint16 code, bytes memory reason) {
        if (_packets.length > pMaxBatchSize) {
            return (
                CODE_PACKETS_OVERSIZE,
                abi.encodePacked("packets size exceed limited ", Strings.toString(uint256(pMaxBatchSize)))
            );
        }

        // check packets nonce, sequence order
        // packets should group by srcEid and sender, then sort by nonce ascending
        if (_packets.length > 0) {
            uint32 srcEid;
            bytes32 sender;
            uint64 nonce;
            for (uint256 i = 0; i < _packets.length; i++) {
                Packet memory packet = _packets[i];
                // start from a new chain packet or a new source UA
                if (packet.origin.srcEid != srcEid || packet.origin.sender != sender) {
                    srcEid = packet.origin.srcEid;
                    sender = packet.origin.sender;
                    nonce = packet.origin.nonce;
                    uint64 nextInboundNonce = lzEndpoint.getInboundNonce(_receiver(), srcEid, sender) + 1;
                    // the first packet's nonce must equal to dst InboundNonce+1
                    if (nonce != nextInboundNonce) {
                        return (
                            CODE_PACKETS_UNSORTED,
                            abi.encodePacked("skipped inboundNonce, packet index: ", Strings.toString(i))
                        );
                    }
                } else {
                    // the following packet's nonce add 1 in order
                    if (packet.origin.nonce != ++nonce) {
                        return (
                            CODE_PACKETS_UNSORTED,
                            abi.encodePacked("unsorted packets, packet index: ", Strings.toString(i))
                        );
                    }
                }
            }
        }
        return (CODE_SUCCESS, "");
    }

    // ----------------- to be implemented -----------------
    function _getPrecrimePeers(
        Packet[] calldata _packets
    ) internal view virtual returns (uint32[] memory, bytes32[] memory);

    function _receiver() internal view virtual returns (address);

    function _precrime(bytes[] memory _simulation) internal view virtual returns (uint16 code, bytes memory reason);
}

// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract MultiSigUpgradeable is Initializable {
    mapping(address signer => bool active) public signers;
    uint64 public signerSize;
    uint64 public quorum;

    event UpdateSigner(address _signer, bool _active);
    event UpdateQuorum(uint64 _quorum);

    modifier onlySigner() {
        require(signers[msg.sender], "MultiSig: caller must be signer");
        _;
    }

    function __MultiSig_init(address[] memory _signers, uint64 _quorum) internal onlyInitializing {
        __MultiSig_init_unchained(_signers, _quorum);
    }

    function __MultiSig_init_unchained(address[] memory _signers, uint64 _quorum) internal onlyInitializing {
        require(_signers.length >= _quorum && _quorum > 0, "MultiSig: signers too few");

        address lastSigner = address(0);
        for (uint i = 0; i < _signers.length; i++) {
            address signer = _signers[i];
            require(signer > lastSigner, "MultiSig: signers not sorted"); // to ensure no duplicates
            signers[signer] = true;
            lastSigner = signer;
        }
        signerSize = uint64(_signers.length);
        quorum = _quorum;
    }

    function _setSigner(address _signer, bool _active) internal {
        require(signers[_signer] != _active, "MultiSig: signer already in that state");
        signers[_signer] = _active;
        signerSize = _active ? signerSize + 1 : signerSize - 1;
        require(signerSize >= quorum, "MultiSig: committee size < threshold");
        emit UpdateSigner(_signer, _active);
    }

    function _setQuorum(uint64 _quorum) internal {
        require(_quorum <= signerSize && _quorum > 0, "MultiSig: invalid quorum");
        quorum = _quorum;
        emit UpdateQuorum(_quorum);
    }

    function verifySignatures(bytes32 _hash, bytes calldata _signatures) public view returns (bool) {
        if (_signatures.length < uint(quorum) * 65) {
            return false;
        }

        bytes32 messageDigest = _getEthSignedMessageHash(_hash);

        address lastSigner = address(0); // There cannot be a signer with address 0.
        for (uint i = 0; i < quorum; i++) {
            (uint8 v, bytes32 r, bytes32 s) = _splitSignature(_signatures, i);
            address currentSigner = ecrecover(messageDigest, v, r, s);

            if (currentSigner <= lastSigner) return false; // prevent duplicate signatures
            if (!signers[currentSigner]) return false; // signature is not from a signer
            lastSigner = currentSigner;
        }
        return true;
    }

    /// divides bytes signature into `uint8 v, bytes32 r, bytes32 s`.
    function _splitSignature(
        bytes memory _signatures,
        uint256 _pos
    ) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
        // The signature format is a compact form of:
        //   {bytes32 r}{bytes32 s}{uint8 v}
        // Compact means, uint8 is not padded to 32 bytes.
        // solhint-disable-next-line no-inline-assembly
        assembly {
            let signaturePos := mul(0x41, _pos)
            r := mload(add(_signatures, add(signaturePos, 0x20)))
            s := mload(add(_signatures, add(signaturePos, 0x40)))
            // Here we are loading the last 32 bytes, including 31 bytes
            // of 's'. There is no 'mload8' to do this.
            //
            // 'byte' is not working due to the Solidity parser, so lets
            // use the second best option, 'and'
            v := and(mload(add(_signatures, add(signaturePos, 0x41))), 0xff)
        }
    }

    function _getEthSignedMessageHash(bytes32 _messageHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

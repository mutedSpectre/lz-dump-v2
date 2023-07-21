// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

abstract contract MultiSig {
    mapping(address signer => bool active) public signers;
    uint64 public signerSize;
    uint64 public quorum;

    event UpdateSigner(address _signer, bool _active);
    event UpdateQuorum(uint64 _quorum);

    modifier onlySigner() {
        require(signers[msg.sender], "MultiSig: caller must be signer");
        _;
    }

    constructor(address[] memory _signers, uint64 _quorum) {
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
        if (_signatures.length != uint(quorum) * 65) {
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
        bytes calldata _signatures,
        uint256 _pos
    ) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
        // The signature format is a compact form of:
        //   {bytes32 r}{bytes32 s}{uint8 v}
        // Compact means, uint8 is not padded to 32 bytes.
        uint offset = 65 * _pos;
        r = bytes32(_signatures[0 + offset:32 + offset]);
        s = bytes32(_signatures[32 + offset:64 + offset]);
        v = uint8(bytes1(_signatures[64 + offset:65 + offset]));
    }

    function _getEthSignedMessageHash(bytes32 _messageHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }
}

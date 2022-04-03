//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract NormalMessage {
    event Registerd(bytes32 hash, string description, address signer);
    
    function registerOnBehalfOf(bytes32 hash, string memory description, address signer, bytes32 r, bytes32 s, uint8 v) public {
        
        // Notice; NOT using non-standard encoding as this is more secure
        bytes32 payloadHash = keccak256(abi.encode(hash, description));
        
        // If you *REALLY* want to use non-standard encoding, which will
        // only save 6 gas and add potential security issues in the future
        // versions of this contract.
        //bytes32 payloadHash = keccak256(abi.encodePacked(hash, description));

        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", payloadHash));
        
        address actualSigner = ecrecover(messageHash, v, r, s);

        // Not that this step is acutally redundant; you could remove
        // signer from the signature and skip this `require` entirely
        require(signer == actualSigner, "invalid Signer");
        
        _register(hash, description, actualSigner);
    }
    
    function _register(bytes32 hash, string memory description, address signer) public {
        emit Registerd(hash, description, signer);
    }
}
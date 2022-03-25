//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./common/NativeMetaTransaction.sol";
import "./common/ContentMixin.sol";

contract EIP712Sample is NativeMetaTransaction, ContextMixin {
	event Transfer(address msgSender,address to, uint256 amount);

	constructor(string memory name) {
		_initializeEIP712(name);
	}

	function transfer(address to, uint256 amount)
		public
		virtual
		returns (bool)
	{
		require(to != address(0), "EIP712Sample: INVALID_TO");
		emit Transfer(msgSender(), to, amount);
		return true;
	}


	function executeMetaTransaction2(
        address userAddress,
        bytes memory functionSignature,
        bytes32 sigR,
        bytes32 sigS,
        uint8 sigV
    ) external payable returns (bool) {
		emit MetaTransactionInfo(
			userAddress,
			functionSignature,
			sigR,
			sigS,
			sigV,
			nonces[userAddress]
		);

		return true;
	}
}

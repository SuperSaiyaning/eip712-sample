/* eslint-disable no-undef */
App = {
	loading: false,
	contracts: {},

	load: async () => {
		await App.loadWeb3();
		await App.loadAccount();
		await App.render();
	},

	// https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
	loadWeb3: async () => {
		// if (typeof web3 !== 'undefined') {
		// 	console.log()
		// 	App.web3Provider = web3.currentProvider
		// 	web3 = new Web3(web3.currentProvider)
		// } else {
		// 	window.alert("Please connect to Metamask.")
		// }

		// Modern dapp browsers...
		if (window.ethereum) {
			window.web3 = new Web3(ethereum);
			try {
				// Request account access if needed
				// await ethereum.enable()
				// Acccounts now exposed
				// web3.eth.sendTransaction({/* ... */ })
			} catch (error) {
				// User denied account access...
			}
		} else if (window.web3) {
			// Legacy dapp browsers...
			App.web3Provider = web3.currentProvider;
			window.web3 = new Web3(web3.currentProvider);
			// Acccounts always exposed
			web3.eth.sendTransaction({
				/* ... */
			});
		} else {
			// Non-dapp browsers...
			console.log(
				"Non-Ethereum browser detected. You should consider trying MetaMask!"
			);
		}
	},
	loadAccount: async () => {
		// Set the current blockchain account
		const accounts = await ethereum.request({
			method: "eth_requestAccounts",
		});
		console.log(accounts);
		App.account = accounts[0];
		App.account2 = accounts[1];
	},

	render: async () => {
		// Prevent double render
		if (App.loading) {
			return;
		}

		// Update app loading state
		App.setLoading(true);

		// Render Account
		$("#account").html(App.account);

		// Update loading state
		App.setLoading(false);
	},

	setLoading: (boolean) => {
		App.loading = boolean;
		const loader = $("#loader");
		const content = $("#content");
		if (boolean) {
			loader.show();
			content.hide();
		} else {
			loader.hide();
			content.show();
		}
	},

	createTask: async () => {
		const functionSignature =
			"0xa9059cbb000000000000000000000000dbbecefd155af913062ae80922e4dc19605e9e990000000000000000000000000000000000000000000000000de0b6b3a7640000";
		// const contractAddress = '0x18Dff5fD969C7AfA1A229db9133951a9133821aC'
		const contractAddress = "0x1f4b1572Fc18462b3B24A46f8C27569252E94911";
		const domain = [
			{ name: "name", type: "string" },
			{ name: "version", type: "string" },
			{ name: "verifyingContract", type: "address" },
			{ name: "salt", type: "bytes32" },
		];
		const metaTransaction = [
			{ name: "nonce", type: "uint256" },
			{ name: "from", type: "address" },
			{ name: "functionSignature", type: "bytes" },
		];

		const chainId = await ethereum.request({ method: "eth_chainId" });

		const domainData = {
			name: "EIP712Sample",
			version: "1",
			salt: "0x" + "0".repeat(63) + Number(chainId),
			verifyingContract: contractAddress,
		};

		console.log(domainData);

		const message = {
			nonce: 0,
			from: App.account,
			functionSignature,
		};

		const data = JSON.stringify({
			types: {
				EIP712Domain: domain,
				MetaTransaction: metaTransaction,
			},
			domain: domainData,
			primaryType: "MetaTransaction",
			message: message,
		});

		const from = App.account;
		const params = [from, data];
		const method = "eth_signTypedData_v4";

		ethereum.sendAsync(
			{
				method,
				params,
				from,
				jsonrpc: "2.0",
				id: 1,
			},
			async function (err, result) {
				console.log(err);

				console.log(result, "Signature");

				const signature = result.result.substring(2);
				const r = "0x" + signature.substring(0, 64);
				const s = "0x" + signature.substring(64, 128);
				const v = parseInt(signature.substring(128, 130), 16);
				console.log(r);
				console.log(s);
				console.log(v);

				const abi = [
					{
						inputs: [
							{
								internalType: "string",
								name: "name",
								type: "string",
							},
						],
						stateMutability: "nonpayable",
						type: "constructor",
					},
					{
						anonymous: false,
						inputs: [
							{
								indexed: false,
								internalType: "address",
								name: "userAddress",
								type: "address",
							},
							{
								indexed: false,
								internalType: "address payable",
								name: "relayerAddress",
								type: "address",
							},
							{
								indexed: false,
								internalType: "bytes",
								name: "functionSignature",
								type: "bytes",
							},
						],
						name: "MetaTransactionExecuted",
						type: "event",
					},
					{
						anonymous: false,
						inputs: [
							{
								indexed: false,
								internalType: "address",
								name: "userAddress",
								type: "address",
							},
							{
								indexed: false,
								internalType: "bytes",
								name: "functionSignature",
								type: "bytes",
							},
							{
								indexed: false,
								internalType: "bytes32",
								name: "sigR",
								type: "bytes32",
							},
							{
								indexed: false,
								internalType: "bytes32",
								name: "sigS",
								type: "bytes32",
							},
							{
								indexed: false,
								internalType: "uint8",
								name: "sigV",
								type: "uint8",
							},
							{
								indexed: false,
								internalType: "uint256",
								name: "nonce",
								type: "uint256",
							},
						],
						name: "MetaTransactionInfo",
						type: "event",
					},
					{
						anonymous: false,
						inputs: [
							{
								indexed: false,
								internalType: "address",
								name: "to",
								type: "address",
							},
							{
								indexed: false,
								internalType: "uint256",
								name: "amount",
								type: "uint256",
							},
						],
						name: "Transfer",
						type: "event",
					},
					{
						inputs: [],
						name: "ERC712_VERSION",
						outputs: [
							{
								internalType: "string",
								name: "",
								type: "string",
							},
						],
						stateMutability: "view",
						type: "function",
					},
					{
						inputs: [
							{
								internalType: "address",
								name: "userAddress",
								type: "address",
							},
							{
								internalType: "bytes",
								name: "functionSignature",
								type: "bytes",
							},
							{
								internalType: "bytes32",
								name: "sigR",
								type: "bytes32",
							},
							{
								internalType: "bytes32",
								name: "sigS",
								type: "bytes32",
							},
							{
								internalType: "uint8",
								name: "sigV",
								type: "uint8",
							},
						],
						name: "executeMetaTransaction",
						outputs: [
							{
								internalType: "bytes",
								name: "",
								type: "bytes",
							},
						],
						stateMutability: "payable",
						type: "function",
					},
					{
						inputs: [
							{
								internalType: "address",
								name: "userAddress",
								type: "address",
							},
							{
								internalType: "bytes",
								name: "functionSignature",
								type: "bytes",
							},
							{
								internalType: "bytes32",
								name: "sigR",
								type: "bytes32",
							},
							{
								internalType: "bytes32",
								name: "sigS",
								type: "bytes32",
							},
							{
								internalType: "uint8",
								name: "sigV",
								type: "uint8",
							},
						],
						name: "executeMetaTransaction2",
						outputs: [
							{
								internalType: "bool",
								name: "",
								type: "bool",
							},
						],
						stateMutability: "payable",
						type: "function",
					},
					{
						inputs: [],
						name: "getChainId",
						outputs: [
							{
								internalType: "uint256",
								name: "",
								type: "uint256",
							},
						],
						stateMutability: "view",
						type: "function",
					},
					{
						inputs: [],
						name: "getDomainSeperator",
						outputs: [
							{
								internalType: "bytes32",
								name: "",
								type: "bytes32",
							},
						],
						stateMutability: "view",
						type: "function",
					},
					{
						inputs: [
							{
								internalType: "address",
								name: "user",
								type: "address",
							},
						],
						name: "getNonce",
						outputs: [
							{
								internalType: "uint256",
								name: "nonce",
								type: "uint256",
							},
						],
						stateMutability: "view",
						type: "function",
					},
					{
						inputs: [],
						name: "inited",
						outputs: [
							{
								internalType: "bool",
								name: "",
								type: "bool",
							},
						],
						stateMutability: "view",
						type: "function",
					},
					{
						inputs: [
							{
								internalType: "address",
								name: "to",
								type: "address",
							},
							{
								internalType: "uint256",
								name: "amount",
								type: "uint256",
							},
						],
						name: "transfer",
						outputs: [
							{
								internalType: "bool",
								name: "",
								type: "bool",
							},
						],
						stateMutability: "nonpayable",
						type: "function",
					},
				];

				const contract = new web3.eth.Contract(abi, contractAddress);
				const inputData = contract.methods
					.executeMetaTransaction(
						App.account,
						functionSignature,
						r,
						s,
						web3.utils.numberToHex(v)
					)
					.encodeABI();
				console.log(inputData);

				const tx = {
					nonce: "0x00", // ignored by MetaMask
					from: App.account,
					to: contractAddress,
					value: "0x00",
					data: inputData,
					gasPrice: "0x4e3b29200",
					gas: "0x27100",
					chainId: web3.utils.numberToHex(4),
				};

				// txHash is a hex string
				// As with any RPC call, it may throw an error
				const txHash = await ethereum.request({
					method: "eth_sendTransaction",
					params: [tx],
				});

				console.log(txHash);
			}
		);
	},
};

$(() => {
	$(window).load(() => {
		App.load();
	});
});

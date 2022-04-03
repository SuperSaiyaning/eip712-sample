/* eslint-disable no-undef */
// TypedMessage 验证，签名信息由SDK生成
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

		const signature = '81a68f18bd4eecb7c97beb858d36159b7e0c30af0dcc8ced4406082145f7d9ca6e8e647823ea4fd21056218c476f6e65afadd0094d5f7a5d90d45c84ad5bb43c1c'
		const r = "0x" + signature.substring(0, 64);
		const s = "0x" + signature.substring(64, 128);
		const v = 0x1c
		console.log(r);
		console.log(s);
		console.log(v);

		const inputData = '0x0c53c51c000000000000000000000000bc5923c6c0e12250851ab359f4d4d4da2b844d0100000000000000000000000000000000000000000000000000000000000000a081a68f18bd4eecb7c97beb858d36159b7e0c30af0dcc8ced4406082145f7d9ca6e8e647823ea4fd21056218c476f6e65afadd0094d5f7a5d90d45c84ad5bb43c000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000dbbecefd155af913062ae80922e4dc19605e9e990000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000'

		const tx = {
			nonce: "0x00", // ignored by MetaMask
			from: App.account,
			to: contractAddress,
			value: "0x00",
			data: inputData,
			gasPrice: "0x4e3b29200",
			gas: "0x27100",
			chainId: 0x4,
		};

		console.log(tx);
		// txHash is a hex string
		// As with any RPC call, it may throw an error
		const txHash = await ethereum.request({
			method: "eth_sendTransaction",
			params: [tx],
		});

		console.log(txHash);

	},
};

$(() => {
	$(window).load(() => {
		App.load();
	});
});

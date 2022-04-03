/* eslint-disable no-undef */
// 简单签名信息验证
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
		const contractAddress = "0xf8Cf6ef840eF4ADC5b4e72e56BaD2e1783041D28";

		const inputData = '0xbe05970c012345678901234567890123456789012345678901234567890123456789012300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000095a64a428dc4381af69199ed9e272c857357902d7c7f556b7f296bc5d17dd38757dbed7b9b15fc8c8cd4eb773880c47f30e0d7bc440861da4017a2996f3318b0bf06e17ca74c5345d313fa63f74c5ac7c958ca1a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000'

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

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
		// 签署字符串message
		const message = '0x654d473236755342783731646e363645784c775464564b637256765a79593939'
		const from = App.account;
		const params = [message,from]
		const method = 'personal_sign'
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
				// 0xa3eaa2262f0d1955731b05f261e0b87653df513f0048e0185bc43110109dda8e5e0e097ec726cc756eb66a7e95246464b41955c5d5fd0c9e7f8a6bfe9e1bbcca1b

				const signature = result.result.substring(2);
				const r = "0x" + signature.substring(0, 64);
				const s = "0x" + signature.substring(64, 128);
				const v = parseInt(signature.substring(128, 130), 16);
				console.log(r);
				console.log(s);
				console.log(web3.utils.numberToHex(v));
			}
		);
	},
};

$(() => {
	$(window).load(() => {
		App.load();
	});
});

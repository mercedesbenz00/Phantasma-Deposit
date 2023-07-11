<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import {
		PhantasmaAPIClient,
		allContracts,
		consoleOutput,
		contractMethod,
		contractName
	} from '$lib/store';
	import {
		Base16,
		type ABIMethod,
		type ABIParameter,
		Address,
		PhantasmaAPI,
		type Token
	} from 'phantasma-ts/core';
	import { onMount } from 'svelte';
	import { NotificationError } from '../Notification/NotificationsBuilder';
	import { ConnectToMetamask, removeHTMLEntities } from '$lib/Commands/Commands';
	import { ethers } from 'ethers';
	let api: PhantasmaAPI;

	let _contractName: string;

	let selectedToken: string;
	let selectedTokenDetails: Token;
	let amount: number;
	let fromChain: number;
	let toChain: number;

	let swappers: Array<string> = [];
	let swapper: string;

	let _tokens: Array<string> = [];
	let tokensDetails: Array<Token> = [];

	let chainList = [
		{ name: 'Phantasma (PHA)', disabled: false },
		{ name: 'Ethereum (ETH)', disabled: false },
		{ name: 'Binance Smart Chain (BSC)', disabled: false }
	];

	let fromChainList = structuredClone(chainList);
	let toChainList = structuredClone(chainList);

	// Load Swappers

	onMount(async () => {
		await loadContracts();
		await loadSwappers();
	});

	async function loadContracts() {
		console.log('Loading contracts...');
		let tokens = await api.getTokens();
		tokensDetails = tokens;
		let localContracts: Array<string> = [];
		tokens.forEach((token: Token) => {
			if (token.flags.includes('Fungible')) localContracts.push(token.symbol);
		});
		//localContracts = contracts;
		_tokens = localContracts;
	}

	async function loadSwappers() {
		console.log('Loading Swappers...');
		//let swappers = await api.getSwappers();
	}

	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	function SwapTokens() {
		if (!selectedToken) {
			NotificationError('Cross Chain Swap Error!', 'Please select a token to Swap.');
			return;
		}

		if (!amount) {
			NotificationError('Cross Chain Swap Error!', 'Please enter an amount to Swap.');
			return;
		}

		if (!swapper) {
			NotificationError('Cross Chain Swap Error!', 'Please select a swapper.');
			return;
		}

		//AirdropFT(selectedToken, selectedTokenDetails, userList, totalAmount);
	}

	function ConnectMetamask() {
		ConnectToMetamask();
	}

	function onSelectedTokenChange() {
		for (let token of tokensDetails) {
			if (token.symbol == selectedToken) {
				selectedTokenDetails = token;
				break;
			}
		}
	}

	function onSwapperChange(e) {}

	function onFromChainChange(e) {
		// Remove chain from the list
		let index = -1;
		toChainList.forEach((chain) => {
			chain.disabled = false;
		});

		toChainList.forEach((chain, _index) => {
			if (chain.name == fromChainList.at(fromChain).name) {
				index = _index;
				return;
			}
		});

		if (index > -1) {
			toChainList.at(index).disabled = true;
		}
		toChainList = toChainList;
	}

	function onToChainChange(e) {
		let index = -1;
		fromChainList.forEach((chain) => {
			chain.disabled = false;
		});

		fromChainList.forEach((chain, _index) => {
			if (chain.name == toChainList.at(toChain).name) {
				index = _index;
				return;
			}
		});

		if (index > -1) {
			fromChainList.at(index).disabled = true;
		}
		fromChainList = fromChainList;
	}
</script>

<Card
	size="xl"
	title="Cross Chain Swap Tokens"
	description="Swap tokens between Phantasma and other chains."
	class="mb-20"
>
	<div class="my-1">
		<form on:submit|preventDefault={() => null}>
			<div class="grid md:grid-cols-2 md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<select
						name="token"
						id="token"
						bind:value={selectedToken}
						on:change={onSelectedTokenChange}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
					>
						<option value selected>No Token selected.</option>
						{#each _tokens as token}
							<option value={token}>
								{token}
							</option>
						{/each}
					</select>
					<label
						for="token"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Token (Symbol)</label
					>
				</div>

				<div class="relative z-0 w-full mb-6 group">
					<select
						name="swapper"
						bind:value={swapper}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						on:change={onSwapperChange}
					>
						<option value="-2">Select a Swapper.</option>
						{#each fromChainList as chain, index (index)}
							<option value={index} disabled={chain.disabled}>{chain.name}</option>
						{/each}
					</select>
					<label
						for="swapper"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Select a Swapper</label
					>
				</div>
			</div>

			<div class="grid md:grid-cols-2 md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<select
						name="fromChain"
						bind:value={fromChain}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						on:change={onFromChainChange}
					>
						<option value="-2">Select a Chain to send from.</option>
						{#each fromChainList as chain, index (index)}
							<option value={index} disabled={chain.disabled}>{chain.name}</option>
						{/each}
					</select>
					<label
						for="fromCHain"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>From Chain</label
					>
				</div>
				<div class="relative z-0 w-full mb-6 group">
					<select
						name="toChain"
						bind:value={toChain}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						on:change={onToChainChange}
					>
						<option value="-2">Select a Chain to send to.</option>
						{#each toChainList as chain, index (index)}
							<option value={index} disabled={chain.disabled}>{chain.name}</option>
						{/each}
					</select>
					<label
						for="toChain"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>To Chain</label
					>
				</div>
			</div>
			<div class="grid md:grid-cols">
				<div class="relative z-0 w-full mb-6 group">
					<input
						type="text"
						name="amount"
						id="amount"
						bind:value={amount}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="amount"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Amount to Swap</label
					>
				</div>
			</div>

			<hr class="my-6 border-t border-gray-400 border-solid" />

			<div>
				<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Actions</h3>
				<button
					on:click={SwapTokens}
					class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Swap Token</button
				>

				<button
					type="button"
					on:click={ConnectMetamask}
					class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Connect Metamask</button
				>
			</div>
		</form>
	</div>
</Card>

<style>
	.error {
		color: red;
	}

	.highlight-overlay {
		position: absolute;
		pointer-events: none;
		background-color: yellow;
		opacity: 0.5;
	}
</style>

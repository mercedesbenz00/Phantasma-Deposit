<script lang="ts">
	import { PhantasmaAPIClient, allContracts } from '$lib/store';
	import Modal from './Modal.svelte';
	import { ModalType } from './ModalType';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { BurnTokens, GetTokenDetails, StakeTokens, TransferTokens } from '$lib/Commands/Commands';
	import { Address, type PhantasmaAPI } from 'phantasma-ts/core';
	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
	let api: PhantasmaAPI;
	let _tokens: Array<string> = [];
	let burnableTokens: Array<string> = [];

	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	onMount(async () => {
		await loadContracts();
	});

	async function loadContracts() {
		let tokens = await api.getTokens();
		let localContracts = [];
		tokens.forEach((token) => {
			if (token.flags.includes('Fungible')) localContracts.push(token.symbol);
			if (token.flags.includes('Burnable')) burnableTokens.push(token.symbol);
		});
		//localContracts = contracts;
		_tokens = localContracts;
	}

	async function onSend() {
		if (!addr || !token || !amount) return;
		if (amount <= 0) return;
		if (Address.IsValidAddress(addr) == false) return;
		if (token == '' || token == 'No token selected.') return;

		let _token = await GetTokenDetails(token);
		let amountFix = amount * 10 ** _token.decimals;
		TransferTokens(token, amountFix, addr);
	}

	async function onStake() {
		console.log('stake');
		if (!addr || !token || !amount) return;
		if (amount <= 0) return;
		if (Address.IsValidAddress(addr) == false) return;
		if (token == '' || token == 'No token selected.') return;
		console.log('stake 2');

		let _token = await GetTokenDetails(token);
		let amountFix = amount * 10 ** _token.decimals;
		StakeTokens(addr, amountFix);
	}

	async function onBurn() {
		if (!addr || !token || !amount) return;
		if (amount <= 0) return;
		if (Address.IsValidAddress(addr) == false) return;
		if (token == '' || token == 'No token selected.') return;
		if (!burnableTokens.includes(token)) return;

		let _token = await GetTokenDetails(token);
		let amountFix = amount * 10 ** _token.decimals;
		console.log('burning ' + amountFix + ' ' + token, amount, _token.decimals, token);
		BurnTokens(token, amountFix);
	}

	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	let token = '';
	let amount = 0;
	let addr = '';
</script>

<Modal title="Send / Stake Tokens" modalType={ModalType.Custom} on:close={close}>
	<div class="p-6 space-y-6 w-80">
		<form on:submit|preventDefault={() => null}>
			<div class="grid md:grid-cols md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<input
						type="text"
						name="method"
						id="method"
						bind:value={addr}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="method"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Address</label
					>
				</div>
			</div>
			<div class="grid md:grid-cols-2 md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<input
						type="number"
						name="method"
						id="method"
						bind:value={amount}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="method"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Amount</label
					>
				</div>
				<div class="relative z-0 w-full mb-6 group">
					<select
						name="contract"
						id="contract"
						bind:value={token}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
					>
						<option value="" selected>No token selected.</option>
						{#each _tokens as contractName}
							<option value={contractName}>
								{contractName}
							</option>
						{/each}
					</select>
					<label
						for="organization"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Token</label
					>
				</div>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div
		class="flex items-center p-6 space-x-2 rounded-b border-t justify-center border-gray-200 dark:border-gray-600"
	>
		<button
			class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			on:click={onSend}>Send</button
		>
		<button
			class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			on:click={onStake}>Stake</button
		>
		<button
			class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			on:click={onBurn}>Burn</button
		>
		<button
			type="button"
			class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
			on:click={close}>Cancel</button
		>
	</div>
</Modal>

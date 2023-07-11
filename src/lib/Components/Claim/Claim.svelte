<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import {
		EthereumAddress,
		KCALAddressBNB,
		KCALAddressETH,
		PhantasmaAPIClient,
		SOULAddressBNB,
		SOULAddressETH,
		allContracts,
		connectWallet,
		consoleOutput,
		contractMethod,
		contractName,
		walletOpened
	} from '$lib/store';
	import {
		NotificationError,
		NotificationSuccess,
		NotificationWarning
	} from '../Notification/NotificationsBuilder';
	import {
		ApproveTokens,
		CheckAllowance,
		ConnectToMetamask,
		DepositAll,
		DepositKCAL,
		DepositSOUL,
		DisconnectFromMetamask,
		GetBalance,
		GetNetworkInfo,
		removeHTMLEntities
	} from '$lib/Commands/Commands';
	import { ethers } from 'ethers';
	import type { PhantasmaAPI, Token } from 'phantasma-ts/core';
	import { LinkWallet, connectedToWallet } from '$lib/store';
	import { PhantasmaLink } from 'phantasma-ts';
	let api: PhantasmaAPI;
	let link: PhantasmaLink;
	let ethAddress: string;
	let isSOULApproved: boolean = false;
	let isKCALApproved: boolean = false;
	let SOULAddress = SOULAddressETH;
	let KCALAddress = KCALAddressETH;
	let SOULBalance: bigint;
	let KCALBalance: bigint;
	let SOULAllowance: bigint;
	let KCALAllowance: bigint;
	let networkInfo: ethers.Network;

	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	LinkWallet.subscribe((value) => {
		link = value;
	});

	EthereumAddress.subscribe((value) => {
		ethAddress = value;
	});

	function ConnectToPhantasma() {
		connectWallet.set(true);
	}

	function DisconnectPhantasmaWallet() {
		LinkWallet.set(new PhantasmaLink('', false));
		NotificationSuccess('Wallet Disconnected!', 'Disconnected from Phantasma Wallet');
	}

	function CheckForPhantasmaWalletConnection() {
		if (!link.account) {
			NotificationError('No Phantasma Wallet Connected', 'Please connect to a Phantasma Wallet');
			return false;
		}

		return true;
	}

	async function ConnectMetamask() {
		await ConnectToMetamask();
		networkInfo = await GetNetworkInfo();
		if (networkInfo.chainId === 56n) {
			SOULAddress = SOULAddressBNB;
			KCALAddress = KCALAddressBNB;
		} else if (networkInfo.chainId === 1n) {
			SOULAddress = SOULAddressETH;
			KCALAddress = KCALAddressETH;
		}
	}

	async function DisconnectMetamask() {
		await DisconnectFromMetamask();
		isKCALApproved = false;
		isSOULApproved = false;
		networkInfo = undefined;
		SOULBalance = 0n;
		KCALBalance = 0n;
		SOULAllowance = 0n;
		KCALAllowance = 0n;
	}

	$: {
		if (networkInfo) {
			CheckAllowances();
			GetBalances();
		}
	}

	async function ApproveKCAL() {
		if (isKCALApproved) {
			console.log('Approve');
			return;
		}

		isKCALApproved = await ApproveTokens(KCALAddress, KCALBalance.toString());
	}

	async function ApproveSOUL() {
		if (isSOULApproved) {
			console.log('Approve');
			return;
		}

		isSOULApproved = await ApproveTokens(SOULAddress, SOULBalance.toString());
	}

	async function ApproveAll() {
		await ApproveSOUL();
		await ApproveKCAL();
	}

	async function TransferSOUL() {
		if (!isSOULApproved) {
			await ApproveSOUL();
			return;
		}

		if (!CheckForPhantasmaWalletConnection()) {
			return;
		}

		await DepositSOUL(link.account.address);
	}

	async function TransferKCAL() {
		if (!isKCALApproved) {
			await ApproveKCAL();
			return;
		}

		if (!CheckForPhantasmaWalletConnection()) {
			return;
		}

		await DepositKCAL(link.account.address);
	}

	async function TransferAll() {
		if (!isSOULApproved || !isKCALApproved) {
			await ApproveAll();
			return;
		}

		if (!CheckForPhantasmaWalletConnection()) {
			return;
		}

		await DepositAll(link.account.address);
	}

	async function CheckAllowances() {
		SOULAllowance = await CheckAllowance(SOULAddress);
		KCALAllowance = await CheckAllowance(KCALAddress);
		if (SOULAllowance > 0n) {
			isSOULApproved = true;
		}

		if (KCALAllowance > 0n) {
			isKCALApproved = true;
		}
	}

	async function GetBalances() {
		SOULBalance = await GetBalance(SOULAddress);
		KCALBalance = await GetBalance(KCALAddress);

		console.log(SOULBalance);
		console.log(KCALBalance);
	}
</script>

<Card
	size="xl"
	title="Token Deposit"
	description="Deposit tokens from Eth / Bsc to Phantasma."
	class="mb-20"
>
	<div class="my-1">
		<form on:submit|preventDefault={() => null}>
			<p>
				Experience seamless cross-chain transactions with our Dual-Wallet Deposit Interface. Connect
				both your Metamask and Phantasma (Ecto or Poltergeist) wallets, deposit your funds, and let
				us take care of the rest. Our dApp bridges the gap between Ethereum or Binance Smart Chain
				and the Phantasma Chain, allowing you to deposit and transfer your assets securely and
				effortlessly. Start harnessing the power of blockchain interoperability today with our
				user-friendly and transparent service.
			</p>

			<div class="grid md:grid-cols md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<p>Connection to Phantasma</p>
					{#if !link.account}
						<button
							id="connectToPhantasma"
							on:click={ConnectToPhantasma}
							class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
                        focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							>Connnect to Phantasma Wallet</button
						>
					{:else}
						<p>Connected to Phantasma <br /><b>{link.account.address}</b></p>
						<button
							id="signOutPhantasma"
							on:click={DisconnectPhantasmaWallet}
							class="text-white bg-red-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
                        focus:ring-red-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
							>Disconnect from Phantasma Wallet</button
						>
					{/if}
				</div>
			</div>

			<div class="grid md:grid-cols md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<p>Connection to Metamask</p>
					{#if !ethAddress}
						<button
							id="connectMetamask"
							class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
                    focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							on:click={ConnectMetamask}>Connnect to Metamask</button
						>
					{:else}
						<p>
							Connected to
							<b>
								{#if networkInfo !== undefined}
									{#if networkInfo.chainId === 56n}
										Binance Smart Chain
									{:else if networkInfo.chainId === 1n}
										Ethereum
									{:else}
										Unknown
									{/if}
								{:else}
									Unknown
								{/if}
							</b>
							via Metamask <br /><b>{ethAddress}</b>
						</p>
						<button
							id="disconnectMetamask"
							on:click={DisconnectMetamask}
							class="text-white bg-red-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
                        focus:ring-red-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
							>Disconnect from Metamask Wallet</button
						>
					{/if}
				</div>
			</div>

			<hr class="my-6 border-t border-gray-400 border-solid" />

			<div>
				<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Actions</h3>
				<button
					on:click={TransferSOUL}
					class:disabledButton={!ethAddress || !link.account || SOULBalance <= 0n}
					class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					{#if SOULBalance <= 0n}
						No SOUL to deposit
					{:else if !isSOULApproved}
						Approve SOUL
					{:else}
						Deposit SOUL
					{/if}
				</button>
				<!-- Deposit SOUL -->

				<button
					on:click={TransferKCAL}
					class:disabledButton={!ethAddress || !link.account || KCALBalance <= 0n}
					class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
                    focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					{#if KCALBalance <= 0n}
						No KCAL to deposit
					{:else if !isKCALApproved}
						Approve KCAL
					{:else}
						Deposit KCAL
					{/if}
				</button>
				<!-- Deposit KCAL -->

				<button
					on:click={TransferAll}
					class:disabledButton={!ethAddress ||
						!link.account ||
						SOULBalance <= 0n ||
						KCALBalance <= 0n}
					class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
                    focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					{#if !isKCALApproved && !isSOULApproved}
						Approve All
					{:else}
						Deposit All
					{/if}
				</button>
			</div>
		</form>
	</div>
</Card>

<style>
	.error {
		color: red;
	}

	.disabledButton {
		opacity: 0.5;
		pointer-events: none;
	}

	.highlight-overlay {
		position: absolute;
		pointer-events: none;
		background-color: yellow;
		opacity: 0.5;
	}
</style>

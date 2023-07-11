<script lang="ts">
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import { apiLink, apiStatus, MainnetURL, SimnetURL, TestnetURL } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	const change = () => dispatch('change');

	export let openSwap = false;

	function onOpenSwap() {
		openSwap = !openSwap;
		change();
	}
</script>

<Card size="md">
	<div class="flex-none w-2/3 max-w-full px-3">
		<div>
			<p class="mb-0 font-sans font-semibold leading-normal text-base">Cross-chain Swap</p>
			<h5 class="mb-0 font-normal text-sm">
				Swap tokens from Phantasma to Ethereum and Binance Smart Chain.
			</h5>
		</div>
		<div>
			<button
				class:airdrop-open={!openSwap}
				class:airdrop-close={openSwap}
				class="rounded-md text-white p-2"
				on:click={onOpenSwap}
			>
				{#if !openSwap}
					Cross Chain Swap
				{:else}
					Close
				{/if}
			</button>
		</div>
	</div>
	<div class="px-3 text-right basis-1/3">
		<div
			class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500"
		>
			<Icon
				height="18"
				width="18"
				class="text-lg relative top-2.5 text-white"
				icon="uil:money-withdraw"
			/>
		</div>
	</div>
</Card>

<style>
	.airdrop-open {
		@apply bg-green-500;
	}

	.airdrop-close {
		@apply bg-red-500;
	}
</style>

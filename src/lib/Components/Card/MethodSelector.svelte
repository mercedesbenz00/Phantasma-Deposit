<script lang="ts">
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import {
		LinkWallet,
		LinkDapp,
		PhantasmaAPIClient,
		contractDetails,
		contractMethod
	} from '$lib/store';
	import type { Contract, PhantasmaAPI } from 'phantasma-ts/core';
	import { onMount } from 'svelte';
	import { PhantasmaLink } from 'phantasma-ts';
	//import { PhantasmaLink } from 'phantasma-ts/src/core/link/phantasmaLink';

	let contractSelectedName: string;
	let selectedMethod: string;

	let methods: Array<string> = new Array<string>();

	let api: PhantasmaAPI;
	PhantasmaAPIClient.subscribe((value) => {
		api = value;
		selectedMethod = 'null';
	});

	let contractInfo: Contract;
	contractDetails.subscribe((value) => {
		contractInfo = value;
		if (value != null) {
			console.log({ contractInfo });
			if (value != null && value.methods != null) {
				methods = [];
				for (let method of value.methods) {
					methods.push(method.name);
				}
			}
		}
	});

	function selectMethod() {
		console.log(selectedMethod);
		if (contractInfo != null && contractInfo.methods != null) {
			const methodSelected = contractInfo.methods.find((method) => method.name == selectedMethod);
			contractMethod.set(methodSelected);
		}
	}
</script>

<Card size="sm">
	<div class="flex-none w-2/3 max-w-full px-3">
		<div>
			<p class="mb-0 font-sans font-semibold leading-normal text-base">Method Select</p>
			<h5 class="mb-0 font-normal text-sm">Select the method to interact.</h5>
		</div>
		<div>
			<select name="method" bind:value={selectedMethod} class="w-full" on:change={selectMethod}>
				<option value="null" selected>No method selected.</option>
				{#each methods as method}
					<option value={method}>{method}</option>
				{/each}
			</select>
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
				icon="codicon:symbol-method"
			/>
		</div>
	</div>
</Card>

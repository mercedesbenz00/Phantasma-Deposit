<script lang="ts">
	import { PhantasmaAPIClient, consoleOutput } from '$lib/store';
	import type { PhantasmaAPI } from 'phantasma-ts/core';
	import Modal from './Modal.svelte';
	import { ModalType } from './ModalType';
	import { createEventDispatcher, onDestroy } from 'svelte';
	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
	export let hash = '';
	let api: PhantasmaAPI;
	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	function onModalConfirm() {
		console.log('hash: ' + hash);
		if (hash) {
			let result = api.getTransaction(hash);
			result.then((value) => {
				console.log(value);
				consoleOutput.set(JSON.stringify(value, null, 2));
			});
			dispatch('confirm', hash);
			close();
		}
	}
</script>

<Modal
	title="Transaction By Hash"
	modalType={ModalType.Information}
	on:close={close}
	on:confirm={onModalConfirm}
	><form on:submit|preventDefault={() => null}>
		<div class="grid md:grid-cols md:gap-6">
			<div class="relative z-0 w-full mb-6 group">
				<input
					type="text"
					name="method"
					id="method"
					bind:value={hash}
					class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
					placeholder=" "
					required
				/>
				<label
					for="method"
					class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>Transaction Hash</label
				>
			</div>
		</div>
	</form></Modal
>

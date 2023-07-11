<script lang="ts">
	import { consoleOutput } from '$lib/store';
	import { Base16 } from 'phantasma-ts/core';
	import { DecodeInformation, DecodeStruct, FormatData } from '$lib/Commands/Commands';
	import Modal from './Modal.svelte';
	import { ModalType } from './ModalType';
	import { createEventDispatcher, onDestroy } from 'svelte';
	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
	export let information = '';

	function onModalConfirm() {
		console.log('information: ' + information);
		if (information) {
			try {
				let decoded = DecodeInformation(information);
				let formatedData = FormatData(decoded);
				console.log('formated data: ', formatedData);
				consoleOutput.set(JSON.stringify(formatedData, null, 2));
			} catch (e) {
				console.log('error: ', e);
				let decodedBase16 = Base16.decode(information);
				consoleOutput.set(JSON.stringify(decodedBase16, null, 2));
			}

			dispatch('confirm', information);
			close();
		}
	}
</script>

<Modal
	title="Decode Information"
	modalType={ModalType.Information}
	on:close={close}
	on:confirm={onModalConfirm}
>
	<form on:submit|preventDefault={() => null}>
		<div class="grid md:grid-cols md:gap-6">
			<div class="relative z-0 w-full mb-6 group">
				<input
					type="text"
					name="method"
					id="method"
					bind:value={information}
					class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
					placeholder=" "
					required
				/>
				<label
					for="method"
					class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>Decode Information</label
				>
			</div>
		</div>
	</form>
</Modal>

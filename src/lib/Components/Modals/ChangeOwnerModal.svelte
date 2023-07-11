<script lang="ts">
	import { allContracts } from '$lib/store';
	import Notification from '../Notification/Notification.svelte';
	import { NotificationError } from '../Notification/NotificationsBuilder';
	import Modal from './Modal.svelte';
	import { ModalType } from './ModalType';
	import { createEventDispatcher, onDestroy } from 'svelte';
	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
	let owner = '';
	let selectContract = '';
	let contracts: Array<string>;
	allContracts.subscribe((value) => {
		contracts = value;
	});

	function changeOwner() {
		console.log('change owner');
		NotificationError('Error', 'Not implemented yet.');
	}
</script>

<Modal
	title="Change Owner"
	modalType={ModalType.Information}
	on:close={close}
	on:confirm={changeOwner}
>
	<form on:submit|preventDefault={() => null}>
		<div class="grid md:grid-cols md:gap-6">
			<div class="relative z-0 w-full mb-6 group">
				<select
					name="contract"
					id="contract"
					bind:value={selectContract}
					class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
				>
					<option value selected>No contract selected.</option>
					{#each contracts as contractName}
						<option value={contractName}>
							{contractName}
						</option>
					{/each}
				</select>
				<label
					for="organization"
					class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>Contract</label
				>
			</div>
		</div>
		<div class="grid md:grid-cols md:gap-6">
			<div class="relative z-0 w-full mb-6 group">
				<input
					type="text"
					name="method"
					id="method"
					bind:value={owner}
					class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
					placeholder=" "
					required
				/>
				<label
					for="method"
					class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>Owner Address</label
				>
			</div>
		</div>
	</form>
</Modal>

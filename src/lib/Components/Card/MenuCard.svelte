<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import Icon from '@iconify/svelte';

	export let title: string;
	export let description: string;
	export let icon: string;
	export let href: string;
</script>

<Card size="sm" class="my-3">
	<div class="flex-none w-2/3 max-w-full px-3 ">
		<div>
			<p class="mb-0 font-sans font-semibold leading-normal text-base">{title}</p>
			<h5 class="mb-0 font-normal text-sm">{description}</h5>
		</div>

		<div class="w-full mt-2">
			<a
				{href}
				class="rounded-md p-2 bg-blue-500 hover:bg-blue-700 min-w-full h-full w-full text-white "
			>
				{title}
			</a>
		</div>
	</div>
	<div class="px-3 text-right basis-1/3">
		<div
			class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500"
		>
			<Icon height="18" width="18" class="text-lg relative top-2.5 text-white" {icon} />
		</div>
	</div>
</Card>

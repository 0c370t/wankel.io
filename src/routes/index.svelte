<script lang="ts">
	import Test from '$lib/components/Test.svelte';
	import TestStore from '$lib/stores/TestStore';
</script>

<main>
	<section class="words">
		{#if $TestStore.complete}
			<div>
				<span>All Done!</span>
				<p>Error Rate: {TestStore.errorRate.toFixed(2)}%</p>
				<p>WPM: {TestStore.wpm.toFixed(2)}</p>

				<button on:click={() => TestStore.initialize(10)}>Start Over</button>
			</div>
		{:else}
			<Test />
		{/if}
	</section>
</main>

<style lang="postcss">
	main {
		@apply w-screen h-screen 
        grid grid-cols-12 grid-rows-6 gap-2 bg-slate-700;
	}
	.words {
		@apply col-start-4 col-span-6 
               row-start-2 row-span-4
               text-slate-100 text-2xl
               flex justify-center items-center flex-col bg-slate-700 
               select-none p-8 text-center;
	}

	.line {
		@apply block;
	}
</style>

<script lang="ts">
import TestStore from "$lib/stores/TestStore";

    TestStore.initialize(30)
	function handleKeyPress(e: KeyboardEvent) {
		if ($TestStore.complete) return;

		if (e.key.length > 1) {
			if (e.key === 'Backspace') {
                TestStore.back()
			}
		} else {
            TestStore.input(e.key);
		}
	}
</script>

<svelte:body on:keydown={handleKeyPress} />

<div class="test">
	{#each $TestStore.characters as char, i}
		<span
			class="word"
			class:correct={char.typed === char.char}
			class:incorrect={char.typed !== char.char && char.typed}
			class:current={i === $TestStore.cursor}>{char.char}</span
		>
	{/each}
</div>

<style lang="postcss">
	.test {
		@apply text-slate-500;
	}

	.word {
		&:not(:last-child) {
			@apply mr-2;
		}
		&.current {
			animation-name: cursor-blink;
			animation-duration: 500ms;
			animation-timing-function: linear;
			animation-iteration-count: infinite;
			@apply border-b-2;
		}
		&.correct {
			@apply text-slate-100;
		}
		&.incorrect {
			@apply text-red-400;
		}
	}

	@keyframes cursor-blink {
		0% {
			@apply border-b-transparent;
		}
		49% {
			@apply border-b-transparent;
		}
		50% {
			@apply border-b-current;
		}
		99% {
			@apply border-b-current;
		}
	}
</style>

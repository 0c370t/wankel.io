<script lang="ts">
	type Character = {
		char: string;
		typed: string | false;
	};

	import randomWords from 'random-words';
    const wordCount = 30;
	let characters = randomWords(wordCount)
		.join(' ')
		.split('')
		.map<Character>((c) => ({ char: c, typed: false }));

	let cursor = 0;
	
	let finished = false;
    let start = undefined,
        end = undefined,
        duration = undefined;
    $: if (start && end) duration = (end - start) / 1000;

	function handleKeyPress(e: KeyboardEvent) {
		if (finished) return;
        
        let currentCharacter = characters[cursor];
        if (!start) start = performance.now();
		if (e.key.length > 1) {
			if (e.key === 'Backspace') {
				cursor--;
				if (characters[cursor]) characters[cursor].typed = false;
			}
		} else {
			currentCharacter.typed = e.key;
            
			cursor++;
		}
		

		if (cursor === characters.length) {
            finished = true;
            end = performance.now();
            characters = characters.filter(c => c.char !== ' ')
        } else {
            characters = characters;
        }
	}
</script>

<svelte:body on:keydown={handleKeyPress} />

<main>
	<section class="words">
		{#if finished}
            <div>
                <span>All Done!</span>
                <p>Error Rate: {(characters.reduce((a,b)=>b.char === b.typed ? a : a+1,0) / characters.length).toFixed(2)}%</p>
                <p>WPM: {(wordCount / duration * 60).toFixed(2)}</p>
            </div>
        {:else}
			<div class="test">
                {#if start} <p>Started!</p> {/if}
                
				{#each characters as char, i}
					<span
						class="word"
						class:correct={char.typed === char.char}
						class:incorrect={char.typed !== char.char && char.typed}
						class:current={i === cursor}>{char.char}</span
					>
				{/each}
			</div>
		{/if}
	</section>
</main>

<style lang="postcss">
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
        & .test {
            @apply text-slate-500
        }
	}

	.line {
		@apply block;
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
</style>

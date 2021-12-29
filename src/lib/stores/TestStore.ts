import type { Readable, Subscriber, Unsubscriber } from "svelte/store";
import randomWords from 'random-words';

interface ICharacter {
    char: string;
    typed: string | false;
    time?: number;
}

interface ITest {
    characters: ICharacter[];
    wordCount: number;
    cursor: number;
    complete: boolean;
}

class TestStore implements Readable<ITest> {
    /* Store Specific State */
    private subscribers: Set<(t: ITest) => unknown> = new Set();
    private get state(): ITest {
        return {
            characters: this.characters,
            wordCount: this.wordCount,
            cursor: this.cursor,
            complete: this.complete
        }
    }

    private dispatch = () => this.subscribers.forEach(r => r(this.state));

    private characters: ICharacter[] = [];
    private wordCount = 0;
    private cursor = 0;
    private complete = false;
    
    get duration(): number {
        const end = this.characters[this.characters.length - 1].time
        const start = this.characters[0].time;
        return (end - start) / 1000;
    }
    get errorRate(): number {
        return (this.characters.reduce((a, b) => (b.char === b.typed ? a : a + 1), 0) / this.characters.length) * 100
    }
    get wpm(): number {
        return this.wordCount / this.duration * 60;
    }

    initialize(numWords: number) {
        this.complete = false;
        this.cursor = 0;
        this.wordCount = numWords;
        this.characters = randomWords(numWords)
    		.join(' ')
	    	.split('')
		    .map<ICharacter>((c) => (
                { char: c, typed: false }
            ));
        this.dispatch()
    }

    subscribe(run: Subscriber<ITest>): Unsubscriber {
        this.subscribers.add(run);
        run(this.state);

        return () => this.subscribers.delete(run);
    }

    moveCursor() {
        this.cursor += 1;

        if (this.cursor === this.characters.length) {
            this.complete = true;
        }

        this.dispatch();
    }

    input(typed: string) {
        this.characters[this.cursor].typed = typed;
        this.characters[this.cursor].time = Date.now();
        this.moveCursor();
    }

    back() {
        this.cursor -= 1;
        this.characters[this.cursor].typed = undefined;
        this.characters[this.cursor].time = undefined;
        this.dispatch()
    }
    
}

export default new TestStore();
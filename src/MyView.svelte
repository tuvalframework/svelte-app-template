<script>
	import { title, comicSans, box } from './css.js';
	let count = 0;

	function handleClick() {
		count += 1;
	}
</script>

<div>Test</div>
<div>Son Test</div>
<button class={box} on:click={handleClick}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
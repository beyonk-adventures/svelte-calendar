<svelte:head>
  <link rel="stylesheet" href="//unpkg.com/@highlightjs/cdn-assets@10.4.0/styles/default.min.css">
  <script src="//unpkg.com/@highlightjs/cdn-assets@10.4.0/highlight.min.js"></script>
	<link href="https://fonts.googleapis.com/css?family=Rajdhani:400,700" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/rainbow.min.css"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</svelte:head>

<script>
	import { SvelteCalendar as DatePicker, CalendarStyle } from './main.js'

	const today = new Date()
	const start = new Date()
	const dateFormat = 'ddd, DD MMM, YYYY'
	const noWeekendsSelectableCallback = (date) => date.getDay() !== 0 && date.getDay() !== 6
	let dateChosen = false
	let exampleChosen = false
	
	let threeDaysInPast
	$: {
	  const date = new Date(today)
	  date.setDate(date.getDate() - 3)
	  threeDaysInPast = date
	}

	let tomorrow
	$: {
	  const date = new Date(today)
	  date.setDate(date.getDate() + 1)
	  tomorrow = date
	}

	let inThirtyDays
	$: {
	  const date = new Date(start)
	  date.setDate(date.getDate() + 30)
	  inThirtyDays = date
	}

	function logChoice (date1, date2) {
		console.log(`Selected date ${date1}.`)
	  if (date2) {
	    console.log(`Selected end date ${date2}.`)
	  }
	}

$: window.hljs && window.hljs.initHighlightingOnLoad()
</script>

<h1>SvelteCalendar</h1>
<div class='container'>
  <p>With a timepicker: </p>

	<DatePicker format='ddd, DD MMM YYYY, HH:mm' includeTime={true} />

	<p>A lightweight date picker written with Svelte. Here is an example: </p>

	<DatePicker format='{dateFormat}' />

	<p>This component can be used with or without the Svelte compiler.</p>
	<ul>
		<li>Lightweight (~8KB)</li>
		<li>IE11+ Compatible</li>
		<li>Usable as a Svelte component</li>
		<li>Usable with Vanilla JS / &lt;Your Framework Here&gt;</li>
		<li>Can be compiled to a native web component / custom element</li>
		<li>Mobile/thumb friendly</li>
		<li>Keyboard navigation (arrows, pgup/pgdown, tab, esc)</li>
	</ul>

	<p>Above you can see the default styling of this component.  This will be created for you by default when using the component but you can also pass in your own calendar 'trigger' either as a slot (custom element or svelte) or as a DOM node reference (use as vanilla JS).  Here are some examples:</p>

	<h4>With Svelte:</h4>
	<pre><code class='html'>
&lt;DatePicker format={dateFormat} let:formatted bind:dateChosen&gt;
  &lt;button class='custom-button'&gt;
    &#123;#if dateChosen} Chosen: &#123;formatted.formattedSelected} &#123;:else} Pick a date &#123;/if}
  &lt;/button&gt;
&lt;/DatePicker&gt;
	</code></pre>

	<div class='text-center'>
		<DatePicker format='ddd, DD MMM YYYY, HH:mm' let:formatted bind:dateChosen>
			<button class='custom-button'>
				{#if dateChosen} Chosen: {formatted.formattedSelected} {:else} Pick a date {/if}
			</button>
		</DatePicker>
	</div>

	<h4>Without Svelte HTML:</h4>
	<pre><code class='html'>
&lt;div class='button-container'&gt;
  &lt;button id='test'&gt;My Custom Button&lt;/button&gt;
&lt;/div&gt;
	</code></pre>

	<h4>Without Svelte JS:</h4>
	<pre><code class='js'>
var trigger = document.getElementById('test');
var cal = new SvelteCalendar(&#123; 
  target: document.querySelector('.button-container'),
  anchor: trigger, 
  props: &#123;
    trigger: trigger
  }
});
	</code></pre>

	<div class='text-center'>
		<DatePicker let:formatted bind:dateChosen={exampleChosen}>
			<button id='test'>
				{#if exampleChosen} {formatted.formattedSelected} {:else}  Custom Button {/if}
			</button>
		</DatePicker>
	</div>

	<p>You can confine the date selection range with start and end:</p>

	<div class='text-center'>
		<DatePicker format={dateFormat} start={threeDaysInPast} end={inThirtyDays} selectableCallback={noWeekendsSelectableCallback} />
	</div>

	<p class='note'>Note: The calendar will only generate dates up until the end date, so it is recommended to set this value to whatever is useful for you.</p>

	<p>You can also provide a `selectableCallback` prop which can be used to mark individual days between `start` and `end` as selectable.  This callback should accept a single date as an argument and return true (if selectable) or false (if unavailable).</p>

	<div class='text-center'>
		<DatePicker format={dateFormat} start={tomorrow} end={inThirtyDays} selectableCallback={noWeekendsSelectableCallback} />
	</div>

	<p>You can bind to the `dateSelected` event, which has a data property `date`:</p>
	
	<div class='text-center'>
		<DatePicker format={dateFormat} on:dateSelected={e => logChoice(e.detail.date)} />
	</div>

	<p>If it's a range picker, it has from and to:</p>
	
	<div class='text-center'>
		<DatePicker rangePicker={true} format={dateFormat} on:dateSelected={e => logChoice(e.detail.from, e.detail.to)} />
	</div>

	<p>You can theme the datepicker:</p>
	<div>
		<DatePicker 
      format={dateFormat}
      styling={new CalendarStyle({
        buttonBackgroundColor: '#e20074',
        buttonTextColor: 'white',
        highlightColor: '#e20074',
        dayBackgroundColor: '#efefef',
        dayTextColor: '#333',
        dayHighlightedBackgroundColor: '#e20074',
        dayHighlightedTextColor: '#fff'
      })}
		/>
	</div>
	<pre><code class="html">
&lt;DatePicker 
  format={dateFormat} 
  styling={new CalendarStyle({
    buttonBackgroundColor: '#e20074',
    buttonTextColor: 'white',
    highlightColor: '#e20074',
    dayBackgroundColor: '#efefef',
    dayTextColor: '#333',
    dayHighlightedBackgroundColor: '#e20074',
    dayHighlightedTextColor: '#fff'
  })}
/&gt;
	</code></pre>

  <p>You can turn the DatePicker into a RangePicker:</p>

	<div class='text-center'>
		<DatePicker format={dateFormat} rangePicker={true} />
	</div>

</div>

<style>
  :global(body) {
    font-family: Rajdhani, sans-serif;
  }
	h1 { 
		text-align: center;
		margin: 100px 0;
	}
	.container {
	  background: #eee;
		padding: 15px;
		max-width: 100%; 
		width: 800px;
		margin: 0 auto;
	}
	.custom-button {
	  display: inline-block;
	  background: rgb(0, 120, 255);
	  color: #eee;
	  border: 1px solid rgb(0, 100, 255);
	  text-align: center;
	  padding: 15px 30px;
	  cursor: pointer;
	}
	.text-center {
	  text-align: center;
	}
	.note {
		color: tomato;
	}
  pre {
    overflow-x: scroll;
  }
</style>

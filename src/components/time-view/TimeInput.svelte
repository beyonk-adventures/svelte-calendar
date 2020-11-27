<div class="time-picker" class:night={!$daytime}>
  <div class="controls">
    <Chevron up={true} on:click={() => increment('hour')} />
    <Chevron up={true} on:click={() => increment('minute')} />
  </div>
  <input type="text" use:timeInput={time} />
  <div class="controls">
    <Chevron up={false} on:click={() => decrement('hour')} />
    <Chevron up={false} on:click={() => decrement('minute')} />
  </div>
</div>

<script>
  import { onMount, getContext } from 'svelte'
  import Chevron from './Chevron.svelte'
  import { timeInput } from './time-input.js'
  import { createStore } from './time-store.js'
  import { contextKey } from '../lib/context.js'

  const { time, isDaytime, config } = getContext(contextKey)
  const { daytime, increment, decrement } = createStore(time, config.morning, config.night)
  
  onMount(() => daytime.subscribe(d => isDaytime.set(d)))
</script>

<style>
  .time-picker {
    display: flex;
    flex-direction: column;
    color: var(--highlight-color);
    width: 60%;
  }
  
  .time-picker.night {
    color: white;
  }
  
  .time-picker.night input {
    color: white;
  }
  
  input {
    background-color: transparent;
    display: flex;
    border-width: 0 0 1px 0;
    border-color: inherit;
    font-family: inherit;
    font-size: 42px;
    line-height: 42px;
    text-align: center;
    letter-spacing: 16px;
    color: var(--button-text-color);
  }
  
  .controls {
    display: flex;
    justify-content: space-around;
  }
</style>
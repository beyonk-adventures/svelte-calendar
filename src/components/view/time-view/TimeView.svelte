<script>
  import { contextKey } from '../../lib/context.js'
  import TimeInput from './TimeInput.svelte'
  import { getContext, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let viewContextKey
  const { date, isStart } = getContext(viewContextKey)
  const { config } = getContext(contextKey)
</script>

<div class="time-container">
  <span>{$date}</span>
  <TimeInput {viewContextKey} />
  {#if !(config.isRangePicker && isStart)}
  <button class="button" on:click={() => dispatch('time-chosen')}>confirm</button>
  {/if}
</div>

<style>
  .time-container {
    height: 300px;
    display: flex;
    flex: 1 0 auto;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }

  .button {
    font-size: 16px;
    padding: 12px;
    border: 0;
    width: 60%;
    border-radius: 5px;
    font-weight: 600;
    color: var(--time-confirm-button-text-color);
    background-color: var(--time-confirm-button-color);
  }
</style>
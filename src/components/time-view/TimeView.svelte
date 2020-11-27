<script>
  import TimeInput from './TimeInput.svelte'
  import { getContext, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let pickerContextKey
  const { date } = getContext(pickerContextKey)
</script>

<div class="time-container">
  <span>{$date}</span>
  <TimeInput {pickerContextKey} />
  <button class="button" on:click={() => dispatch('date-chosen', { date: $date })}>confirm</button>
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
<script>
  import dayjs from 'dayjs/esm'
  import TimeInput from './TimeInput.svelte'
  import { getContext, createEventDispatcher } from 'svelte'
  import { contextKey } from '../lib/context.js'

  const dispatch = createEventDispatcher()
  const { selectedDate, time } = getContext(contextKey)

  function confirmTime () {
    const [ h, m ] = $time.split(':').map(parseInt)
    selectedDate.set(
      dayjs(selectedDate).hour(h).minute(m).toDate()
    )
    dispatch('close')
  }
</script>

<div class="time-container">
  <span>{$selectedDate}</span>
  <TimeInput />
  <button class="button" on:click={confirmTime}>confirm</button>
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
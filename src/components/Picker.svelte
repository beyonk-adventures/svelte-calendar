<div class="calendar" class:day={$isDaytime} class:night={!$isDaytime} class:is-range-picker={config.isRangePicker}>
  <svelte:component
    {pickerContextKey}
    this={component}
    on:date-chosen={e => setDate(e.detail.date)}
  />
</div>

<script>
  import { contextKey } from './lib/context'
  import { createContext } from './picker-context.js'
  import { setContext, getContext, createEventDispatcher } from 'svelte'
  import DateView from './date-view/DateView.svelte'
  import TimeView from './time-view/TimeView.svelte'

  export let pickerContextKey
  export let isStart
  export let date

  const dispatch = createEventDispatcher()
  const { config } = getContext(contextKey)
  
  const pickerContext = createContext(date, config.morning, config.night)
  setContext(pickerContextKey, pickerContext)
  const { date: dateStore, chosen, isDaytime } = pickerContext

  let component = DateView

  function setDate (value) {
    dateStore.set(value)

    if (component === DateView && config.includeTime) {
      component = TimeView
    } else if (isStart && !config.isRangePicker) {
      chosen.set(true)
      dispatch('date-chosen', { date: $dateStore })
    }
  }
</script>

<style>
  .calendar {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    user-select: none;
    width: 100vw;
    padding: 10px;
    padding-top: 0;
    transition: background 0.15s ease;
  }

  .calendar.day {
    background-color: white;
  }

  .calendar.night {
		background-color: #0DAD83;
  }
  
  @media (min-width: 600px) {
    .calendar {
      height: auto;
      width: 320px;
      max-width: 100%;
    }
/* 
    .calendar.is-range-picker {
      width: 680px;
    } */
  }
</style>
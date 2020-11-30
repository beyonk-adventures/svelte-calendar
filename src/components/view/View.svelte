<div class="calendar" class:day={$isDaytime} class:night={!$isDaytime}>
  <svelte:component
    {viewContextKey}
    this={component}
    on:date-chosen
    on:time-chosen
  />
</div>

<script>
  import { contextKey } from '../lib/context'
  import { createViewContext } from './view-context.js'
  import { setContext, getContext, onMount, createEventDispatcher } from 'svelte'
  import DateView from './date-view/DateView.svelte'
  import TimeView from './time-view/TimeView.svelte'

  export let viewContextKey
  export let isStart
  export let date

  const dispatch = createEventDispatcher()

  const { months, config, choices } = getContext(contextKey)
  
  const viewContext = createViewContext(isStart, date, months, config)
  setContext(viewContextKey, viewContext)
  const { isDaytime } = viewContext

  let component = DateView

  onMount(() => {
    return choices.subscribe(({ allDatesChosen, allTimesChosen }) => {
      if (!allDatesChosen) {
        component = DateView 
      } else if (allDatesChosen && !allTimesChosen) {
        component = TimeView
      } else if (allDatesChosen && allTimesChosen) {
        dispatch('close')
      }
    })
  })
</script>

<style>
  .calendar {
    box-sizing: border-box;
    position: relative;
    user-select: none;
    width: 100vw;
    padding-top: 0;
  }
  
  @media (min-width: 600px) {
    .calendar {
      height: auto;
      width: 50%;
      max-width: 100%;
      display: inline-block;
    }
  }
</style>
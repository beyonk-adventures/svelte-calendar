<script>
  import Popover from './Popover.svelte'
  import { getMonths } from './lib/helpers'
  import { contextKey, setup } from './lib/context'
  import { createEventDispatcher, setContext, getContext } from 'svelte'
  import { CalendarStyle } from '../calendar-style.js'
  import DateView from './DateView.svelte'

  export let rangePicker = false
  export let placeholder = 'Choose Date'
  export let format = '#{m} / #{d} / #{Y}'
  export let start = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())
  export let end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate())
  export let dateChosen = false
  export let trigger = null
  export let selectableCallback = null
  export let weekStart = 0
  export let styling = new CalendarStyle()
  export let selected = new Date()
  export let selectedEnd = rangePicker ? new Date() : null

  const dispatch = createEventDispatcher()

  const config = {
    isRangePicker: rangePicker,
    format
  }

  const months = getMonths(start, end, selectableCallback, weekStart)

  setContext(contextKey, setup(months, selected, selectedEnd, start, end, config))
  const { month, year, secMonth, secYear, selectedDate, selectedEndDate, isOpen, isClosing, highlighted, formatter, isDateChosen } = getContext(contextKey)

  $: dateChosen = $isDateChosen

  let popover

  function registerClose () {
    dispatch('close')
  }

  function close () {
    popover.close()
  }

  function registerOpen () {
    highlighted.set(new Date($selectedDate))
    month.set($highlighted.getMonth())
    year.set($highlighted.getFullYear())

    if (config.isRangePicker) {
      if ($selectedDate.getMonth() === $selectedEndDate.getMonth() && $selectedDate.getFullYear() === $selectedEndDate.getFullYear()) {
        secMonth.set($selectedDate.getMonth() + 1)
        secYear.set($selectedDate.getFullYear())
      } else {
        secMonth.set($selectedEndDate.getMonth())
        secYear.set($selectedEndDate.getFullYear())
      }
    }
    
    dispatch('open')
  }
</script>

<style>
  .datepicker {
    display: inline-block;
    text-align: center;
    overflow: visible;
  }

  .calendar-button {
    padding: 10px 20px;
    border: 1px solid var(--button-border-color);
    display: block;
    text-align: center;
    width: 300px;
    text-decoration: none;
    cursor: pointer;
    background: var(--button-background-color);
    color: var(--button-text-color);
    border-radius: 7px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  .calendar {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    user-select: none;
    width: 100vw;
    padding: 10px;
    padding-top: 0;
  }
  
  @media (min-width: 600px) {
    .calendar {
      height: auto;
      width: 320px;
      max-width: 100%;
    }

    .calendar.is-range-picker {
      width: 680px;
    }
  }
</style>

<div
  class="datepicker"
  class:open={$isOpen}
  class:closing={$isClosing}
  style={styling.toWrapperStyle()}>
  <Popover
    {trigger}
    bind:this={popover}
    on:opened={registerOpen}
    on:closed={registerClose}>
    <div slot="trigger">
      <slot formatted={$formatter}>
        {#if !trigger}
          <button class="calendar-button" type="button">
            {#if $isDateChosen}
              {$formatter.formattedCombined}
            {:else}
              {placeholder}
            {/if}
          </button>
        {/if}
      </slot>
    </div>
    <div slot="contents">
      <div class="calendar" class:is-range-picker={config.isRangePicker}>
        <svelte:component this={DateView} on:close={close} />
      </div>
    </div>
  </Popover>
</div>

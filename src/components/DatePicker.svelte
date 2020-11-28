<script>
  import Popover from './Popover.svelte'
  import { contextKey, setup } from './lib/context'
  import { createEventDispatcher, setContext, getContext } from 'svelte'
  import { CalendarStyle } from '../calendar-style.js'
  import Picker from './Picker.svelte'

  export let range = false
  export let placeholder = 'Choose Date'
  export let format = 'DD / MM / YYYY'
  export let start = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())
  export let end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate())
  export let dateChosen = false
  export let trigger = null
  export let selectableCallback = null
  export let weekStart = 0
  export let styling = new CalendarStyle()
  export let selected = new Date()
  export let selectedEnd = range ? new Date() : null
  export let closeOnFocusLoss = true
  export let time = false
  export let morning = 7
  export let night = 19

  const dispatch = createEventDispatcher()

  const config = {
    isRangePicker: range,
    closeOnFocusLoss,
    format,
    morning,
    night,
    time,
    selectableCallback,
    weekStart
  }

  setContext(contextKey, setup(selected, selectedEnd, start, end, config))
  const { selectedDate, selectedEndDate, isOpen, isClosing, highlighted, formatter, isDateChosen } = getContext(contextKey)

  $: dateChosen = $isDateChosen

  let popover

  function registerClose () {
    dispatch('close')
  }

  function close () {
    popover.close()
  }

  function pickEnd (date) {
    selectedEndDate.set(date)
    close()
  }

  function pickStart (date) {
    selectedDate.set(date)
    if (!config.isRangePicker) {
      isDateChosen.set(true)
    }
    close()
  }

  function initialisePicker () {
    highlighted.set(new Date($selectedDate))
    // do this on load picker
    // month.set($highlighted.getMonth())
    // year.set($highlighted.getFullYear())

    // if (config.isRangePicker) {
    //   if ($selectedDate.getMonth() === $selectedEndDate.getMonth() && $selectedDate.getFullYear() === $selectedEndDate.getFullYear()) {
    //     secMonth.set($selectedDate.getMonth() + 1)
    //     secYear.set($selectedDate.getFullYear())
    //   } else {
    //     secMonth.set($selectedEndDate.getMonth())
    //     secYear.set($selectedEndDate.getFullYear())
    //   }
    // }
    
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
  
  .contents.range-picker:first-child {
    margin-right: 1%;
  }

  .contents.range-picker:last-child {
    margin-left: 1%;
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
    on:opened={initialisePicker}
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
    <div class="contents" slot="contents" class:range-picker={config.isRangePicker}>
      <Picker pickerContextKey={{}} isStart={true} date={$selectedDate} on:date-chosen={e => pickStart(e.detail.date)} />
      {#if config.isRangePicker}
      <Picker pickerContextKey={{}} isStart={false} date={$selectedEndDate} on:date-chosen={e => pickEnd(e.detail.date)} />
      {/if}
    </div>
  </Popover>
</div>

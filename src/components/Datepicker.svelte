<script>
  import Month from './Month.svelte'
  import NavBar from './NavBar.svelte'
  import Popover from './Popover.svelte'
  import { getMonths } from './lib/helpers'
  import { getDay } from './lib/get-day.js'
  import { createFormatter } from './lib/formatter.js'
  import { createKeyboardHandler } from './lib/keyboard.js'
  import { contextKey, setup } from './lib/context'
  import { createEventDispatcher, setContext, getContext } from 'svelte'
  import { checkIfVisibleDateIsSelectable, shakeDate } from './lib/feedback.js'
  import { CalendarStyle } from '../calendar-style.js'

  export let rangePicker = false
  export let format = '#{m} / #{d} / #{Y}'
  export let start = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())
  export let end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate())
  export let dateChosen = false
  export let dateChosenEnd = false
  export let trigger = null
  export let selectableCallback = null
  export let weekStart = 0
  export let styling = new CalendarStyle()
  export let selected = new Date()
  export let selectedEnd = rangePicker ? new Date() : null

  const dispatch = createEventDispatcher()

  const config = {
    isRangePicker: rangePicker
  }

  const months = getMonths(start, end, selectableCallback, weekStart)

  setContext(contextKey, setup(months, selected, selectedEnd, start, end, config))
  const { month, year, secMonth, secYear, selectedDate, selectedEndDate, monthView, shouldShakeDate, isOpen, isClosing, firstDate, highlighted } = getContext(contextKey)
  const { formatter } = createFormatter(format, selectedDate, selectedEndDate, config.isRangePicker)

  const keyboardHandler = createKeyboardHandler({
    incrementDayHighlighted,
    incrementMonth,
    registerSelection: () => registerSelection($highlighted),
    close
  })

  let popover

  $: visibleMonthsId = $year + $month / 100
  $: lastVisibleDate = $monthView.visibleMonth.weeks[$monthView.visibleMonth.weeks.length - 1].days[6].date
  $: firstVisibleDate = $monthView.visibleMonth.weeks[0].days[0].date
  $: canIncrementMonth = $monthView.monthIndex < months.length - 1
  $: canDecrementMonth = $monthView.monthIndex > 0
  $: canIncrementSecMonth = $monthView.secMonthIndex < months.length - 1
  $: canDecrementSecMonth = $monthView.secMonthIndex > 0

  function changeMonth (selectedMonth) {
    month.set(selectedMonth)
    highlighted.set(new Date($year, $month, 1))
  }

  function changeSecMonth (selectedMonth) {
    secMonth.set(selectedMonth)
  }

  function incrementMonth (direction, date = 1) {
    if (direction === 1 && !canIncrementMonth) return
    if (direction === -1 && !canDecrementMonth) return
    const current = new Date($year, $month, 1)
    current.setMonth(current.getMonth() + direction)
    month.set(current.getMonth())
    year.set(current.getFullYear())
    highlighted.set(new Date($year, $month, date))
  }

  function incrementSecMonth (direction) {
    if (direction === 1 && !canIncrementSecMonth) return
    if (direction === -1 && !canDecrementSecMonth) return
    const current = new Date($secYear, $secMonth, 1)
    current.setMonth(current.getMonth() + direction)
    secMonth.set(current.getMonth())
    secYear.set(current.getFullYear())
  }

  function incrementDayHighlighted (amount) {
    const proposedDate = new Date($highlighted)
    proposedDate.setDate($highlighted.getDate() + amount)
    const correspondingDayObj = getDay(
      months,
      proposedDate.getMonth(),
      proposedDate.getDate(),
      proposedDate.getFullYear()
    )
    if (!correspondingDayObj || !correspondingDayObj.isInRange) { return }
    highlighted.set(proposedDate)
    if (amount > 0 && $highlighted > lastVisibleDate) {
      incrementMonth(1, $highlighted.getDate())
    }
    if (amount < 0 && $highlighted < firstVisibleDate) {
      incrementMonth(-1, $highlighted.getDate())
    }
  }

  function assignValueToTrigger (formatted) {
    if (!trigger) { return }
    trigger.innerHTML = formatted
  }

  function registerClose () {
    document.removeEventListener('keydown', keyboardHandler)
    dispatch('close')
  }

  function close () {
    popover.close()
    registerClose()
  }

  function registerSelection (chosen) {
    if (!checkIfVisibleDateIsSelectable(months, chosen)) {
      return shakeDate(shouldShakeDate, chosen)
    }

    if (!config.isRangePicker) {
      selectedDate.set(chosen)
      dateChosen = true
      assignValueToTrigger($formatter.formattedSelected)
      close()
      return dispatch('dateSelected', { date: $selectedDate })
    }

    if ($firstDate) {
      if (dateChosen) {
        selectedEndDate.set(chosen)
      }
      if (chosen <= selectedEnd || !dateChosen) {
        selectedDate.set(chosen)
        selectedEndDate.set(selected)
      }
      dateChosen = true
    } else {
      if (chosen >= $selectedDate) {
        selectedEndDate.set(chosen)
      } else {
        selectedEndDate.set(selected)
        selectedDate.set(chosen)
      }
      close()
      dateChosenEnd = true
    }
  
    assignValueToTrigger($formatter.formattedSelected)
    assignValueToTrigger($formatter.formattedSelectedEnd)
  
    if (!$firstDate) {
      dispatch('dateSelected', { from: $selectedDate, to: $selectedEndDate })
    }

    firstDate.update(v => !v)
    return true
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
    document.addEventListener('keydown', keyboardHandler)
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
            {$formatter.formattedCombined}
          </button>
        {/if}
      </slot>
    </div>
    <div slot="contents">
      <div class="calendar" class:is-range-picker={config.isRangePicker}>
        <NavBar
          {start}
          {end}
          {canIncrementMonth}
          {canDecrementMonth}
          {canIncrementSecMonth}
          {canDecrementSecMonth}
          on:monthSelected={e => changeMonth(e.detail)}
          on:monthSelected={e => changeSecMonth(e.detail)}
          on:incrementMonth={e => incrementMonth(e.detail)}
          on:incrementSecMonth={e => incrementSecMonth(e.detail)} />
        <Month
          id={visibleMonthsId}
          on:dateSelected={e => registerSelection(e.detail)} />
      </div>
    </div>
  </Popover>
</div>

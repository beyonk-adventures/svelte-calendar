<script>
  import Months from './Month.svelte'
  import NavBar from './NavBar.svelte'
  import Popover from './Popover.svelte'
  import { formatDate } from 'timeUtils'
  import { getMonths } from './lib/helpers'
  import { getDay } from './lib/get-day.js'
  import { contextKey, setup } from './lib/context'
  import { keyCodes, keyCodesArray } from './lib/keyCodes'
  import { createEventDispatcher, setContext, getContext } from 'svelte'

  const dispatch = createEventDispatcher()
  const today = new Date()

  export let rangePicker = false
  export let format = '#{m} / #{d} / #{Y}'
  export let start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
  export let end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate())
  export let selected = today
  export let selectedEnd = rangePicker ? today : null
  export let dateChosen = false
  export let dateChosenEnd = false
  export let trigger = null
  export let selectableCallback = null
  export let weekStart = 0

  const config = {
    isRangePicker: rangePicker
  }

  const months = getMonths(start, end, selectableCallback, weekStart)

  setContext(contextKey, setup(months, today, selected, selectedEnd, start, end, config))
  const { month, year, secMonth, secYear, selectedDate, selectedEndDate, monthView } = getContext(contextKey)

  export let style = ''
  export let buttonBackgroundColor = '#fff'
  export let buttonBorderColor = '#eee'
  export let buttonTextColor = '#333'
  export let highlightColor = '#f7901e'
  export let passiveHighlightColor = '#FCD9B1'
  export let dayBackgroundColor = 'none'
  export let dayTextColor = '#4a4a4a'
  export let dayHighlightedBackgroundColor = '#efefef'
  export let dayHighlightedTextColor = '#4a4a4a'

  let popover
  let firstDate = true
  const width = rangePicker ? null : 320

  let highlighted = today
  let shouldShakeDate = false
  let shakeHighlightTimeout

  let isOpen = false
  let isClosing = false

  today.setHours(0, 0, 0, 0)

  // let monthIndex = 0
  // let secMonthIndex = 0
  // $: {
  //   monthIndex = 0
  //   secMonthIndex = 0
  //   for (let i = 0; i < months.length; i += 1) {
  //     if (months[i].month === $month && months[i].year === $year) {
  //       monthIndex = i
  //     }
  //     if (config.isRangePicker && months[i].month === $secMonth && months[i].year === $secYear) {
  //       secMonthIndex = i
  //     }
  //   }
  // }
  // $: visibleMonth = months[monthIndex]
  // $: visibleSecMonth = months[secMonthIndex]

  $: visibleMonthsId = $year + $month / 100
  $: lastVisibleDate = $monthView.visibleMonth.weeks[$monthView.visibleMonth.weeks.length - 1].days[6].date
  $: firstVisibleDate = $monthView.visibleMonth.weeks[0].days[0].date
  $: canIncrementMonth = $monthView.monthIndex < months.length - 1
  $: canDecrementMonth = $monthView.monthIndex > 0
  $: canIncrementSecMonth = $monthView.secMonthIndex < months.length - 1
  $: canDecrementSecMonth = $monthView.secMonthIndex > 0
  $: wrapperStyle = `
    --button-background-color: ${buttonBackgroundColor};
    --button-border-color: ${buttonBorderColor};
    --button-text-color: ${buttonTextColor};
    --highlight-color: ${highlightColor};
    --passive-highlight-color: ${passiveHighlightColor};
    --day-background-color: ${dayBackgroundColor};
    --day-text-color: ${dayTextColor};
    --day-highlighted-background-color: ${dayHighlightedBackgroundColor};
    --day-highlighted-text-color: ${dayHighlightedTextColor};
    ${style}
  `

  export let formattedSelected
  export let formattedSelectedEnd
  export let formattedCombined
  $: {
    const isFn = typeof format === 'function'

    formattedSelected = isFn ? format($selectedDate) : formatDate($selectedDate, format)
    if (config.isRangePicker) {
      formattedSelectedEnd = isFn ? format($selectedEndDate) : formatDate($selectedEndDate, format)
    }

    formattedCombined = rangePicker ? `${formattedSelected} - ${formattedSelectedEnd}` : formattedSelected
  }

  function changeMonth (selectedMonth) {
    month.set(selectedMonth)
    highlighted = new Date($year, $month, 1)
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
    highlighted = new Date($year, $month, date)
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
    const proposedDate = new Date(highlighted)
    proposedDate.setDate(highlighted.getDate() + amount)
    const correspondingDayObj = getDay(
      months,
      proposedDate.getMonth(),
      proposedDate.getDate(),
      proposedDate.getFullYear()
    )
    if (!correspondingDayObj || !correspondingDayObj.isInRange) return
    highlighted = proposedDate
    if (amount > 0 && highlighted > lastVisibleDate) {
      incrementMonth(1, highlighted.getDate())
    }
    if (amount < 0 && highlighted < firstVisibleDate) {
      incrementMonth(-1, highlighted.getDate())
    }
  }

  function checkIfVisibleDateIsSelectable (date) {
    const proposedDay = getDay(
      months,
      date.getMonth(),
      date.getDate(),
      date.getFullYear()
    )
    return proposedDay && proposedDay.selectable
  }

  function shakeDate (date) {
    clearTimeout(shakeHighlightTimeout)
    shouldShakeDate = date
    shakeHighlightTimeout = setTimeout(() => {
      shouldShakeDate = false
    }, 700)
  }

  function assignValueToTrigger (formatted) {
    if (!trigger) { return }
    trigger.innerHTML = formatted
  }

  function handleKeyPress (evt) {
    if (keyCodesArray.indexOf(evt.keyCode) === -1) return false
    evt.preventDefault()
    switch (evt.keyCode) {
      case keyCodes.left:
        return incrementDayHighlighted(-1)
      case keyCodes.up:
        return incrementDayHighlighted(-7)
      case keyCodes.right:
        return incrementDayHighlighted(1)
      case keyCodes.down:
        return incrementDayHighlighted(7)
      case keyCodes.pgup:
        return incrementMonth(-1)
      case keyCodes.pgdown:
        return incrementMonth(1)
      case keyCodes.escape:
        return close()
      case keyCodes.enter:
        return registerSelection(highlighted)
      default:
        return false
    }
  }

  function registerClose () {
    document.removeEventListener('keydown', handleKeyPress)
    dispatch('close')
  }

  function close () {
    popover.close()
    registerClose()
  }

  function registerSelection (chosen) {
    if (!checkIfVisibleDateIsSelectable(chosen)) {
      return shakeDate(chosen)
    }

    if (!config.isRangePicker) {
      selectedDate.set(chosen)
      dateChosen = true
      assignValueToTrigger(formattedSelected)
      close()
      return dispatch('dateSelected', { date: $selectedDate })
    }

    if (firstDate) {
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
  
    assignValueToTrigger(formattedSelected)
    assignValueToTrigger(formattedSelectedEnd)
  
    if (!firstDate) {
      dispatch('dateSelected', { from: $selectedDate, to: $selectedEndDate })
    }

    firstDate = !firstDate
    return true
  }

  function registerOpen () {
    highlighted = new Date($selectedDate)
    month.set(highlighted.getMonth())
    year.set(highlighted.getFullYear())

    if (config.isRangePicker) {
      if ($selectedDate.getMonth() === $selectedEndDate.getMonth() && $selectedDate.getFullYear() === $selectedEndDate.getFullYear()) {
        secMonth.set($selectedDate.getMonth() + 1)
        secYear.set($selectedDate.getFullYear())
      } else {
        secMonth.set($selectedEndDate.getMonth())
        secYear.set($selectedEndDate.getFullYear())
      }
    }
    document.addEventListener('keydown', handleKeyPress)
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
      width: 680px;
      max-width: 100%;
    }
  }
</style>

<div
  class="datepicker"
  class:open={isOpen}
  class:closing={isClosing}
  style={wrapperStyle}>
  <Popover
    {trigger}
    bind:this={popover}
    bind:open={isOpen}
    bind:shrink={isClosing}
    on:opened={registerOpen}
    on:closed={registerClose}>
    <div slot="trigger">
      <slot>
        {#if !trigger}
          <button class="calendar-button" type="button">
            {formattedCombined}
          </button>
        {/if}
      </slot>
    </div>
    <div slot="contents">
      <div class="calendar" style="width: {width}px">
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
        <Months
          {highlighted}
          {shouldShakeDate}
          id={visibleMonthsId}
          on:dateSelected={e => registerSelection(e.detail)} />
      </div>
    </div>
  </Popover>
</div>

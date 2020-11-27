<div out:fade|local>
  <NavBar
    {canIncrementMonth}
    {canDecrementMonth}
    on:monthSelected={e => changeMonth(e.detail)}
    on:incrementMonth={e => incrementMonth(e.detail)} />
  <Month
    id={visibleMonthsId}
    on:chosen={e => registerSelection(e.detail.date)} />
</div>

<script>
  import Month from './Month.svelte'
  import NavBar from './NavBar.svelte'
  import { checkIfVisibleDateIsSelectable, shakeDate } from '../lib/feedback.js'
  import { contextKey } from '../lib/context.js'
  import { createKeyboardHandler } from '../lib/keyboard.js'
  import { getContext, createEventDispatcher, onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  const { months, monthView, year, month, highlighted, shouldShakeDate } = getContext(contextKey)
  const dispatch = createEventDispatcher()
  const keyboardHandler = createKeyboardHandler({
    incrementDayHighlighted,
    incrementMonth,
    registerSelection: () => registerSelection($highlighted),
    close: () => dispatch('close')
  })

  onMount(() => {
    document.addEventListener('keydown', keyboardHandler)
    return () => {
      document.removeEventListener('keydown', keyboardHandler)
    }
  })

  $: visibleMonthsId = $year + $month / 100
  $: lastVisibleDate = $monthView.visibleMonth.weeks[$monthView.visibleMonth.weeks.length - 1].days[6].date
  $: firstVisibleDate = $monthView.visibleMonth.weeks[0].days[0].date
  $: canIncrementMonth = $monthView.monthIndex < months.length - 1
  $: canDecrementMonth = $monthView.monthIndex > 0

  function changeMonth (selectedMonth) {
    month.set(selectedMonth)
    highlighted.set(new Date($year, $month, 1))
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

  function registerSelection (chosen) {
    if (!checkIfVisibleDateIsSelectable(months, chosen)) {
      return shakeDate(shouldShakeDate, chosen)
    }

    dispatch('date-chosen', { date: chosen })

    // if ($firstDate) {
    //   if ($isDateChosen) {
    //     selectedEndDate.set(chosen)
    //   }
    //   if (chosen <= $selectedEndDate || !$isDateChosen) {
    //     selectedDate.set(chosen)
    //     selectedEndDate.set($selectedDate)
    //   }
    // } else {
    //   if (chosen >= $selectedDate) {
    //     selectedEndDate.set(chosen)
    //   } else {
    //     selectedEndDate.set($selectedDate)
    //     selectedDate.set(chosen)
    //   }
    //   dispatch('close')
    //   isDateChosen.set(true)
    // }
  
    // if (!$firstDate) {
    //   dispatch('dateSelected', { from: $selectedDate, to: $selectedEndDate })
    // }

    // firstDate.update(v => !v)
    return true
  }
</script>
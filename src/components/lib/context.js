import { writable, derived, readable } from 'svelte/store'

const contextKey = {}

function createMonthView (months, year, month, secYear, secMonth, isRangePicker) {
  let monthIndex = 0
  let secMonthIndex = 0

  return derived([ year, month, secYear, secMonth ], ([ $year, $month, $secYear, $secMonth ]) => {
    for (let i = 0; i < months.length; i += 1) {
      if (months[i].month === $month && months[i].year === $year) {
        monthIndex = i
      }
      if (isRangePicker && months[i].month === $secMonth && months[i].year === $secYear) {
        secMonthIndex = i
      }
    }

    return {
      monthIndex,
      secMonthIndex,
      visibleMonth: months[monthIndex],
      visibleSecMonth: months[secMonthIndex]
    }
  })
}

function setup (months, selected, selectedEnd, start, end, config) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const selectedDate = (selected.getTime() < start.getTime() || selected.getTime() > end.getTime()) ? start : selected
  const year = writable(selectedDate.getFullYear())
  const month = writable(selectedDate.getMonth())
  const secMonth = writable(today.getMonth())
  const secYear = writable(today.getFullYear())

  const monthView = createMonthView(months, year, month, secYear, secMonth, config.isRangePicker)

  return {
    today,
    month,
    secMonth,
    year,
    secYear,
    selectedDate: writable(selectedDate),
    selectedEndDate: writable(selectedEnd),
    monthView,
    config,
    shouldShakeDate: writable(false),
    isOpen: writable(false),
    isClosing: writable(false),
    firstDate: writable(true),
    highlighted: writable(today)
  }
}

export {
  contextKey,
  setup
}

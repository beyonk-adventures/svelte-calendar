import { writable, derived, readable } from 'svelte/store'
import { createFormatter } from './formatter.js'

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

  const givenDate = (selected.getTime() < start.getTime() || selected.getTime() > end.getTime()) ? start : selected
  const year = writable(givenDate.getFullYear())
  const month = writable(givenDate.getMonth())
  const secMonth = writable(today.getMonth())
  const secYear = writable(today.getFullYear())
  const selectedDate = writable(givenDate)
  const selectedEndDate = writable(selectedEnd)

  const monthView = createMonthView(months, year, month, secYear, secMonth, config.isRangePicker)
  const { formatter } = createFormatter(config.format, selectedDate, selectedEndDate, config.isRangePicker)

  return {
    start: readable(start),
    end: readable(end),
    months,
    today,
    month,
    secMonth,
    year,
    secYear,
    selectedDate,
    selectedEndDate,
    monthView,
    config,
    shouldShakeDate: writable(false),
    isOpen: writable(false),
    isClosing: writable(false),
    firstDate: writable(true),
    highlighted: writable(today),
    formatter,
    isDateChosen: writable(false)
  }
}

export {
  contextKey,
  setup
}

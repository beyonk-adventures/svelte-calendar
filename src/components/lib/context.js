import { writable, readable } from 'svelte/store'
import { createFormatter } from './formatter.js'
import { getMonths } from './helpers.js'

const contextKey = {}

function setup (selected, selectedEnd, start, end, config) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const months = getMonths(start, end, config.selectableCallback, config.weekStart)

  const givenDate = (selected.getTime() < start.getTime() || selected.getTime() > end.getTime()) ? start : selected
  const selectedDate = writable(givenDate)
  const selectedEndDate = writable(selectedEnd)

  const { formatter } = createFormatter(config.format, selectedDate, selectedEndDate, config.isRangePicker)

  return {
    months,
    start: readable(start),
    end: readable(end),
    today,
    selectedDate,
    selectedEndDate,
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

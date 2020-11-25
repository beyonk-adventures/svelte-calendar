import { writable } from 'svelte/store'

const contextKey = {}

function setup (today, selected, start, end, config) {
  const selectedDate = (selected.getTime() < start.getTime() || selected.getTime() > end.getTime()) ? start : selected

  return {
    month: writable(selectedDate.getMonth()),
    secMonth: writable(today.getMonth()),
    year: writable(selectedDate.getFullYear()),
    secYear: writable(today.getFullYear()),
    selectedDate: writable(selectedDate),
    config
  }
}

export {
  contextKey,
  setup
}

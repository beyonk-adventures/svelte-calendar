'use strict'

import dayjs from 'dayjs/esm'
import DateView from './date-view/DateView.svelte'
import { derived, writable } from 'svelte/store'

function createMonthView (months, year, month) {
  let monthIndex = 0

  return derived([ year, month ], ([ $year, $month ]) => {
    for (let i = 0; i < months.length; i += 1) {
      if (months[i].month === $month && months[i].year === $year) {
        monthIndex = i
      }
    }

    return {
      monthIndex,
      visibleMonth: months[monthIndex]
    }
  })
}

function createContext (givenDate, months, config) {
  const chosen = writable(false)
  const date = writable(givenDate)
  const year = writable(givenDate.getFullYear())
  const month = writable(givenDate.getMonth())
  const isDaytime = derived(date, $date => {
    if (!$date) { return true }
    const [ h ] = dayjs($date).format('HH:mm').split(':').map(d => parseInt(d))
    return h > config.morning && h < config.night
  })

  return {
    view: DateView,
    chosen,
    date,
    isDaytime,
    year,
    month,
    monthView: createMonthView(months, year, month)
  }
}

export {
  createContext
}

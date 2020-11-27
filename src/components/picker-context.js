'use strict'

import dayjs from 'dayjs/esm'
import DateView from './date-view/DateView.svelte'
import { derived, writable } from 'svelte/store'

function createContext (givenDate, morning, night) {
  const date = writable(givenDate)
  const chosen = writable(false)
  const isDaytime = derived(date, $date => {
    if (!$date) { return true }
    const [ h ] = dayjs($date).format('HH:mm').split(':').map(d => parseInt(d))
    return h > morning && h < night
  })

  return {
    view: DateView,
    chosen,
    date,
    isDaytime
  }
}

export {
  createContext
}

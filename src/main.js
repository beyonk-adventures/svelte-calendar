import { polyfill } from 'es6-object-assign'

import { CalendarStyle } from './calendar-style.js'
import SvelteCalendar from './components/Datepicker.svelte'
polyfill()

export {
  CalendarStyle,
  SvelteCalendar
}

import { derived } from 'svelte/store'
import { formatDate } from 'timeUtils'

function createFormatter (format, selectedDate, selectedEndDate, isRangePicker) {
  const isFn = typeof format === 'function'

  const formatter = derived([ selectedDate, selectedEndDate ], ([ $selectedDate, $selectedEndDate ]) => {
    const formattedSelected = $selectedDate && (isFn ? format($selectedDate) : formatDate($selectedDate, format))
    const formattedSelectedEnd = isRangePicker && $selectedEndDate && (isFn ? format($selectedEndDate) : formatDate($selectedEndDate, format))

    return {
      formattedSelected,
      formattedSelectedEnd,
      formattedCombined: isRangePicker ? `${formattedSelected} - ${formattedSelectedEnd}` : formattedSelected
    }
  })

  return { formatter }
}

export {
  createFormatter
}

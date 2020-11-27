import dayjs from 'dayjs/esm'
import { derived } from 'svelte/store'

function createFormatter (format, selectedDate, selectedEndDate, isRangePicker) {
  const formatter = derived([ selectedDate, selectedEndDate ], ([ $selectedDate, $selectedEndDate ]) => {
    const formattedSelected = $selectedDate && dayjs($selectedDate).format(format)
    const formattedSelectedEnd = isRangePicker && $selectedEndDate && dayjs(selectedEndDate).format(format)

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

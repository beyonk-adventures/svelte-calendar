import dayjs from 'dayjs/esm'
import { derived } from 'svelte/store'

function createFormatter (format, selectedStartDate, selectedEndDate, isRangePicker) {
  const formatter = derived([ selectedStartDate, selectedEndDate ], ([ $selectedStartDate, $selectedEndDate ]) => {
    const formattedSelected = $selectedStartDate && dayjs($selectedStartDate).format(format)
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

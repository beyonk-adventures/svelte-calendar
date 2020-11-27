import { derived } from 'svelte/store'

function format (h, m) {
  return [
    String(h).padStart(2, '0'),
    String(m).padStart(2, '0')
  ].join(':')
}

function createStore (time, morning, night) {
  function increment (segment) {
    time.update(t => {
      let [ h, m ] = t.split(':')
      if (segment === 'hour' && h < 23) { ++h }
      if (segment === 'minute' && m < 59) { ++m }
      return format(h, m)
    })
  }

  function decrement (segment) {
    time.update(t => {
      let [ h, m ] = t.split(':')
      if (segment === 'hour' && h > 0) { --h }
      if (segment === 'minute' && m > 0) { --m }
      return format(h, m)
    })
  }

  function set (t) {
    time.set(t)
  }

  const daytime = derived(time, $time => {
    if (!$time) { return true }
    const [ h ] = $time.split(':').map(parseInt)
    return h > morning && h < night
  })

  return {
    increment,
    decrement,
    time,
    set,
    daytime
  }
}

export {
  createStore
}

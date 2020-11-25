<svelte:window on:mousemove={onMove} on:touchmove={onMove} on:mouseup={() => moving = false} on:touchend={() => moving = false} />

<div class="datepicker" class:am={timeframe === 'am'} class:pm={timeframe === 'pm'}>
	<div class="timepicker" class:am={timeframe === 'am'} class:pm={timeframe === 'pm'}>
		<div class="timepicker-container-outer" selectedtime="time" timetravel>
			<div class="timepicker-container-inner" bind:this={timepicker_container}>
				<div class="timeline-container" bind:this={timeline_container} on:touchstart={timeSelectStart} on:mousedown={timeSelectStart}>
					<div class="current-time" bind:this={currenttime}>
						<div class="actual-time">{time}</div>
					</div>
          <div class="timeline" bind:this={timeline}>
            
					</div>
					<div class="hours-container">
						{#each { length: 11 } as _, i (i) }
						<div class="hour-mark"></div>
						{/each}
					</div>
				</div>
				<div class="display-time">
					<div class="decrement-time" on:click|preventDefault={() => adjustTime('decrease')}>
						<svg width="24" height="24">
							<path stroke="white" stroke-width="2" d="M8,12 h8"/>
						</svg>
					</div>
					<div class="time" class:time-active={edittime.active}>
						<input type="text" class="time-input" bind:value={edittime.input} on:keydown={changeInputTime} on:focus={() => { edittime.active = true; edittime.digits = []; }} on:blur={() => edittime.active = false} />
						<div class="formatted-time">{edittime.formatted}</div>
					</div>
					<div class="increment-time" on:click|preventDefault={() => adjustTime('increase')}>
						<svg width="24" height="24">
							<path stroke="white" stroke-width="2" d="M12,7 v10 M7,12 h10"/>
						</svg>
					</div>
				</div>
				<div class="am-pm-container">
					<div class="am-pm-button" on:click={() => changetime('am') }>am</div>
					<div class="am-pm-button" on:click={() => changetime('pm') }>pm</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.datepicker {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-user-select: none;
    user-select: none;
    font-family: "Roboto", sans-serif;
    overflow: hidden;
    transition: background 0.15s ease;
  }
	
	.timepicker {
		display: flex;
		flex: 1 0 auto;
		justify-content: center;
		align-items: center;
	}
  .timepicker-container-outer {
    width: 100%;
    display: block;
    padding: 40px 30px 30px;
    position: relative;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.15s ease;
  }

  .timepicker-container-inner {
    width: 100%;
    height: 100%;
    max-width: 320px;
    margin: 0 auto;
    position: relative;
    display: block;
  }

  .timeline-container {
    display: block;
    float: left;
    position: relative;
    width: 100%;
    height: 36px;
  }

  .current-time {
    display: block;
    position: absolute;
    z-index: 1;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    top: -25px;
    left: -20px;
    cursor: pointer;
    -webkit-user-select: none;
      -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
  }
  .current-time::after {
    content: '';
    display: block;
    width: 40px;
    height: 40px;
    position: absolute;
    background: #FF6E40;
    transition: all 0.15s ease; 
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    border-radius: 20px 20px 3px 20px;
    z-index: -1;
    top: 0;
  }

  .actual-time {
    color: white;
    line-height: 40px;
    font-size: 12px;
    text-align: center;
    transition: all 0.15s ease;
  }

  .timeline {
    display: block;
    z-index: 1;
    width: 100%;
    height: 2px;
    position: absolute;
    bottom: 0;
  }
  .timeline::before, .timeline::after {
    content: '';
    display: block;
    width: 2px;
    height: 10px;
    top: -6px;
    position: absolute;
    background: #0DAD83;
    left: -1px;
    transition: background 0.15s ease;
  }
  .timeline::after {
    left: auto;
    right: -1px;
  }

  .hours-container {
    display: block;
    z-index: 0;
    width: 100%;
    height: 10px;
    position: absolute;
    top: 31px;
    left: 1px;
  }

  .hour-mark {
    width: 2px;
    display: block;
    float: left;
    height: 4px;
    background: #0DAD83;
    position: relative;
    margin-left: calc((100% / 12) - 2px);
    transition: background 0.15s ease;
  }
  .hour-mark:nth-child(3n) {
    height: 6px;
    top: -1px;
  }

  .display-time {
    width: calc(60% - 30px);
    display: block;
    margin-top: 30px;
    height: 36px;
    line-height: 36px;
    overflow: hidden;
    float: left;
    position: relative;
    font-size: 20px;
    text-align: center;
    transition: color 0.15s ease;
  }
  .decrement-time,
  .increment-time {
    cursor: pointer;
    position: absolute;
    display: block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    top: 6px;
    font-size: 20px;
  }
  .decrement-time {
    left: 0;
    text-align: left;
  }
  .increment-time {
    right: 0;
    text-align: right;
  }
  .increment-time path,
  .decrement-time path{
    transition: all 0.15s ease;
  }
  .time {
    width: calc(100% - 48px);
    position: relative;
    left: 24px;
    height: 36px;
  }
    
  .time:after {
    content: '';
    height: 2px;
    width: 100%;
    position: absolute;
    bottom: 0;
    background: white;
    left: 0;
    right: 0;
    opacity: 0.5;
    transition: all 0.15s ease;
    }
    
  .time.time-active:after {
    display: none;
  }
  .time-input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 34px;
    line-height: 34px;
    bottom: 2px;
    width: 100%;
    border: none;
    background: none;
    text-align: center;
    color: white;
    font-size: inherit;
    opacity: 0;
    transition: all 0.15s ease;
    cursor: pointer;
  }

  .time-input:focus,
  .time-input:active {
    outline: none;
  }
    
  .formatted-time {
    cursor: pointer;
  }
  .time-input:focus {
    cursor: auto;
  }
    
  .time-input:focus ~ .formatted-time {
    border-radius: 2px;
    background: #0DAD83;
    color: white;
    cursor: default;
    }

  .am-pm-container {
    width: 40%;
    padding-left: 15px;
    float: right;
    height: 36px;
    line-height: 36px;
    display: block;
    position: relative;
    margin-top: 30px;
  }

  .am-pm-button {
    width: calc(50% - 5px);
    height: 36px;
    line-height: 36px;
    background: #2196F3;
    text-align: center;
    color: white;
    border-radius: 4px;
    float: left;
    cursor: pointer;
  }
  .am-pm-button:first-child {
    background: #0DAD83;
    color: white;
  }
  .am-pm-button:last-child {
    background: white;
    color: #0DAD83;
    margin-left: 10px;
  }

  @-webkit-keyframes select-date-pm {
    0% { background: rgba(255,255,255,0.5); }
    100% { background: #FFF; }
  }
  @keyframes select-date-pm {
    0% { background: rgba(255,255,255,0.5); }
    100% { background: #FFF; }
  }

	.datepicker.am .current-time::after {
		background: #0DAD83;
	}
	.datepicker.am .actual-time {
		color: white;
	}
	.datepicker.am .display-time {
		color: #FF6E40;
	}
	.datepicker.am .time-input {
		color: #FF693C;
	}
	
	.datepicker.am .increment-time path,
	.datepicker.am .decrement-time path {
		stroke: #FF693C;
	}
	
	.datepicker.pm {
		background-color: #0DAD83;
	}

	.datepicker.pm .current-time::after {
		background: white;
	}

	.datepicker.pm .actual-time {
		color: #FF6E40;
	}

	.datepicker.pm .display-time {
		color: white;
	}

	.datepicker.pm .timeline::before,
	.datepicker.pm .timeline::after {
		background: white;
	}
	.datepicker.pm .hour-mark {
		background: white;
	}
	.datepicker.pm .am-pm-button:last-child {
		color: #FF6E40;
	}
	.datepicker.pm .time-input:focus ~ .formatted-time {
		background: white;
		color: #FF693C;
	}
</style>

<script>
  import { getContext } from 'svelte'
  import { contextKey } from './lib/context.js'

  const { isOpen } = getContext(contextKey)
	
	let time = "12:00"
  let currentoffset = 0
	let timeframe = 'am'
	let edittime = { digits: [] }
  let moving = false
  let offsetx = 0
  let totaloffset = 0
  let currenttime
  let timeline
	let time_input
  let timeline_width
  let timeline_container
	let timepicker_container
  let sectionlength
  let xinitial
  
  $: $isOpen && setTimeBar() && initializeTimepicker()
	
	function changetime (time) {
		timeframe = time
		updateInputTime()
	}
	
	function updateInputTime () {
  	edittime.input = `${time} ${timeframe}`
    edittime.formatted = edittime.input
  }
	
	function getElementOffset (el) {
    const rect = el.getBoundingClientRect()

		return {
			top: rect.top + document.body.scrollTop,
			left: rect.left + document.body.scrollLeft
		}
	}

  updateInputTime()

  function formatTime() {
    const [ a, b, c, d ] = edittime.digits
    const { length } = edittime.digits

    if (length === 1) {
     return `00:0${a} ${timeframe}`
    } else if (length === 2) {
     return `00:${a}${b} ${timeframe}`
    } else if (length === 3) {
     return `0${a}:${b}${c} ${timeframe}`
    } else if (length === 4) {
     return `${a}${b}:${c}${d} ${timeframe}`
    }
  }
	
	 const numbers = {
		 48: 0,
		 49: 1,
		 50: 2,
		 51: 3,
		 52: 4,
		 53: 5,
		 54: 6,
		 55: 7,
		 56: 8,
		 57: 9
	 }
	 
	 const fns = {
		 65: () => {
			 timeframe = 'am'
       time_input = `${time} ${timeframe}`
		 },
		 80: () => {
			 timeframe = 'pm'
       time_input = `${time} ${timeframe}`
		 },
		 8: () => {
			 edittime.digits.pop()
       time_input = formatTime()
		 }
	 }

    function changeInputTime (event) {
			const key = event.which
      const isNumber = numbers[key] !== undefined
      
			if (isNumber && checkValidTime(numbers[key])) {
        if (edittime.digits.length > 3) {
          edittime.digits = []
        }
				edittime.digits.push(numbers[key])
				time_input = formatTime()
        time = formatTime()
				setTimeBar()
			}
			
			const isFunction = fns[key] !== undefined
			isFunction && fns[key]()
      edittime.formatted = time_input
    }

    function checkValidTime (number) {
      if (edittime.digits.length > 3) {
        return true
      }

      if (edittime.digits.length === 0) {
        return number < 2
      }

      if (edittime.digits.length === 1) {
        return edittime.digits[0] === 0 || number < 3
      }

      if (edittime.digits.length === 2) {
        return number < 6
      }

      if (edittime.digits.length === 3) {
        return number < 10
      }
    }

    function pad2 (number) {
      return (number < 10 ? '0' : '') + number
    }
    
    function initializeTimepicker (newWidth = timeline_width / 24 / 6) {
      if (timeline.length > 0) {
          timeline_width = timeline[0].offsetWidth
      }
      sectionlength = newWidth
    }

    function setTimeBar () {
      timeline_width = timeline.offsetWidth
      const [ hours, minutes ] = time.split(':')
      if (hours === 12) { hours = 0 }
      let minutes_offset = (minutes / 60) * (timeline_width / 12)
      let hours_offset = (hours / 12) * timeline_width
      currentoffset = parseInt(hours_offset + minutes_offset - 1)
      currenttime.style.transition = 'transform 0.4s ease'
      currenttime.style.transform = 'translateX(' + currentoffset + 'px)'
    }

    function getTime () {
      const percenttime = (currentoffset + 1) / timeline_width
      let hour = Math.floor(percenttime * 12)
      const percentminutes = (percenttime * 12) - hour
      let minutes = Math.round((percentminutes * 60) / 5) * 5
      if (hour === 0) { hour = 12 }
      if (minutes == 60) {
        hour += 1
        minutes = 0
      }

      time = `${hour}:${pad2(minutes)}`
      updateInputTime()
    }
    
    function getElementWidth (el) {
      return parseFloat(getComputedStyle(el, null).width.replace('px', ''))
    }

    function timeSelectStart (event) {
      initializeTimepicker()
      const timepicker_offset = getElementOffset(timepicker_container)
      xinitial = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX
      moving = true
      currentoffset = xinitial - timepicker_offset.left
      totaloffset = xinitial - timepicker_offset.left
      const timepicker_width = getElementWidth(timepicker_container)
      if (currentoffset < 0) {
          currentoffset = 0
      } else if (currentoffset > timepicker_width) {
          currentoffset = timepicker_width
      }
      currenttime.style.transition =  'none'
      currenttime.style.transform = 'translateX(' + currentoffset + 'px)'
      currenttime.style.cursor = 'ew-resize'
      getTime()
    }

    function onMove (event) {
      if (!moving) { return }
			event.preventDefault()
			offsetx = event.type === 'mousemove' ? event.clientX - xinitial : event.touches[0].clientX - xinitial
			let movex = offsetx + totaloffset
			if (movex >= 0 && movex <= timeline_width) {
				currenttime.style.transform = 'translateX(' + movex + 'px)'
				currentoffset = movex
			} else if (movex < 0) {
				currenttime.style.transform = 'translateX(0)'
				currentoffset = 0
			} else {
				currenttime.style.transform = 'translateX(' + timeline_width + 'px)'
				currentoffset = timeline_width
			}
			getTime()
    }

    function adjustTime (direction) {
      initializeTimepicker()
      let newoffset = direction === 'decrease' ? currentoffset - sectionlength : currentoffset + sectionlength
      if (newoffset < 0 || newoffset > timeline_width) {
        newoffset = newoffset < 0 ? timeline_width - sectionlength : 0 + sectionlength
        timeframe = timeframe === 'am' ? 'pm' : 'am'
      }
      currenttime.style.transform = 'translateX(' + (newoffset - 1) + 'px)'
      currenttime.style.transition = 'transform 0.4s ease'
      currentoffset = newoffset
      totaloffset = currentoffset
      getTime()
    }
</script>
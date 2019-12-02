// Beta version 0.9.1

// LocalStorages
const timeStart = 'time-start'
const timeStop = 'time-stop'
const timeWorkDay = 'time-workday'
const timeDiff = 'time-diff'
const timeIsLooping = 'time-is-looping'

// Default workhours
const def = timeToMs('08:00')

// Timer
let timer

// isLooping-BOOLEAN
let isLooping = false

// Buttons
const btnTimeStart = document.getElementById('start-time-btn')
const btnTimeStop = document.getElementById('stop-time-btn')
const btnTimeSet = document.getElementById('set-time-btn')
const btnClearStorage = document.getElementById('clear-storage-btn')
const clearBtnModal = document.getElementById('clear-btn-modal')

// ***
const wrapper = document.getElementById('wrapper')
const inputTime = document.getElementById('input-time')
const displayDiff = document.getElementById('display-diff')
const displayStart = document.getElementById('display-start')
const displayStop = document.getElementById('display-stop')
const displayTimer = document.getElementById('display-timer')
const displayCalcEnd = document.getElementById('display-calc-end')
const progressBar = document.getElementById('progress-bar')
const looper = document.getElementById('looper')
const displaySetTime = document.getElementById('display-set-time')

// Clear LocalStorage
const clearLocalStorage = () => {
  const vars = [timeStart, timeStop, timeWorkDay, timeDiff, timeIsLooping]
  vars.forEach(e => window.localStorage.removeItem(e))
  window.onload()
}

btnClearStorage.addEventListener('click', () => {
  clearLocalStorage()
  location.reload()
})

// Initialize
const reset = items => {
  items.forEach(item => {
    if (lsGetter(item) === null) lsSetter(item, [new Date(0).getMilliseconds()])
  })
  if (lsGetter(timeWorkDay) === null) lsSetter(timeWorkDay, [def])
  if (lsGetter(timeIsLooping) === null) lsSetter(timeIsLooping, isLooping)
}

window.onload = () => {
  reset([timeStart, timeStop, timeDiff])
  isLooping = lsGetter(timeIsLooping)
  isLooping ? loopTimer() : displayLastDiff()
  enableDisableBtn()
  showSetTime()
  displayLastStart()
  displayLastStop()
  isLooping
    ? looper.classList.add('spinner')
    : looper.classList.remove('spinner')
}

const displayLastStart = () =>
  getLastPost(timeStart) !== 0 &&
  (displayStart.innerHTML = msToTime(getLastPost(timeStart), 'CET'))

const displayLastStop = () =>
  getLastPost(timeStop) !== 0 &&
  (displayStop.innerHTML = msToTime(getLastPost(timeStop), 'CET'))

const displayLastDiff = () =>
  (displayDiff.innerHTML = msToTime(getLastPost(timeDiff)))

// Disable / Enable buttons
const enableDisableBtn = () => {
  const lastStop = dateCreator(getLastPost(timeStop))
  const rightNow = dateCreator(Date.now())

  isLooping ? (btnTimeStart.disabled = true) : (btnTimeStart.disabled = false)
  isLooping ? (btnTimeStop.disabled = false) : (btnTimeStop.disabled = true)
  isLooping || lastStop === rightNow
    ? (btnTimeSet.disabled = true)
    : (btnTimeSet.disabled = false)
  isLooping ? (clearBtnModal.disabled = true) : (clearBtnModal.disabled = false)
}

// Show how many hours to work
const showSetTime = () => {
  const displaySetTime = document.getElementById('display-set-time')
  const workingHours = msToTime(lsGetter(timeWorkDay), 0)
  displaySetTime.innerHTML = workingHours
}

// Set worktime
btnTimeSet.addEventListener('click', () => {
  // const displaySetTime = document.getElementById('display-set-time')
  const ms = timeToMs(inputTime.value)

  markDisplay(displaySetTime)
  lsSetter(timeWorkDay, [ms])
  showSetTime()
  btnTimeStart.focus()
})

// Mark display
const markDisplay = display => {
  display.classList.add('marked-mono')
  setTimeout(() => {
    display.classList.remove('marked-mono')
  }, 500)
}

// START LOOP
btnTimeStart.addEventListener('click', () => {
  markDisplay(displayStart)
  timeArrayStamper(timeStart)
  isLooping = true
  setIsLooping(true)
  enableDisableBtn()
  loopTimer()
  displayLastStart()
  looper.classList.add('spinner')
})

// STOP LOOP
btnTimeStop.addEventListener('click', () => {
  markDisplay(displayStop)
  timeArrayStamper(timeStop)
  diffTimeStamper(timeStart, timeStop, timeDiff, timeWorkDay)
  isLooping = false
  setIsLooping(false)
  enableDisableBtn()
  clearTimeout(timer)
  displayLastStop()
  displayLastDiff()
  looper.classList.remove('spinner')
  progressBar.classList.remove('progress-bar-striped')
  progressBar.classList.remove('progress-bar-animated')
})

// Timer function
const loopTimer = () => {
  const last_time_stop = getLastPost(timeStop)
  const last_time_start = getLastPost(timeStart)
  const last_time_diff = getLastPost(timeDiff)
  const last_work_day = getLastPost(timeWorkDay)
  const evaluate_last_time_stop = dateCreator(last_time_stop)
  const evaluate_last_time_start = dateCreator(last_time_start)
  const right_now = new Date(Date.now()).getTime()

  let diff

  evaluate_last_time_stop === evaluate_last_time_start
    ? (diff = right_now - last_time_start + last_time_diff)
    : (diff = right_now - last_time_start - last_work_day + last_time_diff)

  // Display
  if (diff > 0) {
    displayDiff.style.color = '#27a745'
  } else if (diff < 0) displayDiff.style.color = '#dc3545'

  displayDiff.innerHTML = msToTime(diff)
  displayCalcEnd.innerHTML = endOfDay(right_now, diff)
  showProgress(right_now, last_time_start, diff)

  timer = setTimeout(() => {
    loopTimer()
  }, 100)
}

// End of day // Returnerar dagsavslut om loopen är igång. Annars FALSE.
const endOfDay = (right_now, diff) => {
  const end = right_now - diff
  return isLooping && msToTime(end, 'CET')
}

// Show progress
const showProgress = (now, last_time_start, diff) => {
  const start = last_time_start
  const end = now - diff
  const total = end - start
  const progress = (((now - start) / total) * 100).toFixed(1)

  if (progress > 100 || progress < 0) {
    progressBar.style.width = '100%'
    progressBar.innerHTML = '100%'
    progressBar.classList.add('bg-success')
    progressBar.classList.remove('progress-bar-striped')
    progressBar.classList.remove('progress-bar-animated')
  } else {
    progressBar.classList.add('progress-bar-striped')
    progressBar.classList.add('progress-bar-animated')
    progressBar.style.width = progress + '%'
    progressBar.innerHTML = progress + '%'
  }
}

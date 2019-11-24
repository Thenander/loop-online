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

// ***
const inputTime = document.getElementById('input-time')
const displayDiff = document.getElementById('display-diff')
const displayStart = document.getElementById('display-start')
const displayStop = document.getElementById('display-stop')
const displayTimer = document.getElementById('display-timer')

const endOfDay = 0

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
  isLooping ? loopTimer() : (displayTimer.innerHTML = '')
  enableDisableBtn()
  showSetTime()
  displayLastStart()
  displayLastStop()
  displayLastDiff()
}

const displayLastStart = () =>
  getLastPost(timeStart) !== 0 &&
  (displayStart.innerHTML = msToTime(getLastPost(timeStart), 'x'))

const displayLastStop = () =>
  getLastPost(timeStop) !== 0 &&
  (displayStop.innerHTML = msToTime(getLastPost(timeStop), 'x'))

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
  isLooping
    ? (btnClearStorage.disabled = true)
    : (btnClearStorage.disabled = false)
}

// Show how many hours to work
const showSetTime = () => {
  const displaySetTime = document.getElementById('display-set-time')
  const workingHours = msToTime(lsGetter(timeWorkDay), 0)
  displaySetTime.innerHTML = workingHours
}

// Set worktime
btnTimeSet.addEventListener('click', () => {
  const ms = timeToMs(inputTime.value)
  lsSetter(timeWorkDay, [ms])
  showSetTime()
})

// START LOOP
btnTimeStart.addEventListener('click', () => {
  timeArrayStamper(timeStart)
  isLooping = true
  setIsLooping(true)
  enableDisableBtn()
  loopTimer()
  displayLastStart()
})

// STOP LOOP
btnTimeStop.addEventListener('click', () => {
  timeArrayStamper(timeStop)
  diffTimeStamper(timeStart, timeStop, timeDiff, timeWorkDay)
  isLooping = false
  setIsLooping(false)
  enableDisableBtn()
  clearTimeout(timer)
  displayLastStop()
  displayLastDiff()
})

// Timer function
const loopTimer = () => {
  const last_time_stop = getLastPost(timeStop)
  const last_time_start = getLastPost(timeStart)
  const last_time_diff = getLastPost(timeDiff)
  const last_work_day = getLastPost(timeWorkDay)
  const evaluate_second_to_last_time_stop = dateCreator(last_time_stop)
  const evaluate_last_time_start = dateCreator(last_time_start)
  const right_now = new Date(Date.now()).getTime()

  let diff

  evaluate_second_to_last_time_stop === evaluate_last_time_start
    ? (diff = right_now - last_time_start + last_time_diff)
    : (diff = right_now - last_time_start - last_work_day + last_time_diff)

  displayTimer.innerHTML = msToTime(diff)

  timer = setTimeout(() => {
    loopTimer()
  }, 1000)
}

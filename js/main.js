// Default workhours
const def = timeToMs('08:00')

// Clear LocalStorage
const clearLocalStorage = () => {
  const vars = [timeStart, timeStop, timeWorkDay, timeDiff, timeIsLooping]
  vars.forEach(e => window.localStorage.removeItem(e))
  window.onload()
}

btnClearStorage.addEventListener('click', () => {
  clearLocalStorage()

  $('#modal').modal('hide')

  const txt = 'Memory cleared'

  const msg = '<div><h2>' + txt + '</h2></div>'

  displaySavePopup(msg)
  clear()

  setTimeout(() => {
    location.reload()
  }, 1500)
})

async function clear() {
  await setTimeout(() => {
    console.log('wait...')
  }, 1000)
  console.log('hupp')
}

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
  isLooping ? displayNonStop() : displayLastStop()
  isLooping
    ? looper.classList.add('spinner')
    : looper.classList.remove('spinner')
}

const displayLastStart = () =>
  getLastPost(timeStart) !== 0 &&
  (displayStart.innerHTML = msToDate(getLastPost(timeStart), 'CET'))

const displayLastStop = () =>
  getLastPost(timeStop) !== 0 &&
  (displayStop.innerHTML = msToDate(getLastPost(timeStop), 'CET'))

const displayNonStop = () => (displayStop.innerHTML = '')

const displayLastDiff = () =>
  (displayDiff.innerHTML = msToTimeSecs(getLastPost(timeDiff)))

// Disable / Enable buttons
const enableDisableBtn = () => {
  const lastStop = dateCreator(getLastPost(timeStop))
  const rightNow = dateCreator(Date.now())

  isLooping ? (btnTimeStart.disabled = true) : (btnTimeStart.disabled = false)
  isLooping ? (btnTimeStop.disabled = false) : (btnTimeStop.disabled = true)
  isLooping || lastStop === rightNow
    ? (btnTimeSet.disabled = true)
    : (btnTimeSet.disabled = false)
  isLooping ? (btnClearModal.disabled = true) : (btnClearModal.disabled = false)
  isLooping
    ? (btnEditDiffTime.disabled = true)
    : (btnEditDiffTime.disabled = false)
}

// Show how many hours to work
const showSetTime = () => {
  const displaySetTime = document.getElementById('display-set-time')
  const workingHours = msToTime(lsGetter(timeWorkDay))
  displaySetTime.innerHTML = workingHours
}

// Set worktime
btnTimeSet.addEventListener('click', () => {
  let ms
  inputTime.value ? (ms = timeToMs(inputTime.value)) : (ms = 0) // Check if input is empty

  lsSetter(timeWorkDay, [ms])
  const t = msToTime(ms)

  const txt = 'Work hours:'
  const msg = '<div><h5>' + txt + '</h5></div><div><h1>' + t + '</h1></div>'

  displaySavePopup(msg)
  showSetTime()
  markDisplay(displaySetTime)
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
  displayNonStop()
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

  displayDiff.innerHTML = msToTimeSecs(diff)
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

document.getElementById('footer').innerHTML =
  '<small>Beta version ' + version + '</small>'

// LocalStorage
const ls = window.localStorage

// Getters and Setters
const lsSetter = (key, value) => ls.setItem(key, JSON.stringify(value))
const lsGetter = key => JSON.parse(ls.getItem(key))

const getTwoDigits = number => (number = number < 10 ? '0' + number : number)
const getLastPost = key => lsGetter(key)[lsGetter(key).length - 1]
const getSecondToLastPost = key => lsGetter(key)[lsGetter(key).length - 2]
const getLength = key => lsGetter(key).length
const setIsLooping = boo => lsSetter(timeIsLooping, boo)

// Returns date in Swedish format
const dateCreator = date => {
  const year = new Date(date).getFullYear()
  const month = new Date(date).getMonth() + 1
  const day = new Date(date).getDate()
  return year + '-' + month + '-' + day
}

/**
 * Sets a new diff calculated on logins/logouts
 * @param {string} s timeStart (Key)
 * @param {string} t timeStop (Key)
 * @param {string} d timeDiff (Key)
 * @param {string} w timeWorkDay (Key)
 */
const diffTimeStamper = (s, t, d, w) => {
  const secondToLast = getSecondToLastPost(t)
  const lastS = getLastPost(s)
  const lastT = getLastPost(t)
  const lastD = getLastPost(d)
  const lastW = getLastPost(w)

  let totD // Diff
  const c1 = dateCreator(secondToLast) // Comparer 1
  const c2 = dateCreator(lastS) // Comparer 2

  c1 === c2
    ? (totD = lastT - lastS + lastD)
    : (totD = lastT - lastS - lastW + lastD)

  const dArr = lsGetter(d)
  dArr.push(totD)
  lsSetter(d, dArr)
}

const timeArrayStamper = key => {
  const value = lsGetter(key)
  const rightNow = new Date(Date.now())
  value.push(rightNow.getTime())
  lsSetter(key, value)
  return value
}

/**
 * Returns a number in milliseconds
 * @param {string} time The time in format 'HH:MM'
 * @param {boolean} isNegative true if negative, false otherwise
 */
const timeToMs = (time, isNegative) => {
  const timeArr = time.split(':')
  const hours = parseInt(timeArr[0])
  const minutes = parseInt(timeArr[1])
  let millis = 0
  millis += hours * 3600000
  millis += minutes * 60000
  if (isNegative) millis = millis - millis - millis
  return millis
}

/**
 * Returns a string with positive or negative time
 * @param {any} duration duration in milliseconds
 * @param {any} timeZone 'CET' if CET, leave empty if UTC
 */
const msToTime = (duration, timeZone) => {
  let sign = ''
  Math.sign(duration) === -1 && (sign = '-')

  const date = new Date(duration)
  const day = date.getUTCDay()

  timeZone === 'CET'
    ? (duration = Math.abs(duration) + 3600000)
    : (duration = Math.abs(duration))

  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let seconds = Math.floor((duration / 1000) % 60)

  hours = getTwoDigits(hours)
  minutes = getTwoDigits(minutes)
  // seconds = getTwoDigits(seconds)

  return sign + hours + ':' + minutes
  // return sign + hours + ':' + minutes + ':' + seconds
}

/**
 * Returns a string with positive or negative time
 * @param {any} duration duration in milliseconds
 * @param {any} timeZone 'CET' if CET, leave empty if UTC
 */
const msToTimeSecs = (duration, timeZone) => {
  let sign = ''
  Math.sign(duration) === -1 && (sign = '-')

  const date = new Date(duration)
  const day = date.getUTCDay()

  timeZone === 'CET'
    ? (duration = Math.abs(duration) + 3600000)
    : (duration = Math.abs(duration))

  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let seconds = Math.floor((duration / 1000) % 60)

  hours = getTwoDigits(hours)
  minutes = getTwoDigits(minutes)
  seconds = getTwoDigits(seconds)

  return sign + hours + ':' + minutes + ':' + seconds
}

const msToDate = (duration, timeZone) => {
  const monthArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const date = new Date(duration)

  timeZone === 'CET'
    ? (duration = Math.abs(duration) + 3600000)
    : (duration = Math.abs(duration))

  const year = date.getFullYear()
  const monthNumber = date.getMonth()

  const month = monthArray[monthNumber]

  const dateNo = date.getDate()
  const day = date.getDay()
  // const hours = date.getHours()
  // const minutes = date.getMinutes()
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  // let seconds = Math.floor((duration / 1000) % 60)

  hours = getTwoDigits(hours)
  minutes = getTwoDigits(minutes)
  // seconds = getTwoDigits(seconds)

  return dateNo + ' ' + month + ', ' + hours + ':' + minutes
  // return dateNo + ' ' + month + ', ' + hours + ':' + minutes + ':' + seconds
}

/**
 * @param {any} msg Message to be displayed in popup (Please include tags. Ex '<h1>Success!</h1>')
 */
const displaySavePopup = msg => {
  popUp.innerHTML = msg
  popUp.classList.add('pop-up-visible')
  setTimeout(() => {
    popUp.classList.remove('pop-up-visible')
  }, 2000)
}

/**
 * Returns an array of the last X logins/logouts
 * @param {number} num The number of logins/logouts to show
 * @param {string} x "i" for logIns, "o" for logOuts
 */
const listLastLogs = (num, x) => {
  let fullArray = []
  const arr = []

  if (x === 'i') fullArray = lsGetter(timeStart)
  else if (x === 'o') fullArray = lsGetter(timeStop)
  else return

  if (fullArray !== null) {
    let startNo = fullArray.length - num
    startNo < 1 && (startNo = 1)
    for (let i = startNo; i < fullArray.length; i++) arr.push(fullArray[i])
  }

  return arr
}

// Beta version 0.9.1

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
 * @param {string} timeStart key
 * @param {string} timeStop key
 * @param {string} timeDiff key
 */
const diffTimeStamper = (timeStart, timeStop, timeDiff, timeWorkDay) => {
  const secondToLast = getSecondToLastPost(timeStop)
  const lastTimeStart = getLastPost(timeStart)
  const lastTimeStop = getLastPost(timeStop)
  const lastTimeDiff = getLastPost(timeDiff)
  const workDay = getLastPost(timeWorkDay)

  let diff
  const comp1 = dateCreator(secondToLast)
  const comp2 = dateCreator(lastTimeStart)

  comp1 === comp2
    ? (diff = lastTimeStop - lastTimeStart + lastTimeDiff)
    : (diff = lastTimeStop - lastTimeStart - workDay + lastTimeDiff)

  const diffArray = lsGetter(timeDiff)
  diffArray.push(diff)
  lsSetter(timeDiff, diffArray)
}

const timeArrayStamper = key => {
  const value = lsGetter(key)
  const rightNow = new Date(Date.now())
  value.push(rightNow.getTime())
  lsSetter(key, value)
  return value
}

const timeToMs = time => {
  const timeArr = time.split(':')
  const hours = parseInt(timeArr[0])
  const minutes = parseInt(timeArr[1])
  let millis = 0
  millis += hours * 3600000
  millis += minutes * 60000
  return millis
}

/**
 * @param {any} duration duration in milliseconds
 * @param {any} timeZone 'CET' if CET, leave empty if UTC
 */
const msToTime = (duration, timeZone) => {
  let sign = ''
  Math.sign(duration) === -1 && (sign = '-')

  timeZone === 'CET'
    ? (duration = Math.abs(duration) + 3600000)
    : (duration = Math.abs(duration))

  // duration = Math.abs(duration) + 3600000

  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let seconds = Math.floor((duration / 1000) % 60)

  hours = getTwoDigits(hours)
  minutes = getTwoDigits(minutes)
  seconds = getTwoDigits(seconds)

  return sign + hours + ':' + minutes + ':' + seconds
}

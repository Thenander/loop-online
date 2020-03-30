const stops = lsGetter(timeStop)
const starts = lsGetter(timeStart)
const lastStop = getLastPost(timeStop)
const lastStart = getLastPost(timeStart)
const stopDate = new Date(lastStop)
const startDate = new Date(lastStart)

const lastStopElements = x => stops.slice(Math.max(stops.length - x, 1))
const lastStartElements = x => starts.slice(Math.max(starts.length - x, 1))

// const myArray = [4, 12, 12, 41, 41, 41, 63]
// const myFunction = (originalArray, isLogout) => {
//   let arr = []
//   for (let i = originalArray.length - 1; i >= 0; i--) {
//     const previous = originalArray[i - 1]
//     const current = originalArray[i]
//     arr.push(current)

//     if (current === previous) continue
//     else if (isLogout) return arr[0]
//     else return arr[arr.length - 1]
//   }
// }

// console.log(myFunction(myArray, true))

/**
 * Determines if the dates are the same
 * @param {Number} a start time in milliseconds
 * @param {Number} b end time in milliseconds
 */
const dateIsTheSame = (a, b) => msToDate(a) === msToDate(b)

const test = dateIsTheSame(startDate, stopDate)

displayToday.innerHTML = test

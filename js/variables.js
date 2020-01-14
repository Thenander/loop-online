// Version
const version = '0.9.5'
const gitCommit = 'Version ' + version + ', Clear last post, Copy to clipboard.'

// Default hours
const def = timeToMs('08:00')

// LocalStorages
const timeDiff = 'time-diff'
const timeStop = 'time-stop'
const timeStart = 'time-start'
const timeWorkDay = 'time-workday'
const timeIsLooping = 'time-is-looping'

// Timer
let timer

// isLooping-BOOLEAN
let isLooping = false

// Buttons and checkboxes
const btnTimeSet = document.getElementById('set-time-btn')
const btnTimeStop = document.getElementById('stop-time-btn')
const btnTimeStart = document.getElementById('start-time-btn')
const btnClearModal = document.getElementById('btn-clear-modal')
const btnClearStorage = document.getElementById('clear-storage-btn')
const btnClearLastPost = document.getElementById('clear-last-post-btn')
const btnEditDiffTime = document.getElementById('edit-diff-time-btn')
const minusCheckBox = document.getElementById('edit-diff-time-chbx')

// Displays
const displayStop = document.getElementById('display-stop')
const displayDiff = document.getElementById('display-diff')
const displayTimer = document.getElementById('display-timer')
const displayStart = document.getElementById('display-start')
const displaySetTime = document.getElementById('display-set-time')
const displayCalcEnd = document.getElementById('display-calc-end')
const displayEditedDiff = document.getElementById('display-edited-diff')
const displayListStart = document.getElementById('display-list-start')
const displayListStop = document.getElementById('display-list-stop')
const displayListDiff = document.getElementById('display-list-diff')
const displayClock = document.getElementById('display-clock')
const listLogs = document.getElementById('list-logs')

// Areas and popups
const wrapper = document.getElementById('wrapper')
const progressBar = document.getElementById('progress-bar')
const looper = document.getElementById('looper')
const popUp = document.getElementById('pop-up')

// Inputs
const inputTime = document.getElementById('input-time')
const diffInput = document.getElementById('diff-input')

// Lists
const loopIns = lsGetter(timeStart)
const loopOuts = lsGetter(timeStop)

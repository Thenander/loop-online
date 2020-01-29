function clock() {
  const today = new Date().toLocaleTimeString()
  displayClock.innerHTML = today
  const t = setTimeout(clock, 1000)
}

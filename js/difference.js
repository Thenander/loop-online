const resetDiffTimeEditor = () => {
  diffInput.value = ''
  minusCheckBox.checked = false
}

const setNewDiffTime = () => {
  let ms
  const diffs = lsGetter(timeDiff)
  const idx = diffs.length - 1 // The index of the last diff-time

  // Check if input is empty
  diffInput.value
    ? (ms = timeToMs(diffInput.value, minusCheckBox.checked))
    : (ms = 0)

  const newDiffInTime = msToTime(ms)

  // Re-set last index
  diffs[idx] = ms

  lsSetter(timeDiff, diffs)

  const msg = '<h5>New diff saved!</h5><h1>' + newDiffInTime + '</h1>'

  resetDiffTimeEditor()
  setTimeout(() => location.reload(), 1500)
  displayPopUp(msg)

  displayDiff.innerHTML = newDiffInTime
  document.getElementById('start-time-btn').focus()
}

btnEditDiffTime.addEventListener('click', setNewDiffTime)

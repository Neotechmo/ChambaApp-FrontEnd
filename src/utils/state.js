export function sameData(left, right) {
  if (Object.is(left, right)) return true

  try {
    return JSON.stringify(left) === JSON.stringify(right)
  } catch {
    return false
  }
}

export function setStable(setter, nextValue) {
  setter((current) => (sameData(current, nextValue) ? current : nextValue))
}

export const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomSelect = (arr, size) => {
  if (size > arr.length) {
    throw new Error('size can\'t be larger than arr length')
  }
  const length = arr.length
  const selectIdx = []
  const result = []
  while (selectIdx.length < size) {
    const idx = randomNumberBetween(0, length - 1)
    if (!selectIdx.includes(idx)) {
      selectIdx.push(idx)
      result.push(arr[idx])
    }
  }
  return result
}

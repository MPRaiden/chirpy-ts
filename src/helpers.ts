export function envOrThrow(key: string | undefined) {
  if (key === undefined) {
    throw new Error(`function envOrThrow() - key "${key}" is undefined`)
  }

  return key
}

export function isPositiveInteger(value: any) {
  // Convert the value to a number first.
  const num = Number(value)

  // Check if it's an integer and greater than 0.
  return Number.isInteger(num) && num > 0
}


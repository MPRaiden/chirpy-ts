export function envOrThrow(key: string | undefined) {
  if (key === undefined) {
    throw new Error(`function envOrThrow() - key "${key}" is undefined`)
  }

  return key
}


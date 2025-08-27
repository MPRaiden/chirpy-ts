export function envOrThrow(key) {
    if (key === undefined) {
        throw new Error(`function envOrThrow() - key "${key}" is undefined`);
    }
    return key;
}

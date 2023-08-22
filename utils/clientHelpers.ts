export function userMessageIsContextual(message: string) {
  return /^<\w+>/.test(message);
}

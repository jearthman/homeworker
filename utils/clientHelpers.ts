export async function userMessageIsContextual(message: string) {
  return /^<\w+>/.test(message);
}

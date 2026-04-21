export async function splitSentences() {
  const res = await window.electronAPI.runPrompt("hello");
  console.log(res);
}

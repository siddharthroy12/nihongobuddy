export function extractJSONFromLLMResposne(response: string) {
  if (!response || typeof response !== "string") return null;

  // 1. Try parsing the whole string first (clean JSON response)
  try {
    return JSON.parse(response.trim());
  } catch {}

  // 2. Extract from ```json ... ``` code blocks
  const jsonBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim());
    } catch {}
  }

  // 3. Extract from generic ``` ... ``` code blocks
  const codeBlockMatch = response.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {}
  }

  // 4. Find the first { ... } or [ ... ] block in mixed text
  const firstBrace = response.indexOf("{");
  const firstBracket = response.indexOf("[");

  let startIndex = -1;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
  }

  if (startIndex !== -1) {
    // Walk backwards from the end to find the matching closing delimiter
    const openChar = response[startIndex];
    const closeChar = openChar === "{" ? "}" : "]";

    let lastIndex = response.lastIndexOf(closeChar);
    while (lastIndex > startIndex) {
      try {
        return JSON.parse(response.slice(startIndex, lastIndex + 1));
      } catch {
        lastIndex = response.lastIndexOf(closeChar, lastIndex - 1);
      }
    }
  }

  return null; // No valid JSON found
}

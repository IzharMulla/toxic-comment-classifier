/**
 * Service function to request toxicity analysis from the Vercel Python serverless endpoint.
 * Relative path `/api/predict` routes natively under the same origin in Vercel.
 */
export async function analyzeComment(text) {
  if (!text || !text.trim()) {
    throw new Error("Comment cannot be empty.");
  }

  if (text.length > 5000) {
    throw new Error("Comment exceeds maximum limit of 5000 characters.");
  }

  const response = await fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text.trim() }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP Error ${response.status}: Failed to analyze comment.`);
  }

  return data;
}

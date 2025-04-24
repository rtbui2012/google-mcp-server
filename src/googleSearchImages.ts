import fetch from "node-fetch";
import { ToolInput, ToolResult } from "./types";

export const googleSearchImages = async (input: ToolInput): Promise<ToolResult> => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cxId = process.env.GOOGLE_CX_ID;
  const maxResults = 5;

  if (!input.query || typeof input.query !== "string") {
    return { result: JSON.stringify({ error: "Query must be a non-empty string" }) };
  }
  if (!apiKey || !cxId) {
    return { result: JSON.stringify({ error: "Missing GOOGLE_API_KEY or GOOGLE_CX_ID environment variables" }) };
  }

  const url = "https://www.googleapis.com/customsearch/v1";
  const params = new URLSearchParams({
    key: apiKey,
    cx: cxId,
    q: input.query,
    searchType: "image",
    num: String(Math.min(maxResults, 10))
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`);
    if (!response.ok) {
      return { result: JSON.stringify({ error: `Google API error: ${response.status} ${response.statusText}` }) };
    }
    const data = await response.json() as any;
    const items = data.items || [];
    if (items.length > 0) {
      const first = items[0];
      const title = (first.title || input.query).replace(/\[/g, "\\[").replace(/\]/g, "\\]");
      const imageUrl = first.link || "";
      if (imageUrl) {
        return { result: `![${title}](${imageUrl})` };
      } else {
        return { result: `Found an image result for '${input.query}' but it is missing a URL.` };
      }
    } else {
      return { result: `No image found for '${input.query}'.` };
    }
  } catch (e: any) {
    return { result: JSON.stringify({ error: `Error executing Google image search: ${e.message}` }) };
  }
};
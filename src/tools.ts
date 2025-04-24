/**
 * Tool definitions for the MCP Google Search Server
 *
 * googleSearchContent: Search Google for content (stub)
 * googleSearchImages: Search Google for images (stub)
 */

import fetch from "node-fetch";

export interface ToolInput {
  query: string;
  siteFilter?: string; // Add optional siteFilter
}

export interface ToolResult {
  result: string;
}

export const tools = {
  googleSearchContent: async (input: ToolInput): Promise<ToolResult> => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cxId = process.env.GOOGLE_CX_ID;
    const maxResults = 5;
    const includeSnippets = true;
    const filterAds = true;

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
      num: String(Math.min(maxResults, 10))
    });

    // Add siteFilter if provided
    if (input.siteFilter) {
      params.append('siteSearch', input.siteFilter);
      params.append('siteSearchFilter', 'i'); // Include results from the specified site
    }

    try {
      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) {
        return { result: JSON.stringify({ error: `Google API error: ${response.status} ${response.statusText}` }) };
      }
      const data = await response.json() as any;

      const formattedResults = {
        engine: "Google",
        query: input.query,
        total_results: data?.searchInformation?.totalResults || "0",
        items: []
      } as {
        engine: string;
        query: string;
        total_results: string;
        items: Array<{ title: string; link: string; snippet?: string }>;
      };

      for (const item of data.items || []) {
        // Optionally filter ads (very basic: skip if displayLink starts with "ad")
        if (filterAds && item.displayLink && item.displayLink.startsWith("ad")) continue;
        const resultItem: { title: string; link: string; snippet?: string } = {
          title: item.title || "",
          link: item.link || ""
        };
        if (includeSnippets) {
          resultItem.snippet = item.snippet || "";
        }
        formattedResults.items.push(resultItem);
      }

      return { result: JSON.stringify(formattedResults) };
    } catch (e: any) {
      return { result: JSON.stringify({ error: `Error executing Google search: ${e.message}` }) };
    }
  },
  googleSearchImages: async (input: ToolInput): Promise<ToolResult> => {
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
  }
};
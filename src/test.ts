import "dotenv/config";
// Test script for the MCP Google Search Server

import { tools } from "./tools";

async function testGoogleSearchContent() {
  const result = await tools.googleSearchContent({ query: "OpenAI GPT-4" });
  console.log("googleSearchContent result:");
  try {
    console.log(JSON.stringify(JSON.parse(result.result), null, 2));
  } catch {
    console.log(result.result);
  }
}

testGoogleSearchContent();
#!/usr/bin/env node
/**
 * MCP Server entry point for Google Search tools
 * Exposes googleSearchContent and googleSearchImages as MCP tools.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import { tools } from './tools';

// Define MCP tool schemas
const mcpTools = [
  {
    name: 'googleSearchContent',
    description: 'Search Google for content and return results.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        siteFilter: { type: 'string', description: 'Optional domain or URL prefix to restrict search (e.g., example.com or example.com/blog)' }
      },
      required: ['query']
    }
  },
  {
    name: 'googleSearchImages',
    description: 'Search Google for images and return results.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Image search query' }
      },
      required: ['query']
    }
  }
];

const server = new Server(
  { name: 'mcp-google-search', version: '0.1.0' },
  { capabilities: { tools: {}, resources: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: mcpTools
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const toolFn = tools[req.params.name as keyof typeof tools];
  if (!toolFn) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${req.params.name}`);
  }
  try {
    const args = req.params.arguments;
    // Validate query
    if (!args || typeof args.query !== 'string' || !args.query.trim()) {
      throw new McpError(ErrorCode.InvalidParams, 'Missing or invalid "query" parameter');
    }
    // Validate optional siteFilter
    if (args.siteFilter && typeof args.siteFilter !== 'string') {
        throw new McpError(ErrorCode.InvalidParams, 'Invalid "siteFilter" parameter, must be a string');
    }

    // Pass validated args to the tool function
    const result = await toolFn(args as { query: string; siteFilter?: string });
    return {
      content: [
        {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result)
        }
      ]
    };
  } catch (err: any) {
    throw new McpError(ErrorCode.InternalError, err?.message || String(err));
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Google Search server running');
}

run().catch(console.error);
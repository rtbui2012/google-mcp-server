# Google MCP Server

This project implements a Model Context Protocol (MCP) server for Google APIs enabling integration with AI assistants and other MCP-compatible clients.

---

## Prerequisites

- Node.js 18+
- npm

---

## Installation

### 1. Clone the repository

```sh
git clone https://github.com/your-username/mcp-google-search.git
cd google-mcp-server
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up your Google Custom Search API credentials

Create a `.env` file in the project root with the following content:

```
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CX_ID=your_custom_search_engine_id_here
```

- `GOOGLE_API_KEY`: Your Google Custom Search API key.
- `GOOGLE_CX_ID`: Your Google Custom Search Engine ID.

You can obtain these from the [Google Custom Search JSON API documentation](https://developers.google.com/custom-search/v1/overview).

---

## Usage

### 1. Run a test search

```sh
npx ts-node src/test.ts
```

This will execute a sample search and print the results to the console.

### 2. Integrate with MCP-compatible clients

To use this server as part of an MCP configuration, add an entry to your MCP settings file (e.g., `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "google-api": {
      "command": "npx",
      "args": ["ts-node", "src/index.ts"],
      "env": {
        "GOOGLE_API_KEY": "your_google_api_key_here",
        "GOOGLE_CX_ID": "your_custom_search_engine_id_here"
      }
    }
  }
}
```

Replace the API key and CX ID with your actual credentials.

---

## Available Tools

The server provides the following tools:

1. **googleSearchContent**: Performs a web search using the Google Custom Search API and returns structured results (titles, links, and snippets).
2. **googleSearchImages**: Performs an image search using the Google Custom Search API and returns a Markdown image link for the first result.

Refer to the source code in `src/tools.ts` for detailed usage information.

---

## Development

To make changes to the project:

1. Modify the code in the `src` directory as needed.
2. If you add or remove dependencies, update `package.json` accordingly.
3. Restart your MCP client or test script to apply changes.

---

## Troubleshooting

- Ensure your Google API key and CX ID are correctly set in the `.env` file or your environment.
- Check that all dependencies are installed (`npm install`).
- Verify that you are using Node.js 18 or newer.
- If you make changes to the code, restart your server or test script.

---

## License

This project is licensed under the MIT License.
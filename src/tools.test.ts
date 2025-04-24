import { tools } from './tools';

describe('googleSearchContent', () => {
  it('returns search results for a valid query', async () => {
    const result = await tools.googleSearchContent({ query: 'OpenAI GPT-4' });
    expect(result).toHaveProperty('result');
    // Optionally, check that the result is a JSON string with expected fields
    const parsed = JSON.parse(result.result);
    expect(Array.isArray(parsed)).toBe(true);
    if (parsed.length > 0) {
      expect(parsed[0]).toHaveProperty('title');
      expect(parsed[0]).toHaveProperty('link');
      expect(parsed[0]).toHaveProperty('snippet');
    }
  });
});
import { detectGenre } from '../utils/genre-detector';

export async function analyzeCommits(commits, apiKey) {
  // Detect genre first
  const genre = detectGenre(commits);

  const messages = commits
    .slice(0, 20)
    .map(c => `- "${c.message}"`)
    .join('\n');

  const prompt = `
Analyze these Git commit messages and return ONLY valid JSON (no markdown, no extra text):

${messages}

Detected genre: ${genre.name} (${genre.description})

Return exactly this format:
{
  "vibe": "One sentence describing the coding energy",
  "bpm": ${genre.bpmRange[0] + Math.floor((genre.bpmRange[1] - genre.bpmRange[0]) / 2)}
}

Match the vibe to the ${genre.name} genre. BPM should be in range ${genre.bpmRange[0]}-${genre.bpmRange[1]}.
  `.trim();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (response.status === 401) {
      throw new Error('Invalid API key');
    }

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    // Strip markdown code blocks if present
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const analysis = JSON.parse(cleaned);

    // Add genre to response
    return {
      ...analysis,
      genre: genre.name,
      genreEmoji: genre.emoji
    };
  } catch (error) {
    console.error('LLM Analysis Error:', error);
    throw error;
  }
}

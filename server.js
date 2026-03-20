/**
 * Weliepedia Backend Server
 * 
 * This Express server handles the article generation endpoint by calling the Groq API
 * with the appropriate model and parameters. It validates inputs, processes responses,
 * and returns structured JSON for the frontend.
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

let globalLieCount = parseInt(process.env.INITIAL_LIE_COUNT || '142', 10);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Weliepedia Backend API',
    endpoints: {
      health: '/health',
      generate: '/api/article',
      stats: '/api/stats'
    }
  });
});

app.get('/api/stats', (req, res) => {
  res.json({ totalLies: globalLieCount });
});

app.post('/api/article', async (req, res) => {
  const validation = validateInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, error: validation.message, field: validation.field });
  }

  try {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return res.status(500).json({ success: false, error: 'Groq API key not configured.', code: 'API_KEY_MISSING' });
    }

    const { liarName, victim, lie, tone, length, format, modelId } = validation.data;
    
    const modelMapping = {
      'llama3-70b': 'llama-3.3-70b-versatile',
      'mistral': 'llama-3.1-70b-versatile',
      'qwen3': 'qwen-2.5-32b',
      'gpt-oss': 'gemma-7b-it',
      'llama3-8b': 'llama-3.1-8b-instant',
      'kimi': 'claude-3-5-sonnet-20241022'
    };
    
    const groqModel = modelMapping[modelId];
    if (!groqModel) {
      return res.status(400).json({ success: false, error: `Invalid model ID: ${modelId}`, field: 'modelId' });
    }

    const prompt = createPrompt({ liarName, victim, lie, tone, length, format });

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: groqModel,
        messages: [
          {
            role: 'system',
            content: "You are a cynical, mildly impressed journalist covering humanity's greatest lies. Your writing is funny, sarcastic, unhinged, and never polite. Treat the lie as documented historical fact."
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.85,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 25000
      }
    );

    const apiResponse = response.data;
    if (!apiResponse.choices || !apiResponse.choices[0]?.message?.content) {
      throw new Error('Invalid API response structure');
    }

    const articleContent = apiResponse.choices[0].message.content;
    globalLieCount++; // Increment lie counter
    
    res.status(200).json({
      success: true,
      article: articleContent,
      format,
      tone,
      model: modelId
    });
    
  } catch (error) {
    if (error.response) {
      const errorCode = error.response.status;
      const errorMessage = error.response.data.error?.message || 'Groq API error';
      console.error(`Groq API error [${errorCode}]: ${errorMessage}`);
      return res.status(errorCode).json({ success: false, error: `API service error: ${errorMessage}`, code: errorCode });
    } else if (error.message === 'Invalid API response structure') {
      console.error('Invalid response structure from Groq API');
      return res.status(502).json({ success: false, error: 'Invalid response from AI service.', code: 'API_RESPONSE_INVALID' });
    } else {
      console.error('Server error:', error.message);
      return res.status(500).json({ success: false, error: 'Internal server error.', code: 'SERVER_ERROR' });
    }
  }
});

function createPrompt({ liarName, victim, lie, tone, length, format }) {
  const toneDescriptions = {
    deadpan: 'Write in a flat, deadpan tone treating absolute absurdity as profound fact.',
    melodrama: 'Write with extreme emotional exaggeration. Add sparkles and dramatic gasps.',
    sarcasm: 'Write with heavy sarcasm, rolling your eyes at the gullibility of everyone involved.',
    gaslighting: 'Subtly make the lie sound so reasonable that the reader starts doubting their own grasp on reality.',
    thriller: 'Suspenseful, tense, paranoid. Like a gripping crime thriller.',
    horror: 'Eerie, unsettling, gothic nightmare aesthetic.'
  };
  
  const lengthConstraints = {
    quick: 'CONSTRAINT: Maximum 2-3 paragraphs. Lead max 2 sentences. Max word count: 200.',
    full: 'CONSTRAINT: Exactly 3 sections with rich context. Detail the background. Max word count: 500.',
    epic: 'CONSTRAINT: Elaborate multi-scene narrative. Dive into the deep lore and internal monologue. Max word count: 800.'
  };
  
  const formatRequirements = {
    comic: 'Generate EXACTLY 4 comic panels that follow this arc: Beat 1: The Lie is Told (confidence), Beat 2: The First Crack (suspicion appears), Beat 3: The Close Call (almost caught), Beat 4: The Escape or Twist (liar wins/loses).',
    whatsapp: 'Generate EXACTLY 8 alternating messages and narrator beats in JSON format.',
    text: 'Generate a single narrative string of EXACTLY 250-350 words with occasionally unhinged dialogue.'
  };

  return `
Classify this lie silently (cover_story, brag, excuse, romantic, identity, financial) and use that to frame your tone.
Infer the suspicion level of the victim (${victim}) - are they trusting or sharp? Adjust the drama accordingly.
INVENT 3 specific fake details (a date, a place, a named person) and use them consistently in both the article and the formatted output.

Tone Style: ${toneDescriptions[tone] || toneDescriptions.deadpan}
Length: ${lengthConstraints[length] || lengthConstraints.quick}
Format Instruction: ${formatRequirements[format] || formatRequirements.text}

Liar: ${liarName} | Victim: ${victim} | The Lie: "${lie}"

Write a Wikipedia-style article treating this massive lie as absolute documented fact (use [1][2] citation markers).
Also generate the ${format} output as described, keeping dialogues punchy and funny.

Respond ONLY in this exact JSON format (no markdown fences, no preamble):

{
  "article_title": "Absurd but encyclopedic title treating the lie as real history",
  "infobox_emoji": "one thematic emoji",
  "infobox": [{"k":"Date","v":"..."},{"k":"Location","v":"..."},{"k":"Witness","v":"..."},{"k":"Outcome","v":"..."}],
  "lead_paragraph": "A hooking opening paragraph with [1] citations",
  "lie_rating": {
    "score": 8,
    "roast": "One brutal, sarcastic, unhinged one-liner roasting the quality of this lie."
  },
  "sections": [
    {"heading":"Background","content":"2 sentences with [2] citations"},
    {"heading":"The Incident","content":"2 sentences with [3] citations"}
  ],
  "format_output": [/* formatted output for ${format}. For comic, strictly 4 objects with: {"panel_num":1, "narrator":"scene info", "dialogues":[{"speaker":"name","side":"left/right","text":"..."}], "reaction":"KABOOM!"} */],
  "see_also": ["Hilarious fake article 1", "Fake article 2"],
  "references": ["Sarcastic academic reference 1", "Reference 2"]
}`;
}

function validateInput(data) {
  const requiredFields = ['liarName', 'victim', 'lie', 'tone', 'length', 'format', 'modelId'];
  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
      return { isValid: false, message: `Missing or empty required field: ${field}`, field: field };
    }
  }
  return {
    isValid: true,
    data: {
      liarName: data.liarName.trim(),
      victim: data.victim.trim(),
      lie: data.lie.trim(),
      tone: data.tone,
      length: data.length,
      format: data.format,
      modelId: data.modelId
    }
  };
}
  
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Weliepedia backend server running on ${HOST}:${PORT}`);
  console.log('API endpoint: POST /api/article');
  console.log('Stats: GET /api/stats');
});

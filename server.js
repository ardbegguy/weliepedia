/**
 * Weliepedia Backend Server
 * 
 * This Express server handles the article generation endpoint by calling the Groq API
 * with the appropriate model and parameters. It validates inputs, processes responses,
 * and returns structured JSON for the frontend.
 * 
 * Features:
 * - Input validation
 * - Groq API integration
 * - Error handling
 * - Production-ready logging
 * - Environment configuration
 */

// Import required modules
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const axios = require('axios');

// Create Express application
const app = express();

// Middleware configuration
app.use(express.json({ limit: '10kb' })); // Limit request body size
app.use((req, res, next) => {
  // Add security headers for production
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
// ADD CORS MIDDLEWARE HERE (BELOW THIS LINE)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
  });
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ADD THIS NEW ROUTE - FIXES THE "CANNOT GET" ERROR
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Weliepedia Backend API',
    endpoints: {
      health: '/health',
      generate: '/api/article'
    }
  });
});

/**
 * POST /api/article
 * 
 * Generates a creative article about a lie using the Groq API
 * 
 * @param {Object} req.body - Request payload containing:
 *   @param {string} liarName - Name of the person telling the lie
 *   @param {string} victim - Name of the person being lied to
 *   @param {string} lie - The lie being told
 *   @param {string} tone - Desired tone (deadpan, melodrama, etc.)
 *   @param {string} length - Length of the response (quick, full, epic)
 *   @param {string} format - Output format (comic, whatsapp, text)
 *   @param {string} modelId - ID of the Groq model to use
 * 
 * @returns {Object} JSON response with:
 *   @param {string} article - Generated article content
 *   @param {string} format - Requested format
 *   @param {string} tone - Requested tone
 *   @param {string} model - Model used for generation
 *   @param {boolean} success - Whether the operation was successful
 *   @param {string} [error] - Error message if success is false
 */
app.post('/api/article', async (req, res) => {
  // Validate input parameters
  const validation = validateInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: validation.message,
      field: validation.field
    });
  }

  try {
    // Extract validated parameters
    const { liarName, victim, lie, tone, length, format, modelId } = validation.data;
    
    // Map the frontend model ID to Groq's API model ID
    const modelMapping = {
      'llama3-70b': 'llama-3.3-70b-versatile',
      'mistral': 'mixtral-8x7b-32768',
      'qwen3': 'qwen/qwen3-32b',
      'gpt-oss': 'openai/gpt-oss-20b',
      'llama3-8b': 'llama-3.1-8b-instant',
      'kimi': 'moonshotai/kimi-k2-instruct-0905'
    };
    
    const groqModel = modelMapping[modelId];
    if (!groqModel) {
      return res.status(400).json({
        success: false,
        error: `Invalid model ID: ${modelId}`,
        field: 'modelId'
      });
    }

    // Create the prompt for the Groq API
    const prompt = createPrompt({
      liarName,
      victim,
      lie,
      tone,
      length,
      format
    });

    // Call the Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: groqModel,
        messages: [
          {
            role: 'system',
            content: 'You are the AI editor of Weliepedia — a comedy encyclopedia documenting lies as if they were real history.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract and validate the response
    const apiResponse = response.data;
    if (!apiResponse.choices || !apiResponse.choices[0]?.message?.content) {
      throw new Error('Invalid API response structure');
    }

    const articleContent = apiResponse.choices[0].message.content;
    
    // Return success response
    res.status(200).json({
      success: true,
      article: articleContent,
      format,
      tone,
      model: modelId
    });
    
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // Groq API error
      const errorCode = error.response.status;
      const errorMessage = error.response.data.error?.message || 'Groq API error';
      
      console.error(`Groq API error [${errorCode}]: ${errorMessage}`);
      
      return res.status(errorCode).json({
        success: false,
        error: `API service error: ${errorMessage}`,
        code: errorCode
      });
    } else if (error.message === 'Invalid API response structure') {
      console.error('Invalid response structure from Groq API');
      return res.status(502).json({
        success: false,
        error: 'Invalid response from AI service. Please try again.',
        code: 'API_RESPONSE_INVALID'
      });
    } else {
      // General error
      console.error('Server error:', error.message);
      return res.status(500).json({
        success: false,
        error: 'Internal server error. Please try again later.',
        code: 'SERVER_ERROR'
      });
    }
  }
});

/**
 * Creates the prompt for the Groq API based on input parameters
 * 
 * @param {Object} params - Input parameters
 * @returns {string} Formatted prompt string
 */
function createPrompt({ liarName, victim, lie, tone, length, format }) {
  // Define tone descriptions
  const toneDescriptions = {
    deadpan: 'Write in a completely flat, matter-of-fact tone as if describing mundane facts.',
    melodrama: 'Write with extreme emotional exaggeration, lots of dramatic flourishes and overwrought language.',
    sarcasm: 'Write with heavy sarcasm and ironic commentary throughout.',
    gaslighting: 'Write in a way that subtly makes the lie seem so normal and reasonable that the reader questions their own memory.',
    thriller: 'Write with suspenseful, tense language as if this were a crime thriller.',
    horror: 'Write with eerie, unsettling tone and gothic elements suggesting something sinister.'
  };
  
  // Define length constraints
  const lengthConstraints = {
    quick: 'CONSTRAINT: Maximum 2-3 paragraphs total. Lead paragraph max 2 sentences. Total word count: 150-200 words maximum.',
    full: 'CONSTRAINT: Exactly 3-4 detailed sections with rich context. Total word count: 500-700 words.',
    epic: 'CONSTRAINT: Elaborate multi-scene narrative with vivid sensory details. Total word count: 900-1200 words.'
  };
  
  // Define format requirements
  const formatRequirements = {
    comic: 'Generate EXACTLY 4 comic panels with narrator descriptions and dialogues in JSON format.',
    whatsapp: 'Generate EXACTLY 8 alternating messages and narrator beats in JSON format.',
    text: 'Generate a single narrative string of EXACTLY 250-350 words with occasional dialogue.'
  };

  return `You are the AI editor of Weliepedia — a comedy encyclopedia documenting lies as if they were real history.

Tone: ${toneDescriptions[tone] || toneDescriptions.deadpan}
Length: ${lengthConstraints[length] || lengthConstraints.quick}
Format: ${formatRequirements[format] || formatRequirements.text}

Liar: ${liarName} | Victim: ${victim} | Lie: "${lie}"

Write a Wikipedia-style article treating this lie as documented fact (use [1][2] citation markers). 
Also generate the ${format} output as described above.

Respond ONLY in this exact JSON format (no markdown, no preamble):

{
  "article_title": "encyclopedic title treating the lie as real documented history",
  "infobox_emoji": "one emoji",
  "infobox": [{"k":"Date","v":"..."},{"k":"Location","v":"..."}],
  "lead_paragraph": "authoritative opening paragraph with [1][2] citations",
  "sections": [
    {"heading":"Background","content":"2-3 sentences with [3] citations"},
    {"heading":"The Incident","content":"2-3 sentences with [4][5] citations"}
  ],
  "format_output": [/* formatted output matching the ${format} requirement */],
  "see_also": ["Funny fake article 1","Fake article 2"],
  "references": ["Academic-sounding but subtly absurd ref 1","Ref 2"]
}`;
}
/**
 * Validates input parameters for the /api/article endpoint
 * 
 * @param {Object} data - Input data to validate
 * @returns {Object} - { isValid, message, field, data }
 */
function validateInput(data) {
    // Required fields
    const requiredFields = ['liarName', 'victim', 'lie', 'tone', 'length', 'format', 'modelId'];
    
    // Check for missing fields
    for (const field of requiredFields) {
      if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
        return {
          isValid: false,
          message: `Missing or empty required field: ${field}`,
          field: field
        };
      }
    }
    
    // Validate tone
    const validTones = ['deadpan', 'melodrama', 'sarcasm', 'gaslighting', 'thriller', 'horror'];
    if (!validTones.includes(data.tone)) {
      return {
        isValid: false,
        message: `Invalid tone. Must be one of: ${validTones.join(', ')}`,
        field: 'tone'
      };
    }
    
    // Validate length
    const validLengths = ['quick', 'full', 'epic'];
    if (!validLengths.includes(data.length)) {
      return {
        isValid: false,
        message: `Invalid length. Must be one of: ${validLengths.join(', ')}`,
        field: 'length'
      };
    }
    
    // Validate format
    const validFormats = ['comic', 'whatsapp', 'text'];
    if (!validFormats.includes(data.format)) {
      return {
        isValid: false,
        message: `Invalid format. Must be one of: ${validFormats.join(', ')}`,
        field: 'format'
      };
    }
    
    // Validate modelId
    const validModels = ['llama3-70b', 'mistral', 'qwen3', 'gpt-oss', 'llama3-8b', 'kimi'];
    if (!validModels.includes(data.modelId)) {
      return {
        isValid: false,
        message: `Invalid model. Must be one of: ${validModels.join(', ')}`,
        field: 'modelId'
      };
    }
    
    // Return validated data
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
  
// Start the server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Weliepedia backend server running on ${HOST}:${PORT}`);
  console.log('API endpoint: POST /api/article');
  console.log('Health check: GET /health');
});

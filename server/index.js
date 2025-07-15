const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Qwen API proxy endpoint
app.post('/api/qwen-proxy', async (req, res) => {
  try {
    const { messages, contextInfo, userMessage } = req.body;
    
    // Check if Qwen API key is configured
    const qwenApiKey = process.env.QWEN_API_KEY;
    if (!qwenApiKey) {
      return res.status(500).json({
        error: 'Qwen API key is not configured on the server. Please contact your administrator.'
      });
    }

    // Prepare the request payload for Qwen API
    const requestPayload = {
      model: 'qwen-plus',
      input: {
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant specialized in document analysis and OCR. You can analyze documents, extract information, and answer questions about their content. Provide helpful, accurate, and detailed responses based on the document context provided.'
          },
          {
            role: 'user',
            content: contextInfo ? `Context: ${contextInfo}\n\nQuestion: ${userMessage}` : userMessage
          }
        ]
      },
      parameters: {
        temperature: 0.7,
        max_tokens: 1500,
        result_format: 'message'
      }
    };

    console.log('Making request to Qwen API...');
    
    // Make request to Qwen API
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${qwenApiKey}`,
        'X-DashScope-SSE': 'disable'
      },
      body: JSON.stringify(requestPayload)
    });

    console.log('Qwen API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Qwen API error:', errorData);
      
      return res.status(response.status).json({
        error: `Qwen API error (${response.status}): ${errorData.message || 'Unknown error'}`,
        details: errorData
      });
    }

    const data = await response.json();
    console.log('Qwen API response received successfully');

    // Extract response content from Qwen API response
    if (data.output && data.output.choices && data.output.choices[0] && data.output.choices[0].message) {
      res.json({
        content: data.output.choices[0].message.content,
        usage: data.usage || null
      });
    } else {
      console.error('Invalid response format from Qwen API:', data);
      res.status(500).json({
        error: 'Invalid response format from Qwen API',
        details: data
      });
    }

  } catch (error) {
    console.error('Proxy server error:', error);
    
    // Handle specific error types
    if (error.code === 'ECONNRESET' || error.message.includes('Failed to fetch')) {
      res.status(503).json({
        error: 'Connection to Qwen API failed. This could be due to network issues or server problems. Please try again in a few moments.',
        type: 'connection_error'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error while processing your request',
        details: error.message
      });
    }
  }
});

// OpenAI API proxy endpoint (optional, for completeness)
app.post('/api/openai-proxy', async (req, res) => {
  try {
    const { messages, contextInfo, userMessage } = req.body;
    
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({
        error: 'OpenAI API key is not configured on the server. Please contact your administrator.'
      });
    }

    const requestPayload = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant specialized in document analysis. You can analyze documents, extract information, and answer questions about their content. Provide helpful, accurate, and detailed responses based on the document context provided.'
        },
        {
          role: 'user',
          content: contextInfo ? `Context: ${contextInfo}\n\nQuestion: ${userMessage}` : userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    };

    console.log('Making request to OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: `OpenAI API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`,
        details: errorData
      });
    }

    const data = await response.json();
    
    res.json({
      content: data.choices[0]?.message?.content || 'No response received from OpenAI',
      usage: data.usage || null
    });

  } catch (error) {
    console.error('OpenAI proxy error:', error);
    res.status(500).json({
      error: 'Internal server error while processing OpenAI request',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  GET  /health - Health check`);
  console.log(`  POST /api/qwen-proxy - Qwen API proxy`);
  console.log(`  POST /api/openai-proxy - OpenAI API proxy`);
});

module.exports = app;
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RequestBody {
  messages?: any[];
  contextInfo?: string;
  userMessage: string;
  engine: 'qwen' | 'openai';
  apiKey?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contextInfo, userMessage, engine, apiKey }: RequestBody = await req.json()

    if (engine === 'qwen') {
      // Use provided API key or fall back to environment variable
      const qwenApiKey = apiKey || Deno.env.get('QWEN_API_KEY')
      if (!qwenApiKey) {
        return new Response(
          JSON.stringify({
            error: 'Qwen API key is not configured. Please add your API key in Settings.'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
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
      }

      console.log('Making request to Qwen API...')
      
      // Make request to Qwen API
      const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${qwenApiKey}`,
          'X-DashScope-SSE': 'disable'
        },
        body: JSON.stringify(requestPayload)
      })

      console.log('Qwen API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Qwen API error:', errorData)
        
        return new Response(
          JSON.stringify({
            error: `Qwen API error (${response.status}): ${errorData.message || 'Unknown error'}`,
            details: errorData
          }),
          {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const data = await response.json()
      console.log('Qwen API response received successfully')

      // Extract response content from Qwen API response
      if (data.output && data.output.choices && data.output.choices[0] && data.output.choices[0].message) {
        return new Response(
          JSON.stringify({
            content: data.output.choices[0].message.content,
            usage: data.usage || null
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      } else {
        console.error('Invalid response format from Qwen API:', data)
        return new Response(
          JSON.stringify({
            error: 'Invalid response format from Qwen API',
            details: data
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

    } else if (engine === 'openai') {
      // Use provided API key or fall back to environment variable
      const openaiApiKey = apiKey || Deno.env.get('OPENAI_API_KEY')
      if (!openaiApiKey) {
        return new Response(
          JSON.stringify({
            error: 'OpenAI API key is not configured. Please add your API key in Settings.'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
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
      }

      console.log('Making request to OpenAI API...')

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify(requestPayload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return new Response(
          JSON.stringify({
            error: `OpenAI API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`,
            details: errorData
          }),
          {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const data = await response.json()
      
      return new Response(
        JSON.stringify({
          content: data.choices[0]?.message?.content || 'No response received from OpenAI',
          usage: data.usage || null
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )

    } else {
      return new Response(
        JSON.stringify({
          error: 'Unsupported AI engine. Please use "qwen" or "openai".'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Edge function error:', error)
    
    // Handle specific error types
    if (error.message.includes('Failed to fetch')) {
      return new Response(
        JSON.stringify({
          error: 'Connection to AI API failed. This could be due to network issues or server problems. Please try again in a few moments.',
          type: 'connection_error'
        }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      return new Response(
        JSON.stringify({
          error: 'Internal server error while processing your request',
          details: error.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
  }
})
# DocIntel Proxy Server

This is a Node.js proxy server that handles API requests to external AI services (Qwen, OpenAI) on behalf of the DocIntel frontend application.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your actual API keys:
   ```
   QWEN_API_KEY=your_actual_qwen_api_key_here
   OPENAI_API_KEY=your_actual_openai_api_key_here
   PORT=3001
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:3001`

## Development

For development, you can run:
```bash
npm run dev
```

## Endpoints

- `GET /health` - Health check endpoint
- `POST /api/qwen-proxy` - Proxy requests to Qwen API
- `POST /api/openai-proxy` - Proxy requests to OpenAI API

## Security Notes

- API keys are stored securely on the server side
- CORS is enabled for development (configure appropriately for production)
- All requests are logged for debugging purposes

## Deployment

For production deployment:

1. Ensure environment variables are properly configured on your hosting platform
2. Consider implementing rate limiting and authentication
3. Configure CORS settings for your production domain
4. Set up proper logging and monitoring
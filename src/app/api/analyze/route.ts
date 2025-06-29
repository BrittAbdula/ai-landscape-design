import { NextResponse } from 'next/server';

interface AnalysisRequest {
  imageUrl: string;
}

interface AnalysisResult {
  spaceType: string;
  size: string;
  existingFeatures: string[];
  lighting: string;
  soilType: string;
  climate: string;
  challenges: string[];
  opportunities: string[];
  recommendations: string[];
}

interface Annotation {
  type: string;
  text?: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface Message {
  content: string;
  role: string;
  refusal?: string;
  annotations?: Annotation[];
  [property: string]: string | number | boolean | null | undefined | Annotation[];
}

interface Choice {
  finish_reason?: string;
  index?: number;
  message?: Message;
  logprobs?: null;
  [property: string]: string | number | boolean | null | undefined | Message;
}

interface TokenDetails {
  cached_tokens?: number;
  audio_tokens?: number;
  reasoning_tokens?: number;
  accepted_prediction_tokens?: number;
  rejected_prediction_tokens?: number;
}

interface Usage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
  prompt_tokens_details?: TokenDetails;
  completion_tokens_details?: TokenDetails;
  [property: string]: string | number | boolean | null | undefined | TokenDetails;
}

interface OpenAIResponse {
  choices: Choice[];
  created: number;
  id: string;
  object: string;
  usage: Usage;
  model?: string;
  system_fingerprint?: string;
  [property: string]: string | number | boolean | null | undefined | Choice[] | Usage;
}

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json() as AnalysisRequest;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'https://api.openai.com';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Build analysis prompt
    const analysisPrompt = `Please analyze this yard/landscape image and return the analysis in JSON format. Use the following format:

{
  "spaceType": "Space type (e.g., front yard, backyard, patio, garden)",
  "size": "Estimated space size",
  "existingFeatures": ["List of existing landscape elements"],
  "lighting": "Lighting conditions description",
  "soilType": "Soil type estimation",
  "climate": "Climate conditions estimation",
  "challenges": ["Design challenges"],
  "opportunities": ["Design opportunities"],
  "recommendations": ["Initial suggestions"]
}

Please analyze in detail:
1. Space structure and layout
2. Existing plants and hardscape
3. Light and environmental conditions
4. Design potential and limitations
5. Improvement suggestions

IMPORTANT: Return ONLY the JSON object, no additional text.`;

    console.log('Calling OpenAI API with image URL:', imageUrl);

    // Call OpenAI API
    const response = await fetch(`${apiBaseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { 
          error: 'Analysis failed',
          details: error.error?.message || 'Unknown error',
          code: error.error?.code || response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json() as OpenAIResponse;
    console.log('OpenAI API response:', JSON.stringify(data, null, 2));
    
    const firstChoice = data.choices?.[0];
    if (!firstChoice?.message) {
      console.error('Invalid API response structure:', JSON.stringify(data, null, 2));
      return NextResponse.json(
        { 
          error: 'Invalid API response',
          details: 'Response does not contain expected content',
          response: data
        },
        { status: 500 }
      );
    }

    // Check for refusal message
    if (firstChoice.message.refusal) {
      console.log('Image analysis refused:', firstChoice.message.refusal);
      return NextResponse.json(
        {
          error: 'Analysis refused',
          details: firstChoice.message.refusal,
          response: data
        },
        { status: 422 }
      );
    }

    const content = firstChoice.message.content.trim();
    if (!content) {
      console.error('Empty content in API response:', JSON.stringify(data, null, 2));
      return NextResponse.json(
        {
          error: 'Empty analysis result',
          details: 'The API returned an empty content',
          response: data
        },
        { status: 422 }
      );
    }

    console.log('API response content:', content);
    
    try {
      // Try to parse the content as JSON
      try {
        const analysisResult = JSON.parse(content) as AnalysisResult;
        console.log('Successfully parsed analysis result:', JSON.stringify(analysisResult, null, 2));
        return NextResponse.json(analysisResult);
      } catch (parseError) {
        // If direct parsing fails, try to extract JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisResult = JSON.parse(jsonMatch[0]) as AnalysisResult;
          console.log('Successfully parsed extracted JSON:', JSON.stringify(analysisResult, null, 2));
          return NextResponse.json(analysisResult);
        }
        throw parseError; // Re-throw if no JSON found
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed content:', content);
      return NextResponse.json(
        { 
          error: 'Failed to parse analysis result',
          details: parseError instanceof Error ? parseError.message : 'Unknown parse error',
          content: content // Include the raw content for debugging
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
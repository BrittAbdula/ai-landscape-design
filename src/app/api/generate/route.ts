import { NextResponse } from 'next/server';

interface GenerateRequest {
  analysisResult: {
    spaceType: string;
    size: string;
    existingFeatures: string[];
    lighting: string;
    soilType: string;
    climate: string;
    challenges: string[];
    opportunities: string[];
    recommendations: string[];
  };
  style: string;
}

interface Message {
  content: string;
  role: string;
  refusal?: string;
  annotations?: {
    type: string;
    text?: string;
    [key: string]: string | number | boolean | null | undefined;
  }[];
  [property: string]: string | number | boolean | null | undefined | {
    type: string;
    text?: string;
    [key: string]: string | number | boolean | null | undefined;
  }[];
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
    const { analysisResult, style } = await request.json() as GenerateRequest;

    if (!analysisResult || !style) {
      return NextResponse.json(
        { error: 'Missing analysis result or style' },
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

    // Build generation prompt
    const generatePrompt = `Based on the following analysis and style preference, generate a photorealistic landscape design image.

Space Analysis:
- Type: ${analysisResult.spaceType}
- Size: ${analysisResult.size}
- Existing Features: ${analysisResult.existingFeatures.join(', ')}
- Lighting: ${analysisResult.lighting}
- Soil Type: ${analysisResult.soilType}
- Climate: ${analysisResult.climate}

Key Considerations:
- Challenges: ${analysisResult.challenges.join(', ')}
- Opportunities: ${analysisResult.opportunities.join(', ')}
- Initial Recommendations: ${analysisResult.recommendations.join(', ')}

Desired Style: ${style}

Please generate a photorealistic image that:
1. Maintains the basic space structure
2. Incorporates the desired style elements
3. Addresses the identified challenges
4. Maximizes the opportunities
5. Follows the initial recommendations
6. Ensures practical and maintainable design
7. Creates visual harmony and balance

The image should be high-quality, detailed, and realistic.`;

    console.log('Calling OpenAI API for design generation');
    const testResult = {
        "imageUrl" : "https://midjourney-plus.oss-us-west-1.aliyuncs.com/sora/e69d8a7d-6bf8-48e1-8e96-585c0c8752d8.png"
    }
    return NextResponse.json(testResult);
    // Call OpenAI API
    const response = await fetch(`${apiBaseUrl}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: generatePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'low',
        style: 'natural',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { 
          error: 'Generation failed',
          details: error.error?.message || 'Unknown error',
          code: error.error?.code || response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('OpenAI API response:', JSON.stringify(data, null, 2));
    
    if (!data.data?.[0]?.url) {
      console.error('Invalid API response structure:', JSON.stringify(data, null, 2));
      return NextResponse.json(
        { 
          error: 'Invalid API response',
          details: 'Response does not contain image URL',
          response: data
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl: data.data[0].url });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        error: 'Generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
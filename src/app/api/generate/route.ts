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
    const body = await request.json();
    const { analysisResult, style, customPrompt, imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Missing imageUrl' },
        { status: 400 }
      );
    }

    // If customPrompt is provided, use it directly
    let generatePrompt: string;
    if (customPrompt) {
      generatePrompt = customPrompt;
    } else {
      if (!analysisResult || !style) {
        return NextResponse.json(
          { error: 'Missing analysis result or style' },
          { status: 400 }
        );
      }
      // Build generation prompt
      generatePrompt = `Reimagine this outdoor space in a ${style} landscape aesthetic.\nKeep the original background, perspective, layout, and object scale unchanged.\nEnhance the scene with appropriate landscaping elements, vegetation, surfaces, and accessories that reflect the selected style.\nDo not remove or alter existing major features—only build upon them.\nThe result should feel realistic, detailed, and seamlessly integrated into the original photo.`;
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

    // Build OpenAI chat/completions payload
    const chatPayload = {
      model: 'gpt-4o-image',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: generatePrompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      stream: false
    };

    // Call OpenAI API
    const response = await fetch(`${apiBaseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(chatPayload),
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

    // Extract image URL or result from the response as needed
    // (Assume the response contains the result in choices[0].message.content)
    const resultContent = data.choices?.[0]?.message?.content;

    return NextResponse.json({ result: resultContent, raw: data });
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
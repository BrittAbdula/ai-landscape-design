import { NextResponse } from 'next/server';

interface GenerationRequest {
  imageUrl: string;
  style: string;
  customDescription?: string;
}

interface GenerationResult {
  imageUrl: string;
}

export async function POST(request: Request) {
  try {
    const { imageUrl, style, customDescription } = await request.json() as GenerationRequest;

    if (!imageUrl || !style) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 检查API密钥
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'https://api.openai.com';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // 构建生成提示词
    let generationPrompt = `请根据以下风格改造这个庭院/景观空间：${style}。`;
    
    if (customDescription) {
      generationPrompt += `\n\n用户的具体要求：${customDescription}`;
    }

    generationPrompt += `\n\n请注意：
1. 保持空间的基本结构和功能性
2. 确保设计符合所选风格的特点
3. 考虑现有条件和限制
4. 注重细节和美感
5. 保持设计的可实现性`;

    // 调用OpenAI API
    const response = await fetch(`${apiBaseUrl}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-image',
        prompt: generationPrompt,
        image: imageUrl,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Generation failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0 || !data.data[0].url) {
      return NextResponse.json(
        { error: 'Invalid API response' },
        { status: 500 }
      );
    }

    const result: GenerationResult = {
      imageUrl: data.data[0].url,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
} 
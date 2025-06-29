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

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json() as AnalysisRequest;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
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

    // 构建分析提示词
    const analysisPrompt = `请分析这张庭院/景观图片，并以JSON格式返回分析结果。请按照以下格式回答：

{
  "spaceType": "空间类型（如：前院、后院、阳台、庭院等）",
  "size": "空间大小估算",
  "existingFeatures": ["现有的景观元素"],
  "lighting": "光照条件描述",
  "soilType": "土壤类型推测",
  "climate": "气候条件推测",
  "challenges": ["设计挑战点"],
  "opportunities": ["设计机会点"],
  "recommendations": ["初步建议"]
}

请详细分析图片中的：
1. 空间结构和布局
2. 现有植物和硬质景观
3. 光照和环境条件
4. 设计的潜力和限制
5. 改进建议`;

    // 调用OpenAI API
    const response = await fetch(`${apiBaseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Analysis failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json(
        { error: 'Invalid API response' },
        { status: 500 }
      );
    }

    const content = data.choices[0].message.content;
    
    try {
      // 尝试解析JSON响应
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0]) as AnalysisResult;
        return NextResponse.json(analysisResult);
      }
      
      // 如果没有找到JSON格式，返回错误
      return NextResponse.json(
        { error: 'Failed to parse analysis result' },
        { status: 500 }
      );
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse analysis result' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
} 
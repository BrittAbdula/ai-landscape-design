# AI Landscape Design

这是一个基于AI的景观设计应用，用户可以上传庭院照片，AI会分析空间特征并推荐多种设计风格。

## 功能特点

- 📸 **图片上传**: 支持拖拽上传庭院照片
- 🤖 **AI分析**: 智能分析空间特征、光照条件、现有元素
- 🎨 **风格推荐**: 提供多种设计风格选择（现代简约、英式花园、禅意日式等）
- ✍️ **自定义描述**: 支持用户输入自定义设计需求
- 🖼️ **设计生成**: 基于选择的风格生成多种设计方案
- 📱 **响应式设计**: 支持桌面和移动端

## 技术栈

- **前端**: Next.js 14, TypeScript, Tailwind CSS
- **UI组件**: Radix UI, Lucide Icons
- **图片分析**: OpenAI GPT-4o API (支持图像识别)

## 环境配置

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd ai-landscape-design
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 配置环境变量
创建 `.env.local` 文件并添加以下配置：

```env
# API配置
NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_API_BASE_URL=https://api.openai.com

# Cloudinary配置（推荐 - 用于图片托管）
CLOUDINARY_CLOUD_NAME=do5aznp5j
CLOUDINARY_API_KEY=684536141748315
CLOUDINARY_API_SECRET=ZtadW68Y7p00KFu-X3pT3uczrXg
CLOUDINARY_UPLOAD_PRESET=trymyroom-preset
```

**配置说明**:

**AI分析API配置**:
- `NEXT_PUBLIC_OPENAI_API_KEY`: 您的OpenAI API密钥或其他兼容服务的API密钥
- `NEXT_PUBLIC_API_BASE_URL`: API服务的基础URL
- 确保使用的模型支持图像分析功能（如GPT-4o）

**Cloudinary配置（推荐）**:
- `CLOUDINARY_CLOUD_NAME`: 您的Cloudinary云名称
- `CLOUDINARY_API_KEY`: Cloudinary API密钥
- `CLOUDINARY_API_SECRET`: Cloudinary API密钥
- `CLOUDINARY_UPLOAD_PRESET`: 上传预设名称

**为什么推荐使用Cloudinary?**
- **解决base64编码问题**: 避免"illegal base64 data"错误
- **提高API调用成功率**: 使用公开URL而非base64编码
- **更好的性能**: 减少数据传输量
- **全球CDN**: 更快的图片加载速度
- **图片优化**: 自动格式转换和压缩
- **变换功能**: 支持实时图片裁剪、缩放等

**获取Cloudinary配置**:
1. 注册或登录 [Cloudinary Dashboard](https://cloudinary.com/console)
2. 在Dashboard首页找到Cloud Name、API Key和API Secret
3. 创建Upload Preset：
   - 进入Settings → Upload
   - 点击"Add upload preset"
   - 设置Signing Mode为"Unsigned"
   - 记录preset名称

**注意**: 如果没有配置Cloudinary，应用仍然可以正常运行，但可能遇到某些API兼容性问题

### 4. 启动开发服务器

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用流程

1. **上传图片**: 在首页点击"Get Started"，然后上传您的庭院照片
   - 支持拖拽上传或点击选择
   - 自动上传到Cloudinary（如果配置）
   - 显示上传状态和错误信息
2. **AI分析**: 系统会自动分析您的空间特征
   - 使用云端图片URL进行分析（推荐）
   - 或使用本地文件作为备选方案
3. **查看分析结果**: 查看AI对您空间的详细分析
4. **选择风格**: 从推荐的设计风格中选择，或输入自定义需求
5. **生成设计**: 系统基于您的选择生成多种设计方案
6. **查看结果**: 使用交互式滑块对比前后效果

## 图片处理流程

1. **用户上传** → 2. **Cloudinary托管** → 3. **获取公开URL** → 4. **AI分析**

这种方式解决了base64编码问题，提高了API调用的成功率。

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页面和状态管理
│   ├── layout.tsx         # 布局组件
│   └── globals.css        # 全局样式
├── components/            # React组件
│   ├── FileUpload.tsx     # 文件上传组件
│   ├── AILoadingAnimation.tsx  # AI分析动画
│   ├── StyleSelection.tsx  # 风格选择组件
│   ├── AIResults.tsx      # 结果展示组件
│   └── ui/               # UI基础组件
└── lib/
    ├── api.ts            # API服务
    └── utils.ts          # 工具函数
```

## API集成

应用支持集成OpenAI GPT-4o或其他兼容的图像分析API。API调用格式遵循OpenAI Chat Completions规范：

```typescript
// 示例API调用
const response = await fetch('/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: [{
        type: 'text',
        text: '分析这张庭院图片...'
      }, {
        type: 'image_url',
        image_url: { url: imageUrl }
      }]
    }],
    max_tokens: 1000
  })
});
```

## 开发说明

- 使用TypeScript确保类型安全
- 采用Tailwind CSS进行样式管理
- 组件化设计，便于维护和扩展
- 支持响应式布局
- 错误处理和降级方案

## 部署

推荐使用Vercel部署：

1. 推送代码到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量
4. 自动部署完成

## 许可证

MIT License - 详见LICENSE文件

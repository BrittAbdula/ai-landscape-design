"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Upload, Sparkles, Camera, Palette, Star, Check, ArrowRight, Leaf, Zap, RefreshCw, Menu } from "lucide-react";

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

// Import our new interactive components
import FileUpload from "@/components/FileUpload";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import AILoadingAnimation from "@/components/AILoadingAnimation";
import AIResults from "@/components/AIResults";
import StyleSelection from "@/components/StyleSelection";
import DesignGenerationAnimation from "@/components/DesignGenerationAnimation";

type AppState = 'home' | 'uploading' | 'analyzing' | 'style-selection' | 'results' | 'generating';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [appState, setAppState] = useState<AppState>('home');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [cloudinaryImageUrl, setCloudinaryImageUrl] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  
  const designStudioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appState === 'uploading' || appState === 'results' || appState === 'generating') {
      designStudioRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [appState]);

  const handleFileUpload = (file: File, cloudinaryUrl?: string) => {
    setUploadedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);
    
    if (cloudinaryUrl) {
      setCloudinaryImageUrl(cloudinaryUrl);
      console.log('Cloudinary image URL set:', cloudinaryUrl);
    }
  };

  const handleAnalysisStart = () => {
    setAppState('analyzing');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setAppState('style-selection');
  };

  const handleStyleSelected = (style: string, prompt?: string) => {
    setSelectedStyle(style);
    setCustomPrompt(prompt || '');
    setAppState('generating');
  };

  const handleBackToStyleSelection = () => {
    setAppState('style-selection');
  };

  const handleStartNew = () => {
    setAppState('home');
    setUploadedFile(null);
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedImageUrl('');
    setCloudinaryImageUrl('');
    setSelectedStyle('');
    setCustomPrompt('');
    setAnalysisResult(null);
    setGeneratedImageUrl('');
  };

  const handleGetStarted = () => {
    setAppState('uploading');
  };

  const handleReturnHome = () => {
    // Reset all state
    setAppState('home');
    setUploadedFile(null);
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedImageUrl('');
    setCloudinaryImageUrl('');
    setSelectedStyle('');
    setCustomPrompt('');
    setAnalysisResult(null);
    setGeneratedImageUrl('');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (href: string) => {
    // For external links that open in new tab, just open them
    window.open(href, '_blank');
    // Keep current page at top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const InteractiveDesigner = () => {
    if (appState === 'home') {
      return <BeforeAfterSlider showDemo={true} />;
    }

    if (appState === 'uploading') {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
              Upload Your Yard Photo
            </h1>
            <p className="text-lg font-body text-gray-600">
              Share a photo of your outdoor space and let our AI create stunning landscape designs for you.
            </p>
          </div>

          <FileUpload
            onFileUpload={handleFileUpload}
            onAnalysisStart={handleAnalysisStart}
          />
        </div>
      );
    }
  
    if (appState === 'analyzing') {
      return (
        <div className="max-w-2xl mx-auto">
          <AILoadingAnimation
            imageUrl={cloudinaryImageUrl}
            onAnalysisComplete={(result) => {
              setAnalysisResult(result);
              setAppState('style-selection');
            }}
            onError={(error) => {
              console.error('Analysis error:', error);
              // 可以在这里添加错误处理UI
              setAppState('style-selection');
            }}
          />
        </div>
      );
    }
  
    if (appState === 'style-selection') {
      return (
        <div className="max-w-7xl mx-auto">
          <StyleSelection
            uploadedImage={cloudinaryImageUrl}
            analysisResult={analysisResult || undefined}
            onStyleSelected={handleStyleSelected}
            onBack={handleStartNew}
          />
        </div>
      );
    }
  
    if (appState === 'generating') {
      return (
        <div className="max-w-7xl mx-auto">
          <div className="text-right mb-4">
            <Button
              variant="ghost"
              onClick={handleBackToStyleSelection}
              className="text-gray-600 hover:text-green-600"
            >
              ← Back to Style Selection
            </Button>
          </div>
          <DesignGenerationAnimation
            analysisResult={analysisResult!}
            originalImageUrl={cloudinaryImageUrl}
            style={selectedStyle}
            customPrompt={customPrompt}
            onGenerationComplete={(result) => {
              setGeneratedImageUrl(result.imageUrl);
              setAppState('results');
            }}
            onError={(error) => {
              console.error('Generation error:', error);
              // TODO: Show error message to user
              setAppState('style-selection');
            }}
          />
        </div>
      );
    }
  
    if (appState === 'results') {
      return (
        <div className="max-w-7xl mx-auto">
          <AIResults
            uploadedImage={cloudinaryImageUrl}
            generatedImage={generatedImageUrl}
            onStartNew={() => setAppState('uploading')}
          />
        </div>
      );
    }

    return null;
  }

  // Default home state
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 h-16 flex items-center border-b border-green-100 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleReturnHome}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            >
              <img src="/ailandscapedesignlogo.png" alt="AI Landscape Design Logo" className="w-10 h-10 object-contain mr-2" />
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-green-700 to-blue-600 bg-clip-text text-transparent">
                AI Landscape Design
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              onClick={(e) => handleAnchorClick(e, 'features')}
              className="text-gray-600 hover:text-green-600 font-body transition-colors cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleAnchorClick(e, 'how-it-works')}
              className="text-gray-600 hover:text-green-600 font-body transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleAnchorClick(e, 'pricing')}
              className="text-gray-600 hover:text-green-600 font-body transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white hover-lift">
              Sign In
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col space-y-4 mt-8">
                <a 
                  href="#features" 
                  onClick={(e) => {
                    handleAnchorClick(e, 'features');
                    setIsMenuOpen(false);
                  }}
                  className="text-lg font-body text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => {
                    handleAnchorClick(e, 'how-it-works');
                    setIsMenuOpen(false);
                  }}
                  className="text-lg font-body text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
                >
                  How It Works
                </a>
                <a 
                  href="#pricing" 
                  onClick={(e) => {
                    handleAnchorClick(e, 'pricing');
                    setIsMenuOpen(false);
                  }}
                  className="text-lg font-body text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
                >
                  Pricing
                </a>
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white mt-4">
                  Sign In
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-gray-900 mb-6 leading-tight">
              AI Landscape Design
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl font-body text-gray-600 mb-8 leading-relaxed">
              Upload a photo and watch our AI transform your space into multiple professional landscape design solutions. No design experience needed.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl hover-lift hover-glow transition-all duration-300 transform hover:scale-105 border border-green-500/20"
            >
              <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Upload Photo, Start Free Design
            </Button>
          </div>

          {/* Interactive Before/After Demo */}
          <div id="design-studio" ref={designStudioRef} className="mt-12 sm:mt-16 scroll-mt-20">
            <InteractiveDesigner />
          </div>
        </div>
      </section>

      {/* Design Showcase */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">Stunning AI-Generated Designs</h2>
            <p className="text-lg sm:text-xl font-body text-gray-600">Discover the endless possibilities for your outdoor space</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: "Modern Zen Garden", style: "Contemporary minimalism with water features", image: "https://imagedelivery.net/DEOVdDdfeGzASe0KdtD7FA/11d4ff66-c992-45b9-71f6-2804e6cb2c00/public" },
              { title: "Romantic Flower Paradise", style: "Cottage garden with stone pathways", image: "https://imagedelivery.net/DEOVdDdfeGzASe0KdtD7FA/5de3c5b7-a5ed-4cee-d273-982933621100/public" },
              { title: "Family Entertainment Hub", style: "Outdoor living with fire pit and seating", image: "https://imagedelivery.net/DEOVdDdfeGzASe0KdtD7FA/f612ae5e-63f1-49e1-2130-2765d44c8000/public" },
              { title: "Urban Rooftop Oasis", style: "City sanctuary with vertical gardens", image: "https://imagedelivery.net/DEOVdDdfeGzASe0KdtD7FA/e8627f93-e611-4c19-4b8c-e89bcfe88700/public" },
              { title: "Mediterranean Courtyard", style: "Tuscan-inspired with olive trees", image: "https://imagedelivery.net/DEOVdDdfeGzASe0KdtD7FA/ca9a12c2-5335-4473-18da-0a54018c5600/public" },
              { title: "Japanese Inspired Retreat", style: "Tranquil space with bamboo and stones", image: "https://imagedelivery.net/DEOVdDdfeGzASe0KdtD7FA/4aaf3964-f8d5-49c7-5ae4-dba3f5108200/public" }
            ].map((design) => (
              <Card key={design.title} className="overflow-hidden hover:shadow-lg hover-lift transition-all duration-300 group">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img src={design.image} alt={design.title + ' example'} className="object-cover w-full h-full" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">{design.title}</CardTitle>
                  <CardDescription className="font-body">{design.style}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={handleGetStarted}
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white hover-lift"
            >
              Try It Now - Upload Your Photo
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl font-body text-gray-600">Transform your space in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-lift hover-glow transition-all duration-300 shadow-lg border border-green-500/20">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 mb-4">1. Upload & Analyze</h3>
              <p className="font-body text-gray-600 mb-6 leading-relaxed">
                Simply upload a photo of your yard. Our AI instantly analyzes the space, identifying key features,
                lighting conditions, and design potential.
              </p>
              <div className="bg-green-50 p-4 rounded-lg hover-scale transition-transform duration-300">
                <p className="text-sm font-body text-green-800 font-medium">"Scanning your space... Identifying features... Evaluating potential..."</p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-lift hover-glow transition-all duration-300 shadow-lg border border-blue-500/20">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 mb-4">2. Choose Your Style</h3>
              <p className="font-body text-gray-600 mb-6 leading-relaxed">
                Our AI presents 3 personalized design directions based on your space. Choose from modern,
                romantic, zen, or describe your own vision.
              </p>
              <div className="space-y-2">
                {["Modern Oasis", "Romantic Garden", "Zen Retreat"].map((style) => (
                  <div key={style} className="bg-green-50 p-3 rounded-lg hover-scale transition-transform duration-300">
                    <p className="text-sm font-body text-green-800 font-medium">{style}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 via-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-lift hover-glow transition-all duration-300 shadow-lg border border-green-500/20">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 mb-4">3. Generate & Refine</h3>
              <p className="font-body text-gray-600 mb-6 leading-relaxed">
                Watch as AI creates multiple professional designs. Compare options, make adjustments,
                and download your perfect landscape plan.
              </p>
              <div className="flex justify-center space-x-2">
                {["♥️", "⬇️", "🔄"].map((icon) => (
                  <div key={icon} className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover-scale transition-transform duration-300 cursor-pointer">
                    <span className="text-lg">{icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg sm:text-xl font-body text-gray-600">Everything you need to design your dream landscape</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: <RefreshCw className="w-8 h-8" />,
                title: "Unlimited Style Exploration",
                description: "From modern minimalism to Japanese zen, switch between countless design styles instantly."
              },
              {
                icon: <Leaf className="w-8 h-8" />,
                title: "Smart Plant Recommendations",
                description: "AI suggests the perfect plants based on your location, climate, and lighting conditions."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Multiple Design Options",
                description: "Generate 3-5 different design variations simultaneously for easy comparison."
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: "Flexible Element Editing",
                description: "Don't like the water feature? Replace it with a seating area in one click."
              }
            ].map((feature) => (
              <Card key={feature.title} className="text-center hover:shadow-lg hover-lift transition-all duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-600 group-hover:scale-110 transition-transform duration-300 border border-green-200/50">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-body leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies: Real AI Landscape Design Transformations */}
      <section id="case-studies" className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
              Real AI Landscape Design Transformations
            </h2>
            <p className="text-lg sm:text-xl font-body text-gray-600">
              Discover how our AI landscape generator and backyard AI planner help homeowners and professionals create stunning outdoor spaces. Explore these case studies to see how you can transform your outdoor space with AI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Case Study 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="font-heading text-xl mb-2">Backyard Makeover with AI Garden Design</h3>
              <p className="font-body text-gray-700 mb-2">
                Location: California | Space: 80㎡ backyard
              </p>
              <p className="font-body text-gray-600 mb-4">
                The homeowner wanted a low-maintenance, modern garden. Using our AI landscape design free tool, they uploaded a photo and received three unique design options. The AI suggested drought-tolerant plants and a smart irrigation layout, perfectly suited for the local climate. This smart landscaping tool made it easy to visualize the transformation and select the best AI landscape design for their needs.
              </p>
              <img src="https://imagedelivery.net/DEOVdDdfeGzASe0KdtD7FA/5030df96-2c83-45ee-5f93-24971b75fe00/public" alt="AI garden design before and after" className="rounded mb-2" />
              <p className="font-body text-green-700">“The AI garden design was spot-on! I never imagined my backyard could look so good with so little effort.”</p>
            </div>
            {/* Case Study 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="font-heading text-xl mb-2">Transforming a Small Urban Space with AI Landscape Generator</h3>
              <p className="font-body text-gray-700 mb-2">
                Location: New York | Space: 30㎡ rooftop terrace
              </p>
              <p className="font-body text-gray-600 mb-4">
                This client used our AI landscape design free online platform to reimagine their rooftop. The AI for landscape design analyzed sunlight, wind exposure, and user preferences, generating multiple design options. The final plan included vertical gardens, modular seating, and low-maintenance plants, all tailored by the landscape design AI for urban living.
              </p>
              <img src="https://imagedelivery.net/DEOVdDdfeGzASe0KdtD7FA/7712366b-76d5-43d3-098f-d57f182eb700/public" alt="AI landscape design free online transformation" className="rounded mb-2" />
              <p className="font-body text-green-700">“The best AI landscape design tool I've tried—fast, creative, and easy to use!”</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg sm:text-xl font-body text-gray-600">Real transformations, real stories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "California",
                rating: 5,
                comment: "I uploaded a photo of my bland backyard and within minutes had 3 stunning design options. The AI understood exactly what would work with my space!"
              },
              {
                name: "Michael Chen",
                location: "New York",
                rating: 5,
                comment: "As someone with zero design experience, this tool was a game-changer. The plant recommendations were spot-on for my climate zone."
              },
              {
                name: "Emma Rodriguez",
                location: "Texas",
                rating: 5,
                comment: "The before and after transformation was incredible. My neighbors keep asking who my landscape designer was - it was AI!"
              }
            ].map((testimonial) => (
              <Card key={testimonial.name} className="hover:shadow-lg hover-lift transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={`star-${testimonial.name}-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg font-heading">{testimonial.name}</CardTitle>
                  <CardDescription className="font-body">{testimonial.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-gray-600 leading-relaxed">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg sm:text-xl font-body text-gray-600">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free Trial",
                price: "$0",
                period: "First design",
                features: ["1 photo upload", "3 design variations", "Basic plant suggestions", "Standard resolution"],
                cta: "Start Free Trial",
                popular: false
              },
              {
                name: "Pro",
                price: "$29",
                period: "per month",
                features: ["Unlimited uploads", "5 design variations per upload", "Smart plant recommendations", "High-resolution downloads", "Style customization", "Email support"],
                cta: "Go Pro",
                popular: true
              },
              {
                name: "Professional",
                price: "$99",
                period: "per month",
                features: ["Everything in Pro", "10 design variations per upload", "3D visualization", "Professional consultations", "Commercial license", "Priority support"],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan) => (
              <Card key={plan.name} className={`relative hover:shadow-lg hover-lift transition-all duration-300 ${plan.popular ? 'border-2 border-gradient-to-r from-green-600 to-blue-600 hover-glow bg-gradient-to-br from-green-50/50 to-blue-50/50' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-body border border-green-500/20">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-heading">{plan.name}</CardTitle>
                  <div className="text-3xl sm:text-4xl font-heading font-bold text-green-600">
                    {plan.price}
                    <span className="text-lg font-body text-gray-600 font-normal">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="font-body text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={plan.name === 'Free Trial' ? handleGetStarted : undefined}
                    className={`w-full hover-lift transition-all duration-300 ${plan.popular ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">What is AI Landscape Design?</h3>
              <p className="text-gray-700">
                AI Landscape Design is a smart tool that lets you redesign your garden or backyard using artificial intelligence. Just upload a photo and describe your ideal layout — the AI will do the rest. With our AI landscape generator, you can explore multiple design options, receive plant recommendations, and visualize your dream outdoor space in minutes. This technology is perfect for homeowners, designers, and anyone looking to transform their outdoor space with AI.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Is this tool really free?</h3>
              <p className="text-gray-700">
                Yes! You can use our basic AI landscaping design tool completely free to generate one design. Upgrade for HD downloads and multiple styles. Our AI landscape design free online platform allows you to try the core features at no cost, making it easy to get started with AI garden design.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">What types of landscapes can it design?</h3>
              <p className="text-gray-700">
                Our AI supports various styles including Japanese Zen gardens, tropical themes, modern minimalist, and cottage-style landscapes for both small and large outdoor spaces. Whether you want a backyard AI planner for a cozy patio or a smart landscaping tool for a large estate, our platform adapts to your needs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Do I need any design skills to use this?</h3>
              <p className="text-gray-700">
                Not at all! Just upload a photo of your space and tell us what you'd like to see — our AI will generate beautiful options for you automatically. The best AI landscape design tools are designed for everyone, regardless of experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Can I export or download the final designs?</h3>
              <p className="text-gray-700">
                Yes, you can download the final AI-generated designs. With a Pro account, you can access high-resolution images and export formats like PNG or PDF. This makes it easy to share your AI garden design with contractors, friends, or family.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Is there a mobile version?</h3>
              <p className="text-gray-700">
                Yes! Our website is fully mobile-responsive, so you can generate designs right from your phone or tablet. Experience the convenience of AI landscape design free online, wherever you are.
              </p>
            </div>
            {/* New and expanded FAQ entries below */}
            <div>
              <h3 className="text-xl font-semibold">How does the AI garden design process work?</h3>
              <p className="text-gray-700">
                The process is simple: upload a photo of your outdoor space, answer a few questions about your preferences, and let our AI landscape generator analyze your image. The AI considers factors like lighting, climate, and existing features to create several personalized design options. You can then refine your favorite design and download the results. This smart landscaping tool makes professional-quality design accessible to everyone.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">What makes your AI landscape design tool different from traditional design services?</h3>
              <p className="text-gray-700">
                Our AI landscape design platform offers instant results, multiple design variations, and personalized recommendations—all at a fraction of the cost of traditional services. Unlike manual design, our AI for landscape design can quickly generate and compare options, helping you make informed decisions and visualize your dream garden before any work begins.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Can the AI recommend plants suitable for my climate and soil?</h3>
              <p className="text-gray-700">
                Absolutely! Our AI garden design system uses your location and climate data to suggest plants that will thrive in your environment. The backyard AI planner also considers soil type, sunlight, and maintenance preferences, ensuring your new landscape is both beautiful and sustainable.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Is AI landscape design suitable for professional designers?</h3>
              <p className="text-gray-700">
                Yes, many professional landscape designers use our AI landscape generator to speed up their workflow, generate creative ideas, and present clients with multiple options. The platform is flexible enough for both DIY homeowners and industry experts seeking the best AI landscape design solutions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">How secure is my data and uploaded photos?</h3>
              <p className="text-gray-700">
                We take privacy seriously. All uploaded images and personal data are securely stored and never shared with third parties. Our AI landscape design free online tool is built with user security in mind, so you can confidently explore new designs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Can I use the AI landscape design tool for commercial or public spaces?</h3>
              <p className="text-gray-700">
                Yes! Our smart landscaping tool is suitable for residential, commercial, and public projects. Whether you are planning a community park, a business courtyard, or a private backyard, our AI for landscape design can generate tailored solutions for any scale.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">What if I want to customize the AI-generated design?</h3>
              <p className="text-gray-700">
                You can easily customize your AI landscape design by selecting different styles, editing features, or adding your own preferences. Our platform is designed to be flexible, allowing you to combine the power of AI garden design with your unique vision.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">How do I get started with AI landscape design free online?</h3>
              <p className="text-gray-700">
                Simply visit our website, upload a photo of your outdoor space, and follow the guided steps. You'll receive multiple design options in minutes, all powered by the best AI landscape design technology. No credit card or design experience required!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-gradient-to-br from-green-600 via-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Outdoor Space?
          </h2>
          <p className="text-lg sm:text-xl font-body text-green-100 mb-8 leading-relaxed">
            Join thousands of homeowners who've discovered their dream landscape with AI
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-green-600 hover:bg-gray-50 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl hover-lift transition-all duration-300 transform hover:scale-105 border border-white/20"
          >
            <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Start Your Free Design Now
          </Button>
          <p className="font-body text-green-200 mt-4">No credit card required • Get results in minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/ailandscapedesignlogo.png" alt="AI Landscape Design Logo" className="w-10 h-10 object-contain mr-2" />
                <span className="text-xl font-heading font-bold text-white">AI Landscape Design</span>
              </div>
              <p className="font-body text-gray-400 leading-relaxed">Transform your outdoor space with the power of artificial intelligence.</p>
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold mb-4">Product</h3>
              <ul className="space-y-2 font-body text-gray-400">
                <li>
                  <a 
                    href="#features" 
                    onClick={(e) => handleAnchorClick(e, 'features')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a 
                    href="#how-it-works" 
                    onClick={(e) => handleAnchorClick(e, 'how-it-works')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a 
                    href="#pricing" 
                    onClick={(e) => handleAnchorClick(e, 'pricing')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing
                  </a>
                </li>
                <li><button type="button" className="hover:text-white transition-colors">Examples</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold mb-4">Support</h3>
              <ul className="space-y-2 font-body text-gray-400">
                <li><button type="button" className="hover:text-white transition-colors">Help Center</button></li>
                <li><button type="button" className="hover:text-white transition-colors">Contact</button></li>
                <li><button type="button" className="hover:text-white transition-colors">Community</button></li>
                <li><button type="button" className="hover:text-white transition-colors">API</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold mb-4">Company</h3>
              <ul className="space-y-2 font-body text-gray-400">
                <li>
                  <button 
                    onClick={() => handleLinkClick('/privacy-policy')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLinkClick('/terms-and-conditions')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLinkClick('/refund-policy')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Refund Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center font-body text-gray-400">
            <p>&copy; 2025 AI Landscape Design. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

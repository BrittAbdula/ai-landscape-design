"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Download, RefreshCw, Sparkles, ArrowRight } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";

interface AIResultsProps {
  uploadedImage: string;
  onStartNew: () => void;
}

const designOptions = [
  {
    id: 'modern-zen',
    title: 'Modern Zen Garden',
    style: 'Contemporary minimalism with water features',
    description: 'Clean lines, ornamental grasses, water feature, and modern hardscaping create a peaceful retreat.',
    beforeImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    features: ['Water Feature', 'Ornamental Grasses', 'Modern Paving', 'Zen Elements']
  },
  {
    id: 'romantic-garden',
    title: 'Romantic Flower Paradise',
    style: 'Cottage garden with stone pathways',
    description: 'Abundant flowering plants, curved pathways, and charming garden structures for a magical atmosphere.',
    beforeImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
    features: ['Flower Beds', 'Stone Pathways', 'Garden Arbor', 'Mixed Plantings']
  },
  {
    id: 'entertainment-hub',
    title: 'Family Entertainment Hub',
    style: 'Outdoor living with fire pit and seating',
    description: 'Perfect for gatherings with outdoor kitchen, fire pit, and comfortable seating areas.',
    beforeImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    features: ['Fire Pit', 'Outdoor Seating', 'Patio Area', 'Lighting']
  }
];

export default function AIResults({ uploadedImage, onStartNew }: AIResultsProps) {
  const [selectedDesign, setSelectedDesign] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (designId: string) => {
    setFavorites(prev =>
      prev.includes(designId)
        ? prev.filter(id => id !== designId)
        : [...prev, designId]
    );
  };

  const generateMoreVariations = () => {
    // This would trigger another AI generation cycle
    alert('Generating more variations... (This would trigger another AI cycle in a real app)');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
          Your AI-Generated Designs Are Ready!
        </h2>
        <p className="text-lg font-body text-gray-600 max-w-2xl mx-auto">
          We've created 3 unique landscape designs tailored to your space.
          Compare them using the interactive slider and choose your favorite.
        </p>
      </div>

      {/* Main Before/After Comparison */}
      <BeforeAfterSlider
        beforeImage={uploadedImage}
        afterImage={designOptions[selectedDesign].afterImage}
        showDemo={false}
      />

      {/* Design Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {designOptions.map((design, index) => (
          <Card
            key={design.id}
            className={`cursor-pointer transition-all duration-300 hover-lift ${
              selectedDesign === index
                ? 'border-green-500 shadow-lg ring-2 ring-green-200'
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setSelectedDesign(index)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-heading">{design.title}</CardTitle>
                  <p className="text-sm font-body text-gray-600 mt-1">{design.style}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(design.id);
                  }}
                  className={favorites.includes(design.id) ? 'text-red-500' : 'text-gray-400'}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(design.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={design.afterImage}
                  alt={design.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <p className="font-body text-sm text-gray-600 mb-3">
                {design.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {design.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs font-body">
                    {feature}
                  </Badge>
                ))}
              </div>

              {selectedDesign === index && (
                <Badge className="bg-green-600 text-white w-full justify-center">
                  Currently Viewing
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          onClick={generateMoreVariations}
          className="bg-green-600 hover:bg-green-700 text-white hover-lift"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate More
        </Button>

        <Button
          variant="outline"
          onClick={() => toggleFavorite(designOptions[selectedDesign].id)}
          className="border-red-200 text-red-600 hover:bg-red-50 hover-lift"
        >
          <Heart className={`w-4 h-4 mr-2 ${favorites.includes(designOptions[selectedDesign].id) ? 'fill-current' : ''}`} />
          {favorites.includes(designOptions[selectedDesign].id) ? 'Favorited' : 'Save Favorite'}
        </Button>

        <Button
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover-lift"
        >
          <Download className="w-4 h-4 mr-2" />
          Download HD
        </Button>

        <Button
          variant="outline"
          onClick={onStartNew}
          className="border-gray-300 text-gray-600 hover:bg-gray-50 hover-lift"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Start New Design
        </Button>
      </div>

      {/* Pro Features Upsell */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-green-900 mb-2">
                Want Even More Options?
              </h3>
              <p className="font-body text-green-700">
                Upgrade to Pro for 10+ design variations, 3D visualization, and professional consultations.
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white hover-lift">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

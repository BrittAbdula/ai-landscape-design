"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, Camera, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  showDemo?: boolean;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  showDemo = true
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const updateSliderPositionTouch = useCallback((touch: React.Touch | Touch) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateSliderPosition(e);
    }
  }, [isDragging, updateSliderPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    updateSliderPositionTouch(touch);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      updateSliderPositionTouch(e.touches[0]);
    }
  }, [isDragging, updateSliderPositionTouch]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden hover-scale transition-transform duration-300">
        <div
          ref={containerRef}
          className="aspect-video relative cursor-ew-resize select-none"
        >
          {/* Before Image/Demo */}
          <div className="absolute inset-0">
            {beforeImage ? (
              <img
                src={beforeImage}
                alt="Before"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : showDemo ? (
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600 mx-auto mb-4 transition-transform hover:scale-110" />
                  <p className="text-sm sm:text-lg font-medium font-body text-amber-800">Before: Your Current Space</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* After Image/Demo - Clipped */}
          <div
            className="absolute inset-0 transition-all duration-200 ease-out"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            {afterImage ? (
              <img
                src={afterImage}
                alt="After"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : showDemo ? (
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-4 transition-transform hover:scale-110" />
                  <p className="text-sm sm:text-lg font-medium font-body text-green-800">After: AI-Designed Paradise</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Slider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-200 ease-out"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          />

          {/* Slider Handle */}
          <div
            className={`absolute top-1/2 w-12 h-12 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-ew-resize transition-all duration-200 ${
              isDragging ? 'scale-110 shadow-xl' : 'hover:scale-110'
            }`}
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </div>

          {/* Before/After Labels */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-body border border-amber-500/20">Before</Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-body border border-green-500/20">After</Badge>
          </div>
        </div>

        <div className="p-4 sm:p-6 text-center">
          <Badge className="bg-green-100 text-green-800 border-green-200 font-body">
            {beforeImage && afterImage ? 'Drag to Compare Your Results' : 'Interactive Demo - Drag to Compare'}
          </Badge>
        </div>
      </div>
    </div>
  );
}

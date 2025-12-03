import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface MapVisualProps {
  className?: string;
  showRider?: boolean;
}

const MapVisual: React.FC<MapVisualProps> = ({ className = '', showRider = false }) => {
  return (
    <div className={`relative bg-blue-50 overflow-hidden rounded-xl ${className}`}>
      {/* Simulated Map Background Pattern */}
      <div className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      ></div>
      
      {/* Simulated Streets */}
      <div className="absolute top-1/2 left-0 right-0 h-4 bg-white border-y border-gray-200 -rotate-6"></div>
      <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white border-x border-gray-200 rotate-12"></div>

      {/* Pins */}
      <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
        <div className="relative">
          <MapPin className="text-red-500 fill-current w-8 h-8 drop-shadow-lg" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]"></div>
        </div>
      </div>

      <div className="absolute bottom-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <MapPin className="text-blue-500 fill-current w-8 h-8 drop-shadow-lg" />
        </div>
      </div>

      {/* Simulated Rider */}
      {showRider && (
        <div className="absolute top-1/2 left-1/2 bg-amber-400 p-2 rounded-full shadow-lg border-2 border-white transition-all duration-1000 ease-in-out animate-pulse">
          <Navigation className="w-5 h-5 text-gray-900 transform rotate-45" />
        </div>
      )}
    </div>
  );
};

export default MapVisual;
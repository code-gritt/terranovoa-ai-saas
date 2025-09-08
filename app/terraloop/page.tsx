'use client';

import { useRef, useState, useEffect } from 'react';
import Map, { MapRef } from '@/components/map';
import Chat from '@/components/chat';
import LocationSidebar from '@/components/location-sidebar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Define props for Map to accept onMapClick
type MapProps = {
  ref?: React.Ref<MapRef>;
  onMapClick?: (lat: number, lng: number) => void;
};

export default function Terraloop() {
  const mapRef = useRef<MapRef>(null);
  const [chatWidth, setChatWidth] = useState('33.333%');
  const [sidebarWidth] = useState('25%'); // Fixed width for left sidebar
  const isResizing = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoExpanding, setIsAutoExpanding] = useState(false);
  const [locationInfo, setLocationInfo] = useState<{
    lat: number;
    lon: number;
    place: string;
    success: boolean;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle map click - fetch location info from backend
  const handleMapClick = async (lat: number, lng: number) => {
    try {
      setLocationInfo(null);
      const response = await fetch(
        'https://terranovoa-ai-backend.onrender.com/reverse-geocode',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lon: lng }), // ✅ use lng as lon
        }
      );
      const data = await response.json();
      setLocationInfo(data);
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocationInfo({
        lat,
        lon: lng,
        place: 'Network error',
        success: false,
      });
    }
  };

  const handleLocationUpdate = (lat: number, lng: number) => {
    mapRef.current?.setLocation(lat, lng);
  };

  const handleChatExpand = () => {
    setIsAutoExpanding(true);
    setTimeout(() => {
      setChatWidth('60%');
    }, 1000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    setIsAutoExpanding(false);

    const windowWidth = window.innerWidth;
    const newWidth = windowWidth - e.clientX;
    const widthPercentage = Math.min(
      Math.max((newWidth / windowWidth) * 100, 20),
      60
    );
    setChatWidth(`${widthPercentage}%`);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Calculate map width
  const mapWidth = `calc(100% - ${sidebarWidth} - ${chatWidth})`;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <main className="relative h-screen select-none flex">
        {/* Left Sidebar */}
        <div
          className="absolute left-0 top-0 h-full z-10"
          style={{ width: sidebarWidth }}
        >
          <LocationSidebar locationInfo={locationInfo} />
        </div>

        {/* Map */}
        <div
          className="relative flex-1"
          style={{ width: mapWidth, left: sidebarWidth }}
        >
          <Map ref={mapRef} onMapClick={handleMapClick} />
        </div>

        {/* Chat */}
        <div
          className={`absolute right-0 top-0 h-full z-10 ${
            isAutoExpanding ? 'transition-all duration-2000 ease-in-out' : ''
          }`}
          style={{ width: chatWidth }}
        >
          <div
            className="absolute left-0 top-0 h-full w-2 cursor-ew-resize group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-0 bg-transparent group-hover:bg-primary/40 transition-colors duration-200" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-1 h-8 bg-primary rounded-full" />
            </div>
          </div>
          <div className="h-full bg-background/80 backdrop-blur-sm ml-2">
            <Chat
              onLocationUpdate={handleLocationUpdate}
              onFormSubmit={handleChatExpand}
            />
          </div>
        </div>
      </main>
    </>
  );
}

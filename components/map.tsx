'use client';

import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Leaf } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';

export interface MapRef {
  setLocation: (lat: number, lng: number) => void;
}

interface MapProps {
  onMapClick?: (lat: number, lng: number) => void;
}

const Map = forwardRef<MapRef, MapProps>(({ onMapClick }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [center] = useState<[number, number]>([20, 30]);

  // Expose imperative methods
  useImperativeHandle(ref, () => ({
    setLocation: (lat: number, lng: number) => {
      map.current?.flyTo({
        center: [lng, lat],
        zoom: 11,
        duration: 4000,
        essential: true,
      });
    },
  }));

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox token not found in environment variables');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const instance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center,
      zoom: 2,
      attributionControl: false,
    });

    map.current = instance;

    instance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Handle map click
    instance.on('click', (e) => {
      if (e.lngLat && onMapClick) {
        const { lat, lng } = e.lngLat;
        console.log(`Clicked at: ${lat}, ${lng}`);
        onMapClick(lat, lng);
      }
    });

    instance.on('load', () => setLoading(false));

    return () => {
      instance.remove();
    };
  }, [center, onMapClick]);

  return (
    <div className="relative w-full h-full">
      {/* Overlay Header */}
      <div className="absolute top-4 left-4 z-[1000] bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <Link href="/dashboard">
            <div className="flex flex-col">
              <h1 className="font-bold text-lg">Terraloop</h1>
              <p className="text-xs">Strategic Renewable Energy Advisor</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="animate-pulse text-muted-foreground">
            Loading map...
          </div>
        </div>
      )}
    </div>
  );
});

Map.displayName = 'Map';
export default Map;

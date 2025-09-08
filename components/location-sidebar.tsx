'use client';
import { useState, useEffect } from 'react';

interface LocationInfo {
  lat: number;
  lon: number;
  place: string;
  success: boolean;
}

interface LocationSidebarProps {
  locationInfo: LocationInfo | null;
}

export default function LocationSidebar({
  locationInfo,
}: LocationSidebarProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false); // Reset loading when new location arrives
  }, [locationInfo]);

  if (!locationInfo) {
    return (
      <div className="h-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground">
        <p>Click on the map to see location details</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Location Details</h2>
      <div className="space-y-2">
        <p>
          <strong>Latitude:</strong> {locationInfo.lat.toFixed(6)}
        </p>
        <p>
          <strong>Longitude:</strong> {locationInfo.lon.toFixed(6)}
        </p>
        <p>
          <strong>Place:</strong> {locationInfo.place}
        </p>
        {!locationInfo.success && (
          <p className="text-destructive text-sm">Failed to fetch place info</p>
        )}
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )}
    </div>
  );
}

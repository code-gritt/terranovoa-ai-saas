"use client";

import { useMapEvents } from "react-leaflet";
import L from "leaflet";

export default function MapClickHandler({
  onClick,
}: {
  onClick: (e: L.LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click: onClick,
  });
  return null;
}

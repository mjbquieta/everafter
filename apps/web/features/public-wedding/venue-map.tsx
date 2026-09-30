'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface VenueMapProps {
  address: string;
  className?: string;
}

// Fix default marker icon paths (leaflet bundles them as separate files)
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function VenueMap({ address, className = '' }: VenueMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !address) return;

    let cancelled = false;

    async function geocodeAndRender() {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
          { headers: { 'User-Agent': 'EverAfterWeddingApp/1.0' } },
        );
        const data = await res.json();

        if (cancelled || !data.length || !containerRef.current) {
          if (!cancelled && !data.length) setError(true);
          return;
        }

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        // Clean up previous map instance
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        const map = L.map(containerRef.current, {
          scrollWheelZoom: false,
          dragging: true,
          zoomControl: false,
          attributionControl: false,
        }).setView([lat, lon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
        }).addTo(map);

        L.marker([lat, lon], { icon: defaultIcon }).addTo(map);

        mapRef.current = map;
      } catch {
        if (!cancelled) setError(true);
      }
    }

    geocodeAndRender();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [address]);

  if (error || !address) return null;

  return (
    <div
      ref={containerRef}
      className={`w-full h-48 rounded-lg overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}

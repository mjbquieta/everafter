'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface AddressSearchInputProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
}

export function AddressSearchInput({
  value,
  onChange,
  placeholder = 'Search for an address...',
}: AddressSearchInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Geocode existing value on mount to show map
  useEffect(() => {
    if (value && !coords) {
      geocode(value).then((res) => {
        if (res.length > 0) {
          setCoords({ lat: parseFloat(res[0].lat), lon: parseFloat(res[0].lon) });
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const geocode = async (q: string): Promise<NominatimResult[]> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=0`,
        { headers: { 'User-Agent': 'EverAfterWeddingApp/1.0' } },
      );
      return await res.json();
    } catch {
      return [];
    }
  };

  const handleInputChange = useCallback(
    (text: string) => {
      setQuery(text);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (text.length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        const data = await geocode(text);
        setResults(data);
        setIsOpen(data.length > 0);
        setIsSearching(false);
      }, 400);
    },
    [],
  );

  const handleSelect = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setQuery(result.display_name);
    setCoords({ lat, lon });
    setIsOpen(false);
    setResults([]);
    onChange(result.display_name);
  };

  const handleClear = () => {
    setQuery('');
    setCoords(null);
    setResults([]);
    setIsOpen(false);
    onChange('');
  };

  // Render / update map
  useEffect(() => {
    if (!coords || !mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        dragging: true,
        zoomControl: true,
      }).setView([coords.lat, coords.lon], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const marker = L.marker([coords.lat, coords.lon], { icon: defaultIcon }).addTo(map);
      mapRef.current = map;
      markerRef.current = marker;
    } else {
      mapRef.current.setView([coords.lat, coords.lon], 15);
      markerRef.current?.setLatLng([coords.lat, coords.lon]);
    }
  }, [coords]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Search input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="flex w-full rounded-md border border-border bg-surface pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-surface shadow-lg max-h-60 overflow-auto">
          {results.map((r) => (
            <button
              key={r.place_id}
              type="button"
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-primary/5 border-b border-border last:border-b-0 transition-colors"
            >
              {r.display_name}
            </button>
          ))}
        </div>
      )}

      {/* Map preview */}
      {coords && (
        <div className="mt-3">
          <div
            ref={mapContainerRef}
            className="w-full h-48 rounded-lg overflow-hidden border border-border"
            style={{ zIndex: 0 }}
          />
          <p className="mt-1.5 text-[11px] text-muted">
            Search powered by OpenStreetMap Nominatim.
          </p>
        </div>
      )}
    </div>
  );
}

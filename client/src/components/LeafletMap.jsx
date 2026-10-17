import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in bundlers
const createTealIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: #0F766E;
        color: white;
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <span style="transform: rotate(45deg); font-size: 16px; font-weight: bold;">🏥</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

export const LeafletMap = ({ facilities = [], selectedFacility = null }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center coordinates for Kerala rural region (around Palakkad / Wayanad / Idukki)
    const defaultCenter = [10.8505, 76.2711]; // Kerala central lat/lng
    const defaultZoom = 8;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);
    let hasValidCoords = false;

    facilities.forEach((facility) => {
      const lat = facility.coordinates?.lat;
      const lng = facility.coordinates?.lng;

      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        hasValidCoords = true;
        bounds.extend([lat, lng]);

        const marker = L.marker([lat, lng], { icon: createTealIcon() }).addTo(map);

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 180px;">
            <div style="font-size: 10px; font-weight: bold; color: #0F766E; text-transform: uppercase;">
              ${facility.type}
            </div>
            <div style="font-size: 14px; font-weight: bold; color: #1E293B; margin-top: 2px;">
              ${facility.name}
            </div>
            <div style="font-size: 12px; color: #64748B; margin-top: 4px;">
              📍 ${facility.locality}, ${facility.district}
            </div>
            <div style="font-size: 12px; color: #475569; margin-top: 4px;">
              🕒 ${facility.openingHours || 'Regular OPD'}
            </div>
            <div style="margin-top: 8px; display: flex; gap: 6px;">
              <a href="tel:${facility.contactNumber}" style="
                background: #0F766E;
                color: white;
                text-decoration: none;
                font-size: 11px;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 4px;
              ">📞 Call</a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="
                background: #E2E8F0;
                color: #1E293B;
                text-decoration: none;
                font-size: 11px;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 4px;
              ">Directions ↗</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);

        if (selectedFacility && selectedFacility._id === facility._id) {
          map.setView([lat, lng], 13);
          marker.openPopup();
        }
      }
    });

    if (hasValidCoords && !selectedFacility) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      // Keep map instance or clear on total unmount
    };
  }, [facilities, selectedFacility]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-slate-700 px-2.5 py-1 rounded-md shadow-xs border border-slate-200 pointer-events-none">
        OpenStreetMap • Kerala Rural Health Map
      </div>
    </div>
  );
};

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  MapPin,
  Phone,
  Star,
  Globe,
  Navigation,
  Loader2,
  AlertCircle,
} from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 31.5204,
  lng: 74.3587,
};

export default function NearbyIndustries() {
  const [userLocation, setUserLocation] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const searchRadius = 20; // ✅ KEEP MAX 20km

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(loc);
        fetchIndustries(loc);
      },
      () => {
        setUserLocation(defaultCenter);
        fetchIndustries(defaultCenter);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchIndustries = async (loc) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        "http://localhost:5000/api/industries/fetch-from-google",
        {
          lat: loc.lat,
          lng: loc.lng,
          radius: searchRadius,
        }
      );

      setIndustries(res.data.industries || []);
      if (!res.data.industries?.length) {
        setError("No tech companies found nearby.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to fetch industries from server"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <div className="w-[400px] overflow-y-auto bg-white p-4">
        <h2 className="text-xl font-bold mb-4">Nearby Tech Companies</h2>

        {loading && <p>Loading...</p>}
        {error && (
          <div className="text-red-600 flex gap-2">
            <AlertCircle /> {error}
          </div>
        )}

        {industries.map((ind) => (
          <div
            key={ind._id}
            className="border rounded-xl p-3 mb-3 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedIndustry(ind)}
          >
            <h3 className="font-semibold">{ind.name}</h3>
            <p className="text-sm text-gray-600">{ind.address}</p>
            <p className="text-xs mt-1">{ind.distanceKm} km away</p>
          </div>
        ))}
      </div>

      {/* MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={13}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#2563eb",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 3,
            }}
          />
        )}

        {industries.map((ind) => (
          <Marker
            key={ind._id}
            position={ind.location}
            onClick={() => setSelectedIndustry(ind)}
          />
        ))}

        {selectedIndustry && (
          <InfoWindow
            position={selectedIndustry.location}
            onCloseClick={() => setSelectedIndustry(null)}
          >
            <div className="p-2">
              <h3 className="font-bold">{selectedIndustry.name}</h3>
              <p className="text-sm">{selectedIndustry.address}</p>
              <p className="text-xs">{selectedIndustry.distanceKm} km away</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

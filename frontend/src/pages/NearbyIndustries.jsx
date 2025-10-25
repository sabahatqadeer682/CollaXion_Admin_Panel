import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
});

const industryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448609.png",
  iconSize: [38, 38],
});

const NearbyIndustries = () => {
  const [industries, setIndustries] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchNearbyIndustries(latitude, longitude);
      },
      () => {
        setError("Please allow location access to view nearby industries.");
        setLoading(false);
      }
    );
  }, []);

  const fetchNearbyIndustries = async (lat, lng) => {
    try {
      const res = await axios.get("http://localhost:5000/api/industries/nearby", {
        params: { lat, lng, maxDistance: 25 },
      });
      setIndustries(res.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching industries.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-blue-600 font-semibold">
        📍 Detecting your location...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">{error}</p>
    );

  return (
    <div className="p-6 bg-[#E0F2FE] min-h-screen">
      <h2 className="text-3xl font-extrabold text-center text-[#1E3A8A] mb-8 tracking-wide">
        Nearby Industries
      </h2>

      {userLocation && (
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={13}
          style={{
            width: "100%",
            height: "70vh",
            borderRadius: "15px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup className="font-semibold text-[#1E3A8A]">
              You are here 📍
            </Popup>
          </Marker>

          {industries.map((i) => (
            <Marker
              key={i._id}
              position={[i.location.coordinates[1], i.location.coordinates[0]]}
              icon={industryIcon}
            >
              <Popup className="text-sm">
                <h3 className="font-bold text-[#1E40AF]">{i.name}</h3>
                <p className="text-gray-700">📍 {i.address}</p>
                <p className="text-gray-600">📧 {i.email || "N/A"}</p>
                <p className="text-gray-600">☎️ {i.contact || "N/A"}</p>
                <p className="font-semibold text-[#3B82F6]">📏 {i.distanceInKm} km away</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      <div className="mt-10 bg-white p-6 rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold text-[#1E40AF] mb-5">Nearby Industries</h3>
        {industries.length === 0 ? (
          <p className="text-gray-600 text-center py-4">
            No industries found nearby.
          </p>
        ) : (
          <ul className="space-y-4">
            {industries.map((i) => (
              <li
                key={i._id}
                className="border border-blue-100 p-5 rounded-xl hover:shadow-lg hover:bg-blue-50 transition duration-300"
              >
                <h4 className="text-lg font-semibold text-[#1E3A8A]">{i.name}</h4>
                <p className="text-gray-700">{i.address}</p>
                <p className="text-gray-600">📧 {i.email || "N/A"}</p>
                <p className="text-gray-600">☎️ {i.contact || "N/A"}</p>
                <p className="font-semibold text-[#3B82F6]">
                  📏 Distance: {i.distanceInKm} km
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NearbyIndustries;


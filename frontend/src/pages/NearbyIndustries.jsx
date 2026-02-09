

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

// const containerStyle = { width: "100%", height: "100%" };
// const defaultCenter = { lat: 31.5204, lng: 74.3587 };

// export default function NearbyIndustries() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [industries, setIndustries] = useState([]);
//   const [selectedIndustry, setSelectedIndustry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { isLoaded } = useJsApiLoader({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, libraries: ["places"] });

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       pos => {
//         const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
//         setUserLocation(loc);
//         fetchIndustries(loc);
//       },
//       () => {
//         setUserLocation(defaultCenter);
//         fetchIndustries(defaultCenter);
//       }
//     );
//   }, []);

//   const fetchIndustries = async (loc) => {
//     try {
//       setLoading(true);
//       const res = await axios.post("http://localhost:5000/api/industries/fetch-from-google", { lat: loc.lat, lng: loc.lng, radius: 20 });
//       setIndustries(res.data.industries);
//       if (!res.data.industries.length) setError("No tech companies found nearby.");
//     } catch (err) { setError("Failed to fetch industries"); }
//     finally { setLoading(false); }
//   };

//   const sendEmail = async (id, type) => {
//     try {
//       await axios.post("http://localhost:5000/api/industries/send-email", { industryId: id, type });
//       alert("Email sent successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send email");
//     }
//   };

//   if (!isLoaded) return <div className="loading">Loading Google Maps...</div>;

//   return (
//     <div className="nearby-container">
//       {/* Inline CSS */}
//       <style>{`
//         .nearby-container {
//           display: flex;
//           height: 100vh;
//           background-color: #f3f4f6;
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         }
//         .sidebar {
//           width: 400px;
//           overflow-y: auto;
//           padding: 20px;
//           background-color: #fff;
//           box-shadow: 0 0 15px rgba(0,0,0,0.1);
//           border-right: 1px solid #e5e7eb;
//           border-top-right-radius: 20px;
//           border-bottom-right-radius: 20px;
//         }
//         .sidebar h2 {
//           font-size: 24px;
//           font-weight: bold;
//           margin-bottom: 20px;
//           color: #111827;
//         }
//         .industry-card {
//           border: 1px solid #e5e7eb;
//           border-radius: 15px;
//           padding: 15px;
//           margin-bottom: 15px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }
//         .industry-card:hover {
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//           background-color: #f9fafb;
//         }
//         .industry-card h3 {
//           font-size: 18px;
//           font-weight: 600;
//           color:#193648;
//           margin-bottom: 5px;
//         }
//         .industry-card p {
//           color: #4b5563;
//           margin: 2px 0;
//           font-size: 14px;
//         }
//         .button-group {
//           display: flex;
//           gap: 10px;
//           margin-top: 10px;
//         }
//         .button {
//           flex: 1;
//           padding: 8px 15px;
//           border-radius: 8px;
//           color: white;
//           font-weight: 500;
//           border: none;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }
//         .button-form {
//           background-color: #193648
//         }
//         .button-form:hover {
//           background-color: #193648b5
//         }
//         .button-app {
//           background-color: #22c55e;
//         }
//         .button-app:hover {
//           background-color: #15803d;
//         }
//         .infowindow h3 {
//           font-weight: bold;
//           color: #2563eb;
//           margin-bottom: 5px;
//         }
//         .infowindow p {
//           margin: 2px 0;
//           font-size: 14px;
//           color: #374151;
//         }
//         .loading {
//           text-align: center;
//           margin-top: 20px;
//           color: #6b7280;
//         }
//         .error {
//           color: #dc2626;
//           margin-top: 10px;
//         }
//       `}</style>

//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2>Nearby Tech Companies</h2>
//         {loading && <p className="loading">Loading...</p>}
//         {error && <p className="error">{error}</p>}

//         {industries.map(ind => (
//           <div key={ind._id} className="industry-card" onClick={() => setSelectedIndustry(ind)}>
//             <h3>{ind.name}</h3>
//             <p>{ind.address}</p>
//             <p>{ind.distanceKm} km away</p>
//             <p>Email: {ind.email}</p>

//             <div className="button-group">
//               <button onClick={() => sendEmail(ind._id, "form")} className="button button-form">Send Form</button>
//               <button onClick={() => sendEmail(ind._id, "app")} className="button button-app">Send App Link</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Google Map */}
//       <GoogleMap mapContainerStyle={containerStyle} center={userLocation || defaultCenter} zoom={13}>
//         {userLocation && (
//           <Marker 
//             position={userLocation} 
//             icon={{
//               path: window.google.maps.SymbolPath.CIRCLE,
//               scale: 10,
//               fillColor: "#2563eb",
//               fillOpacity: 1,
//               strokeColor: "#fff",
//               strokeWeight: 3
//             }} 
//           />
//         )}
//         {industries.map(ind => <Marker key={ind._id} position={ind.location} onClick={() => setSelectedIndustry(ind)} />)}
//         {selectedIndustry && (
//           <InfoWindow position={selectedIndustry.location} onCloseClick={() => setSelectedIndustry(null)}>
//             <div className="infowindow">
//               <h3>{selectedIndustry.name}</h3>
//               <p>{selectedIndustry.address}</p>
//               <p>{selectedIndustry.distanceKm} km away</p>
//               <p>Email: {selectedIndustry.email}</p>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     </div>
//   );
// }






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useJsApiLoader,
// } from "@react-google-maps/api";

// const containerStyle = { width: "100%", height: "100%" };
// const defaultCenter = { lat: 31.5204, lng: 74.3587 };

// export default function NearbyIndustries() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [industries, setIndustries] = useState([]);
//   const [selectedIndustry, setSelectedIndustry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const loc = {
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         };
//         setUserLocation(loc);
//         fetchIndustries(loc);
//       },
//       () => {
//         setUserLocation(defaultCenter);
//         fetchIndustries(defaultCenter);
//       }
//     );
//   }, []);

//   const fetchIndustries = async (loc) => {
//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/api/industries/fetch-from-google",
//         {
//           lat: loc.lat,
//           lng: loc.lng,
//           radius: 20,
//         }
//       );

//       setIndustries(res.data.industries);

//       if (!res.data.industries.length)
//         setError("No tech companies found nearby.");
//     } catch (err) {
//       setError("Failed to fetch industries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ WhatsApp Message Send
//   const sendWhatsApp = (phone, name) => {
//     if (!phone || phone === "Not Available") {
//       alert("Phone number not available for this industry.");
//       return;
//     }

//     const message = `Hello ${name},\n\nThis is CollaXion Platform.\nPlease fill out our internship collaboration form:\n${import.meta.env.VITE_GOOGLE_FORM_LINK}`;

//     const url = `https://wa.me/${phone.replace(
//       /[^0-9]/g,
//       ""
//     )}?text=${encodeURIComponent(message)}`;

//     window.open(url, "_blank");
//   };

//   if (!isLoaded) return <div className="loading">Loading Google Maps...</div>;

//   return (
//     <div className="nearby-container">
//       {/* Inline CSS */}
//       <style>{`
//         .nearby-container {
//           display: flex;
//           height: 100vh;
//           background-color: #f3f4f6;
//           font-family: "Segoe UI", sans-serif;
//         }

//         .sidebar {
//           width: 420px;
//           overflow-y: auto;
//           padding: 20px;
//           background: white;
//           border-right: 2px solid #eee;
//           box-shadow: 0 0 15px rgba(0,0,0,0.1);
//         }

//         .sidebar h2 {
//           font-size: 24px;
//           font-weight: bold;
//           margin-bottom: 20px;
//           color: #193648;
//         }

//         .industry-card {
//           border: 1px solid #ddd;
//           border-radius: 15px;
//           padding: 15px;
//           margin-bottom: 15px;
//           cursor: pointer;
//           transition: 0.3s;
//         }

//         .industry-card:hover {
//           background: #f9fafb;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//         }

//         .industry-card h3 {
//           font-size: 18px;
//           font-weight: 600;
//           color: #193648;
//           margin-bottom: 5px;
//         }

//         .industry-card p {
//           font-size: 14px;
//           color: #444;
//           margin: 3px 0;
//         }

//         .btn {
//           width: 100%;
//           margin-top: 10px;
//           padding: 10px;
//           border: none;
//           border-radius: 10px;
//           background: #193648;
//           color: white;
//           font-weight: 500;
//           cursor: pointer;
//           transition: 0.2s;
//         }

//         .btn:hover {
//           background: #102432;
//         }

//         .loading {
//           text-align: center;
//           margin-top: 20px;
//           color: gray;
//         }

//         .error {
//           color: red;
//         }
//       `}</style>

//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2>Nearby Tech Companies</h2>

//         {loading && <p className="loading">Loading...</p>}
//         {error && <p className="error">{error}</p>}

//         {industries.map((ind) => (
//           <div
//             key={ind._id}
//             className="industry-card"
//             onClick={() => setSelectedIndustry(ind)}
//           >
//             <h3>{ind.name}</h3>

//             <p><b>Address:</b> {ind.address}</p>
//             <p><b>Phone:</b> {ind.phone}</p>
//             <p><b>Distance:</b> {ind.distanceKm} km away</p>
//             <p><b>Rating:</b> ⭐ {ind.rating}</p>

//             <button
//               className="btn"
//               onClick={() => sendWhatsApp(ind.phone, ind.name)}
//             >
//               Send Form via WhatsApp
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Map */}
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={userLocation || defaultCenter}
//         zoom={13}
//       >
//         {industries.map((ind) => (
//           <Marker
//             key={ind._id}
//             position={ind.location}
//             onClick={() => setSelectedIndustry(ind)}
//           />
//         ))}

//         {selectedIndustry && (
//           <InfoWindow
//             position={selectedIndustry.location}
//             onCloseClick={() => setSelectedIndustry(null)}
//           >
//             <div>
//               <h3 style={{ color: "#193648" }}>
//                 {selectedIndustry.name}
//               </h3>
//               <p>{selectedIndustry.address}</p>
//               <p>📞 {selectedIndustry.phone}</p>
//               <p>⭐ {selectedIndustry.rating}</p>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useJsApiLoader,
// } from "@react-google-maps/api";

// const containerStyle = { width: "100%", height: "100%" };
// const defaultCenter = { lat: 31.5204, lng: 74.3587 };

// export default function NearbyIndustries() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [industries, setIndustries] = useState([]);
//   const [selectedIndustry, setSelectedIndustry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const loc = {
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         };
//         setUserLocation(loc);
//         fetchIndustries(loc);
//       },
//       () => {
//         setUserLocation(defaultCenter);
//         fetchIndustries(defaultCenter);
//       }
//     );
//   }, []);

//   const fetchIndustries = async (loc) => {
//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/api/industries/fetch-from-google",
//         {
//           lat: loc.lat,
//           lng: loc.lng,
//           radius: 20,
//         }
//       );
//       setIndustries(res.data.industries);
//       if (!res.data.industries.length)
//         setError("No tech companies found nearby.");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch industries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ WhatsApp Message Send
//   const sendWhatsApp = (phone, name) => {
//     if (!phone || phone === "Not Available") {
//       alert("Phone number not available for this industry.");
//       return;
//     }

//     // Format number WhatsApp ke liye
//     let formattedPhone = phone.trim();
//     if (formattedPhone.startsWith("0")) formattedPhone = "92" + formattedPhone.slice(1);
//     if (formattedPhone.startsWith("+92")) formattedPhone = "92" + formattedPhone.slice(3);

//     const message = `Hello ${name},\n\nThis is CollaXion Platform.\nPlease fill out our internship collaboration form:\n${import.meta.env.VITE_GOOGLE_FORM_LINK}`;

//     const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
//     window.open(url, "_blank");
//   };

//   // ✅ Open Website
//   const openWebsite = (website) => {
//     if (!website) {
//       alert("Website not available for this industry.");
//       return;
//     }
//     window.open(website, "_blank");
//   };

//   if (!isLoaded) return <div className="loading">Loading Google Maps...</div>;

//   return (
//     <div className="nearby-container">
//       <style>{`
//         .nearby-container { display:flex; height:100vh; background-color:#f3f4f6; font-family:Segoe UI,sans-serif; }
//         .sidebar { width:420px; overflow-y:auto; padding:20px; background:white; border-right:2px solid #eee; box-shadow:0 0 15px rgba(0,0,0,0.1);}
//         .sidebar h2 { font-size:24px; font-weight:bold; margin-bottom:20px; color:#193648; }
//         .industry-card { border:1px solid #ddd; border-radius:15px; padding:15px; margin-bottom:15px; cursor:pointer; transition:0.3s; }
//         .industry-card:hover { background:#f9fafb; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
//         .industry-card h3 { font-size:18px; font-weight:600; color:#193648; margin-bottom:5px; }
//         .industry-card p { font-size:14px; color:#444; margin:3px 0; }
//         .btn { width:100%; margin-top:10px; padding:10px; border:none; border-radius:10px; font-weight:500; cursor:pointer; transition:0.2s; }
//         .btn-whatsapp { background:#25D366; color:white; }
//         .btn-whatsapp:hover { background:#1ebe57; }
//         .btn-website { background:#2563eb; color:white; }
//         .btn-website:hover { background:#194a99; }
//         .loading { text-align:center; margin-top:20px; color:gray; }
//         .error { color:red; }
//       `}</style>

//       <div className="sidebar">
//         <h2>Nearby Tech Companies</h2>

//         {loading && <p className="loading">Loading...</p>}
//         {error && <p className="error">{error}</p>}

//         {industries.map((ind) => (
//           <div
//             key={ind._id}
//             className="industry-card"
//             onClick={() => setSelectedIndustry(ind)}
//           >
//             <h3>{ind.name}</h3>
//             <p><b>Address:</b> {ind.address}</p>
//             <p><b>Phone:</b> {ind.phone}</p>
//             <p><b>Distance:</b> {ind.distanceKm} km away</p>
//             <p><b>Rating:</b> ⭐ {ind.rating}</p>

//             <button
//               className="btn btn-whatsapp"
//               onClick={() => sendWhatsApp(ind.phone, ind.name)}
//             >
//               Send Form via WhatsApp
//             </button>
//             <button
//               className="btn btn-website"
//               onClick={() => openWebsite(ind.website)}
//             >
//               Visit Website
//             </button>
//           </div>
//         ))}
//       </div>

//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={userLocation || defaultCenter}
//         zoom={13}
//       >
//         {industries.map((ind) => (
//           <Marker
//             key={ind._id}
//             position={ind.location}
//             onClick={() => setSelectedIndustry(ind)}
//           />
//         ))}

//         {selectedIndustry && (
//           <InfoWindow
//             position={selectedIndustry.location}
//             onCloseClick={() => setSelectedIndustry(null)}
//           >
//             <div>
//               <h3 style={{ color: "#193648" }}>{selectedIndustry.name}</h3>
//               <p>{selectedIndustry.address}</p>
//               <p>📞 {selectedIndustry.phone}</p>
//               <p>⭐ {selectedIndustry.rating}</p>
//               {selectedIndustry.website && (
//                 <p>
//                   🌐 <a href={selectedIndustry.website} target="_blank">{selectedIndustry.website}</a>
//                 </p>
//               )}
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     </div>
//   );
// }






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useJsApiLoader,
// } from "@react-google-maps/api";

// const containerStyle = { width: "100%", height: "100%" };
// const defaultCenter = { lat: 31.5204, lng: 74.3587 };

// // ✅ Haversine formula for distance calculation
// const getDistanceKm = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // km
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// export default function NearbyIndustries() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [industries, setIndustries] = useState([]);
//   const [selectedIndustry, setSelectedIndustry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
//         setUserLocation(loc);
//         fetchIndustries(loc);
//       },
//       () => {
//         setUserLocation(defaultCenter);
//         fetchIndustries(defaultCenter);
//       }
//     );
//   }, []);

//   const fetchIndustries = async (loc) => {
//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/api/industries/fetch-from-google",
//         { lat: loc.lat, lng: loc.lng, radius: 20 }
//       );

//       // Calculate distance for each company
//       const industriesWithDistance = res.data.industries.map((ind) => ({
//         ...ind,
//         distanceKm: getDistanceKm(
//           loc.lat,
//           loc.lng,
//           ind.location.lat,
//           ind.location.lng
//         ).toFixed(2),
//       }));

//       setIndustries(industriesWithDistance);
//       if (!industriesWithDistance.length)
//         setError("No tech companies found nearby.");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch industries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // WhatsApp Message Send
//   const sendWhatsApp = (phone, name) => {
//     if (!phone || phone === "Not Available") {
//       alert("Phone number not available for this industry.");
//       return;
//     }

//     // Format number for WhatsApp
//     let formattedPhone = phone.trim();
//     if (formattedPhone.startsWith("0")) formattedPhone = "92" + formattedPhone.slice(1);
//     if (formattedPhone.startsWith("+92")) formattedPhone = "92" + formattedPhone.slice(3);

//     const message = `Hello ${name},\n\nThis is CollaXion Platform.\nPlease fill out our internship collaboration form:\n${import.meta.env.VITE_GOOGLE_FORM_LINK}`;

//     const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
//     window.open(url, "_blank");
//   };

//   // Open Website
//   const openWebsite = (website) => {
//     if (!website || website === "N/A") {
//       alert("Website not available for this industry.");
//       return;
//     }
//     window.open(website, "_blank");
//   };

//   if (!isLoaded) return <div className="loading">Loading Google Maps...</div>;

//   return (
//     <div className="nearby-container">
//       <style>{`
//         .nearby-container { display:flex; height:100vh; background-color:#f3f4f6; font-family:Segoe UI,sans-serif; }
//         .sidebar { width:420px; overflow-y:auto; padding:20px; background:white; border-right:2px solid #eee; box-shadow:0 0 15px rgba(0,0,0,0.1);}
//         .sidebar h2 { font-size:24px; font-weight:bold; margin-bottom:20px; color:#193648; }
//         .industry-card { border:1px solid #ddd; border-radius:15px; padding:15px; margin-bottom:15px; cursor:pointer; transition:0.3s; }
//         .industry-card:hover { background:#f9fafb; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
//         .industry-card h3 { font-size:18px; font-weight:600; color:#193648; margin-bottom:5px; }
//         .industry-card p { font-size:14px; color:#444; margin:3px 0; }
//         .btn { width:100%; margin-top:10px; padding:10px; border:none; border-radius:10px; font-weight:500; cursor:pointer; transition:0.2s; }
//         .btn-whatsapp { background:#25D366; color:white; }
//         .btn-whatsapp:hover { background:#1ebe57; }
//         .btn-website { background:#2563eb; color:white; }
//         .btn-website:hover { background:#194a99; }
//         .loading { text-align:center; margin-top:20px; color:gray; }
//         .error { color:red; }
//       `}</style>

//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2>Nearby Tech Companies</h2>
//         {loading && <p className="loading">Loading...</p>}
//         {error && <p className="error">{error}</p>}

//         {industries.map((ind) => (
//           <div
//             key={ind._id}
//             className="industry-card"
//             onClick={() => setSelectedIndustry(ind)}
//           >
//             <h3>{ind.name}</h3>
//             <p><b>Address:</b> {ind.address}</p>
//             <p><b>Phone:</b> {ind.phone}</p>
//             <p><b>Distance:</b> {ind.distanceKm} km away</p>
//             <p><b>Rating:</b> ⭐ {ind.rating}</p>

//             <button
//               className="btn btn-whatsapp"
//               onClick={() => sendWhatsApp(ind.phone, ind.name)}
//             >
//               Send Form via WhatsApp
//             </button>
//             <button
//               className="btn btn-website"
//               onClick={() => openWebsite(ind.website)}
//             >
//               Visit Website
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Map */}
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={userLocation || defaultCenter}
//         zoom={13}
//       >
//         {industries.map((ind) => (
//           <Marker
//             key={ind._id}
//             position={ind.location}
//             onClick={() => setSelectedIndustry(ind)}
//           />
//         ))}

//         {selectedIndustry && (
//           <InfoWindow
//             position={selectedIndustry.location}
//             onCloseClick={() => setSelectedIndustry(null)}
//           >
//             <div>
//               <h3 style={{ color: "#193648" }}>{selectedIndustry.name}</h3>
//               <p>{selectedIndustry.address}</p>
//               <p>📞 {selectedIndustry.phone}</p>
//               <p>⭐ {selectedIndustry.rating}</p>
//               {selectedIndustry.website && (
//                 <p>
//                   🌐 <a href={selectedIndustry.website} target="_blank">{selectedIndustry.website}</a>
//                 </p>
//               )}
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     </div>
//   );
// }













import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 31.5204, lng: 74.3587 };

// Haversine formula for accurate distance calculation
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function NearbyIndustries() {
  const [userLocation, setUserLocation] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      }
    );
  }, []);

  const fetchIndustries = async (loc) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/industries/fetch-from-google",
        {
          lat: loc.lat,
          lng: loc.lng,
          radius: 20,
        }
      );

      // calculate accurate distance for each industry
      const updatedIndustries = res.data.industries.map((ind) => ({
        ...ind,
        distanceKm: calculateDistanceKm(
          loc.lat,
          loc.lng,
          ind.location.lat,
          ind.location.lng
        ).toFixed(2),
      }));

      setIndustries(updatedIndustries);

      if (!updatedIndustries.length)
        setError("No tech companies found nearby.");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch industries");
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp send
  // const sendWhatsApp = (phone, name) => {
  //   if (!phone || phone === "Not Available") {
  //     alert("Phone number not available for this industry.");
  //     return;
  //   }

  //   let formattedPhone = phone.replace(/[^0-9]/g, "");
  //   if (formattedPhone.startsWith("0")) formattedPhone = "92" + formattedPhone.slice(1);

  //   const message = `Hello ${name},\n\nThis is CollaXion Platform.\nPlease fill out our internship collaboration form:\n${import.meta.env.VITE_GOOGLE_FORM_LINK}`;

  //   const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  //   window.open(url, "_blank");
  // };

//   const sendWhatsApp = (phone, industryName) => {
//   if (!phone || phone === "Not Available") {
//     alert("Phone number not available for this industry.");
//     return;
//   }

//   let formattedPhone = phone.replace(/[^0-9]/g, "");
//   if (formattedPhone.startsWith("0")) formattedPhone = "92" + formattedPhone.slice(1);

//   const message = `*Assalamu Alaikum ${industryName}*,\n\n` +
//     `I hope this message finds you well.\n\n` +
//     `On behalf of *Riphah International University* and our platform *CollaXion*, we would like to explore potential *collaboration opportunities* with your esteemed organization.\n\n` +
//     `We kindly request you to fill out our collaboration form using the link below:\n` +
//     `${https://docs.google.com/forms/d/e/1FAIpQLSeMzv-TU9AhyJTuPBbSjA5p0burjApHJ8h7nleiCFCgi8lghQ/viewform?usp=sharing&ouid=103151575525760417542}\n\n` +
//     `*We highly appreciate your time and consideration.*\n\n` +
//     `Best regards,\n` +
//     `*Riphah International University*\n` +
//     `*CollaXion Team*`;

//   const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
//   window.open(url, "_blank");
// };

const sendWhatsApp = (phone, industryName) => {
  if (!phone || phone === "Not Available") {
    alert("Phone number not available for this industry.");
    return;
  }

  let formattedPhone = phone.replace(/[^0-9]/g, "");
  if (formattedPhone.startsWith("0")) formattedPhone = "92" + formattedPhone.slice(1);

  const message = `*Assalamu Alaikum ${industryName}*,\n\n` +
    `I hope this message finds you well.\n\n` +
    `On behalf of *Riphah International University* and our platform *CollaXion*, we would like to explore potential *collaboration opportunities* with your esteemed organization.\n\n` +
    `We kindly request you to fill out our collaboration form using the link below:\n` +
    `https://docs.google.com/forms/d/e/1FAIpQLSeMzv-TU9AhyJTuPBbSjA5p0burjApHJ8h7nleiCFCgi8lghQ/viewform?usp=sharing&ouid=103151575525760417542\n\n` +
    `*We highly appreciate your time and consideration.*\n\n` +
    `Best regards,\n` +
    `*Riphah International University*\n` +
    `*CollaXion Team*`;

  const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};



  const openWebsite = (website) => {
    if (!website || website === "N/A") {
      alert("Website not available for this industry.");
      return;
    }
    window.open(website, "_blank");
  };

  if (!isLoaded) return <div className="loading">Loading Google Maps...</div>;

  return (
    <div className="nearby-container">
      <style>{`
        .nearby-container { display:flex; height:100vh; background-color:#f3f4f6; font-family:Segoe UI,sans-serif; }
        .sidebar { width:420px; overflow-y:auto; padding:20px; background:white; border-right:2px solid #eee; box-shadow:0 0 15px rgba(0,0,0,0.1);}
        .sidebar h2 { font-size:24px; font-weight:bold; margin-bottom:20px; color:#193648; }
        .industry-card { border:1px solid #ddd; border-radius:15px; padding:15px; margin-bottom:15px; cursor:pointer; transition:0.3s; }
        .industry-card:hover { background:#f9fafb; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
        .industry-card h3 { font-size:18px; font-weight:600; color:#193648; margin-bottom:5px; }
        .industry-card p { font-size:14px; color:#444; margin:3px 0; }
        .btn { width:100%; margin-top:10px; padding:10px; border:none; border-radius:10px; font-weight:500; cursor:pointer; transition:0.2s; }
        .btn-whatsapp { background:#25D366; color:white; }
        .btn-whatsapp:hover { background:#1ebe57; }
        .btn-website { background:#2563eb; color:white; }
        .btn-website:hover { background:#194a99; }
        .loading { text-align:center; margin-top:20px; color:gray; }
        .error { color:red; }
      `}</style>

      <div className="sidebar">
        <h2>Nearby Tech Companies</h2>

        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {industries.map((ind) => (
          <div
            key={ind._id}
            className="industry-card"
            onClick={() => setSelectedIndustry(ind)}
          >
            <h3>{ind.name}</h3>
            <p><b>Address:</b> {ind.address}</p>
            <p><b>Phone:</b> {ind.phone}</p>
            <p><b>Distance:</b> {ind.distanceKm} km away</p>
            <p><b>Rating:</b> ⭐ {ind.rating}</p>

            <button
              className="btn btn-whatsapp"
              onClick={() => sendWhatsApp(ind.phone, ind.name)}
            >
              Send Form via WhatsApp
            </button>
            <button
              className="btn btn-website"
              onClick={() => openWebsite(ind.website)}
            >
              Visit Website
            </button>
          </div>
        ))}
      </div>

      {/* <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={13}
      >
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
            <div>
              <h3 style={{ color: "#193648" }}>{selectedIndustry.name}</h3>
              <p>{selectedIndustry.address}</p>
              <p>📞 {selectedIndustry.phone}</p>
              <p>⭐ {selectedIndustry.rating}</p>
              {selectedIndustry.website && (
                <p>
                  🌐 <a href={selectedIndustry.website} target="_blank">{selectedIndustry.website}</a>
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap> */}


      <GoogleMap
  mapContainerStyle={containerStyle}
  center={userLocation || defaultCenter}
  zoom={13}
>
  {/* User Location Marker */}
  {userLocation && (
    <Marker
      position={userLocation}
      icon={{
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(40, 40),
      }}
      title="Your Location"
    />
  )}

  {/* Industries Markers */}
  {industries.map((ind) => (
    <Marker
      key={ind._id}
      position={ind.location}
      onClick={() => setSelectedIndustry(ind)}
      icon={{
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new window.google.maps.Size(40, 40),
      }}
      title={ind.name}
    />
  ))}

  {selectedIndustry && (
    <InfoWindow
      position={selectedIndustry.location}
      onCloseClick={() => setSelectedIndustry(null)}
    >
      <div>
        <h3 style={{ color: "#193648" }}>{selectedIndustry.name}</h3>
        <p>{selectedIndustry.address}</p>
        <p>📞 {selectedIndustry.phone}</p>
        <p>⭐ {selectedIndustry.rating}</p>
        {selectedIndustry.website && (
          <p>
            🌐 <a href={selectedIndustry.website} target="_blank">{selectedIndustry.website}</a>
          </p>
        )}
      </div>
    </InfoWindow>
  )}
</GoogleMap>

    </div>
  );
}





// mockdata

// import React, { useEffect, useState } from "react";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useJsApiLoader,
// } from "@react-google-maps/api";

// const containerStyle = { width: "100%", height: "100%" };
// const defaultCenter = { lat: 31.5204, lng: 74.3587 };

// // Haversine formula
// const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// export default function NearbyIndustries() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [industries, setIndustries] = useState([]);
//   const [selectedIndustry, setSelectedIndustry] = useState(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });

//   // Mock Data
//   const mockIndustries = [
//     {
//       _id: "1",
//       name: "Riphah Tech Solutions",
//       address: "123 Tech Street, Islamabad",
//       location: { lat: 33.6844, lng: 73.0479 },
//       phone: "03125603393",
//       website: "https://riphahtech.com",
//       rating: 4.5,
//     },
//     {
//       _id: "2",
//       name: "Jamil IT Services",
//       address: "456 Digital Avenue, Lahore",
//       location: { lat: 31.5204, lng: 74.3587 },
//       phone: "03135121353",
//       website: "https://jamilit.com",
//       rating: 4.2,
//     },
//     {
//       _id: "3",
//       name: "Creative Soft Labs",
//       address: "789 Innovation Blvd, Karachi",
//       location: { lat: 24.8607, lng: 67.0011 },
//       phone: "03178811298",
//       website: "https://creativesoft.com",
//       rating: 4.7,
//     },
//     {
//       _id: "4",
//       name: "NextGen IT",
//       address: "101 Tech Park, Faisalabad",
//       location: { lat: 31.4180, lng: 73.0770 },
//       phone: "03164004701",
//       website: "https://nextgenit.com",
//       rating: 4.3,
//     },
//   ];

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
//         setUserLocation(loc);

//         // Add distance to each mock industry
//         const updated = mockIndustries.map((ind) => ({
//           ...ind,
//           distanceKm: calculateDistanceKm(
//             loc.lat,
//             loc.lng,
//             ind.location.lat,
//             ind.location.lng
//           ).toFixed(2),
//         }));
//         setIndustries(updated);
//       },
//       () => {
//         setUserLocation(defaultCenter);
//         const updated = mockIndustries.map((ind) => ({
//           ...ind,
//           distanceKm: calculateDistanceKm(
//             defaultCenter.lat,
//             defaultCenter.lng,
//             ind.location.lat,
//             ind.location.lng
//           ).toFixed(2),
//         }));
//         setIndustries(updated);
//       }
//     );
//   }, []);

//   const sendWhatsApp = (phone, industryName) => {
//     if (!phone || phone === "Not Available") {
//       alert("Phone number not available for this industry.");
//       return;
//     }

//     let formattedPhone = phone.replace(/[^0-9]/g, "");
//     if (formattedPhone.startsWith("0"))
//       formattedPhone = "92" + formattedPhone.slice(1);

//     const message = `*Assalamu Alaikum ${industryName}*,\n\n` +
//       `I hope this message finds you well.\n\n` +
//       `On behalf of *Riphah International University* and our platform *CollaXion*, we would like to explore potential *collaboration opportunities* with your esteemed organization.\n\n` +
//       `We kindly request you to fill out our collaboration form using the link below:\n` +
//       `https://docs.google.com/forms/d/e/1FAIpQLSeMzv-TU9AhyJTuPBbSjA5p0burjApHJ8h7nleiCFCgi8lghQ/viewform?usp=sharing\n\n` +
//       `*We highly appreciate your time and consideration.*\n\n` +
//       `Best regards,\n` +
//       `*Riphah International University*\n` +
//       `*CollaXion Team*`;

//     const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
//     window.open(url, "_blank");
//   };

//   const openWebsite = (website) => {
//     if (!website || website === "N/A") {
//       alert("Website not available for this industry.");
//       return;
//     }
//     window.open(website, "_blank");
//   };

//   if (!isLoaded) return <div>Loading Google Maps...</div>;

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       <div style={{ width: "420px", overflowY: "auto", padding: "20px", background: "white" }}>
//         <h2>Nearby Tech Companies</h2>
//         {industries.map((ind) => (
//           <div key={ind._id} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "15px", marginBottom: "15px" }}>
//             <h3>{ind.name}</h3>
//             <p><b>Address:</b> {ind.address}</p>
//             <p><b>Phone:</b> {ind.phone}</p>
//             <p><b>Distance:</b> {ind.distanceKm} km away</p>
//             <p><b>Rating:</b> ⭐ {ind.rating}</p>
//             <button onClick={() => sendWhatsApp(ind.phone, ind.name)} style={{ width: "100%", marginTop: "5px", padding: "10px", background: "#25D366", color: "white", border: "none", borderRadius: "5px" }}>
//               Send Form via WhatsApp
//             </button>
//             <button onClick={() => openWebsite(ind.website)} style={{ width: "100%", marginTop: "5px", padding: "10px", background: "#193648", color: "white", border: "none", borderRadius: "5px" }}>
//               Visit Website
//             </button>
//           </div>
//         ))}
//       </div>

//       <GoogleMap
//         mapContainerStyle={{ width: "100%", height: "100%" }}
//         center={userLocation || defaultCenter}
//         zoom={13}
//       >
//         {industries.map((ind) => (
//           <Marker key={ind._id} position={ind.location} onClick={() => setSelectedIndustry(ind)} />
//         ))}

//         {selectedIndustry && (
//           <InfoWindow position={selectedIndustry.location} onCloseClick={() => setSelectedIndustry(null)}>
//             <div>
//               <h3>{selectedIndustry.name}</h3>
//               <p>{selectedIndustry.address}</p>
//               <p>📞 {selectedIndustry.phone}</p>
//               <p>⭐ {selectedIndustry.rating}</p>
//               {selectedIndustry.website && (
//                 <p>🌐 <a href={selectedIndustry.website} target="_blank">{selectedIndustry.website}</a></p>
//               )}
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     </div>
//   );
// }

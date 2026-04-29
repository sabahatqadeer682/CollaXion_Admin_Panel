

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
//           background-color: #1511111803d;
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
//           color: #6b721111180;
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
//   const dLat = ((lat2 - lat1) * Math.PI) / 1111180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 1111180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 1111180) *
//       Math.cos((lat2 * Math.PI) / 1111180) *
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
import LiaisonNavbar from "../components/LiaisonNavbar";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Autocomplete,
  Circle,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 31.5204, lng: 74.3587 };

// Premium navy-tinted map style - gives the map a calm, brand-aligned look
// while keeping roads and labels easily readable.
const premiumMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f8fc" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#3A70B0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9d8eb" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#193648" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dff1e3" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#3a8a4f" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e2eef9" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#3A70B0" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dbe8f7" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#aac3fc" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#193648" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e2eef9" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#3A70B0" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#aac3fc" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#193648" }] },
];

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
  const [radiusKm, setRadiusKm] = useState(10);
  const [usingGps, setUsingGps] = useState(false);
  const [locating, setLocating] = useState(false);
  const [manualPlaceLabel, setManualPlaceLabel] = useState(() => {
    try { return localStorage.getItem("collaxion.nearby.areaLabel") || ""; } catch { return ""; }
  });
  const [areaLabel, setAreaLabel] = useState({ short: "", full: "" });
  const [showMyInfo, setShowMyInfo] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [mapType, setMapType] = useState("roadmap");
  const acRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const trafficLayerRef = React.useRef(null);

  const handleRecenter = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(14);
    }
  };

  const cycleMapType = () => {
    if (!mapRef.current) return;
    const order = ["roadmap", "satellite", "hybrid", "terrain"];
    const next = order[(order.indexOf(mapType) + 1) % order.length];
    setMapType(next);
    mapRef.current.setMapTypeId(next);
  };

  // Toggle traffic overlay on/off.
  React.useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;
    if (showTraffic) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new window.google.maps.TrafficLayer();
      }
      trafficLayerRef.current.setMap(mapRef.current);
    } else if (trafficLayerRef.current) {
      trafficLayerRef.current.setMap(null);
    }
  }, [showTraffic]);

  // Saved manual location takes priority (rehydrates on refresh)
  const savedManual = (() => {
    try {
      const v = localStorage.getItem("collaxion.nearby.location");
      if (!v) return null;
      const parsed = JSON.parse(v);
      if (Number.isFinite(parsed?.lat) && Number.isFinite(parsed?.lng)) return parsed;
    } catch {}
    return null;
  })();

  // Reverse-geocode lat/lng into a human-readable area name (e.g.
  // "DHA Phase 2, Islamabad, Pakistan").
  const reverseGeocode = (lat, lng) => {
    if (!window.google?.maps?.Geocoder) return;
    try {
      const g = new window.google.maps.Geocoder();
      g.geocode({ location: { lat, lng } }, (results, status) => {
        if (status !== "OK" || !results?.length) return;
        // Prefer a neighborhood/sublocality, then street address as the
        // "short" label; full formatted address as the "full" label.
        const pickType = (types) =>
          results.find((r) => r.types.some((t) => types.includes(t)));
        const r1 =
          pickType(["neighborhood"]) ||
          pickType(["sublocality", "sublocality_level_1"]) ||
          pickType(["route", "street_address"]) ||
          pickType(["locality"]) ||
          results[0];
        setAreaLabel({
          short: r1?.formatted_address?.split(",")[0]?.trim() || "Your area",
          full:  r1?.formatted_address || "",
        });
      });
    } catch (_) { /* silent */ }
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Detect the user's actual GPS location and search around THAT point.
  // Tries high-accuracy first, then falls back to low-accuracy (network IP)
  // so it still works on desktops without GPS.
  const detectMyLocation = () => {
    if (!navigator.geolocation) {
      setUsingGps(false);
      setUserLocation(defaultCenter);
      fetchIndustries(defaultCenter, radiusKm);
      setError("Geolocation not supported by this browser. Showing default area.");
      return;
    }
    setLocating(true);

    const onSuccess = (pos) => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setUsingGps(true);
      setLocating(false);
      setError(null);
      setUserLocation(loc);
      reverseGeocode(loc.lat, loc.lng);
      fetchIndustries(loc, radiusKm);
    };

    // Use Google's Geolocation API first (most accurate IP-based provider -
    // same database Maps uses), then fall back to public IP services.
    const tryIpLocation = async () => {
      const gKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      // 1. Google Geolocation web service (https://developers.google.com/maps/documentation/geolocation/overview)
      if (gKey) {
        try {
          const r = await fetch(
            `https://www.googleapis.com/geolocation/v1/geolocate?key=${gKey}`,
            { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }
          );
          if (r.ok) {
            const j = await r.json();
            const lat = j?.location?.lat;
            const lng = j?.location?.lng;
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              return { lat, lng, city: "" /* will be filled by reverse-geocode */ };
            }
          }
        } catch (_) { /* fall through */ }
      }
      // 2. Public IP geolocation providers (ordered by reliability)
      const providers = [
        { url: "https://ipapi.co/json/",  pick: (j) => ({ lat: j.latitude, lng: j.longitude, city: j.city || j.region }) },
        { url: "https://ipwho.is/",       pick: (j) => j.success === false ? null : ({ lat: j.latitude, lng: j.longitude, city: j.city || j.region }) },
        { url: "https://get.geojs.io/v1/ip/geo.json", pick: (j) => ({ lat: parseFloat(j.latitude), lng: parseFloat(j.longitude), city: j.city || j.region }) },
      ];
      for (const p of providers) {
        try {
          const r = await fetch(p.url);
          if (!r.ok) continue;
          const j = await r.json();
          const out = p.pick(j);
          if (out && Number.isFinite(out.lat) && Number.isFinite(out.lng)) return out;
        } catch (_) { /* try next */ }
      }
      return null;
    };

    const onFinalFail = async (err) => {
      const ip = await tryIpLocation();
      if (ip) {
        setUsingGps(true);
        setLocating(false);
        setUserLocation({ lat: ip.lat, lng: ip.lng });
        setAreaLabel({ short: ip.city || "Your area", full: ip.city || "" });
        reverseGeocode(ip.lat, ip.lng);
        setError(null);
        fetchIndustries({ lat: ip.lat, lng: ip.lng }, radiusKm);
        return;
      }

      setUsingGps(false);
      setLocating(false);
      setUserLocation(defaultCenter);
      fetchIndustries(defaultCenter, radiusKm);
      const codeMsg = {
        1: "Location permission denied. Click the 🔒 in the address bar → Site settings → allow Location, then refresh.",
        2: "GPS unavailable & IP lookup blocked. Connect Wi-Fi (helps Chrome locate) or check your network.",
        3: "Location lookup timed out. Check your internet/Wi-Fi and try again.",
      }[err?.code] || "Couldn't detect your location. Showing default area.";
      setError(codeMsg);
    };

    // ── Force-precise mode (Option 2) ──
    // Long timeout + force-fresh + force-high-accuracy → maximises the
    // chance of Chrome triangulating via Wi-Fi networks on desktop. We
    // retry up to 2 times with progressively longer waits before giving
    // up to IP-based fallback.
    let attempts = 0;
    const tryPrecise = () => {
      attempts++;
      const TIMEOUT = attempts === 1 ? 25000 : 35000;
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        (e) => {
          // If Wi-Fi triangulation hasn't arrived yet but we still have
          // a retry budget, try again with a longer timeout.
          if (attempts < 2 && e?.code !== 1) {
            tryPrecise();
            return;
          }
          // Code 1 (denied) → finalize. Anything else → IP fallback.
          onFinalFail(e);
        },
        {
          enableHighAccuracy: true,
          timeout: TIMEOUT,
          maximumAge: 0,        // force a fresh fix, don't reuse cached
        }
      );
    };
    tryPrecise();
  };

  useEffect(() => {
    // Always auto-detect - manual picker has been removed per user preference.
    try {
      localStorage.removeItem("collaxion.nearby.location");
      localStorage.removeItem("collaxion.nearby.areaLabel");
    } catch {}
    detectMyLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch whenever the radius changes (after we already know the location)
  useEffect(() => {
    if (userLocation) fetchIndustries(userLocation, radiusKm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radiusKm]);

  const fetchIndustries = async (loc, r = radiusKm) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(
        "http://localhost:5000/api/industries/fetch-from-google",
        {
          lat: loc.lat,
          lng: loc.lng,
          radius: r,
        }
      );

      // calculate accurate distance from the search center, then keep ONLY
      // industries within the requested radius (sorted closest-first).
      const updatedIndustries = res.data.industries
        .map((ind) => {
          const ilat = Number(ind?.location?.lat);
          const ilng = Number(ind?.location?.lng);
          if (!Number.isFinite(ilat) || !Number.isFinite(ilng)) return null;
          const km = calculateDistanceKm(loc.lat, loc.lng, ilat, ilng);
          return { ...ind, distanceKm: km.toFixed(2), _distNum: km };
        })
        .filter((ind) => ind && Number.isFinite(ind._distNum) && ind._distNum <= r)
        .sort((a, b) => a._distNum - b._distNum);

      setIndustries(updatedIndustries);

      if (!updatedIndustries.length)
        setError(`No tech companies found within ${r} km. Try widening the radius.`);
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
    <>
    <LiaisonNavbar />
    <div className="nearby-container">
      <style>{`
        .nearby-container { display:flex; height: calc(100vh - 60px); background-color:#f3f4f6; font-family:Segoe UI,sans-serif; }
        .sidebar { width:420px; overflow-y:auto; padding:20px; background:white; border-right:2px solid #eee; box-shadow:0 0 15px rgba(0,0,0,0.1);}
        .sidebar h2 { font-size:24px; font-weight:bold; margin-bottom:20px; color:#193648; }
        .industry-card { border:1px solid #ddd; border-radius:15px; padding:15px; margin-bottom:15px; cursor:pointer; transition:0.3s; }
        .industry-card:hover { background:#f9fafb; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
        .industry-card h3 { font-size:18px; font-weight:600; color:#193648; margin-bottom:5px; }
        .industry-card p { font-size:14px; color:#444; margin:3px 0; }
        .btn { width:100%; margin-top:10px; padding:10px; border:none; border-radius:10px; font-weight:500; cursor:pointer; transition:0.2s; }
        .btn-whatsapp { background:#25D366; color:white; }
        .btn-whatsapp:hover { background:#1ebe57; }
        .btn-website { background:#193648; color:white; box-shadow: 0 4px 12px rgba(25,54,72,0.22); }
        .btn-website:hover { background:#2C5F80; box-shadow: 0 8px 18px rgba(25,54,72,0.32); }
        .loading { text-align:center; margin-top:20px; color:gray; }
        .error { color:red; }
      `}</style>

      <div className="sidebar">
        <h2>Nearby Tech Companies</h2>

        {/* Radius filter - show only industries within the selected distance */}
        <div style={{
          background: "linear-gradient(180deg, #ffffff, #f8fbff)",
          border: "1px solid #E2EEF9", borderRadius: 12,
          padding: "12px 14px", marginBottom: 16,
          boxShadow: "0 4px 14px rgba(25,54,72,0.06)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase", color: "#3A70B0" }}>
              Search radius
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 800, color: "#fff",
              background: "#193648", padding: "3px 10px", borderRadius: 999,
              fontVariantNumeric: "tabular-nums",
              boxShadow: "0 4px 10px rgba(25,54,72,0.25)",
            }}>
              {radiusKm} km
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#193648", cursor: "pointer" }}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {[2, 5, 10, 15, 20].map((k) => {
              const active = radiusKm === k;
              return (
                <button
                  key={k}
                  onClick={() => setRadiusKm(k)}
                  style={{
                    padding: "4px 10px", borderRadius: 7,
                    border: `1px solid ${active ? "#193648" : "#E2EEF9"}`,
                    background: active ? "#193648" : "#fff",
                    color: active ? "#fff" : "#64748b",
                    fontSize: 11, fontWeight: 700, cursor: "pointer",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {k} km
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 8 }}>
            Showing <strong style={{ color: "#193648" }}>{industries.length}</strong> tech companies within <strong style={{ color: "#193648" }}>{radiusKm} km</strong>.
          </div>
        </div>

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


      <div style={{ position: "relative", flex: 1, height: "100%" }}>
      <GoogleMap
  mapContainerStyle={containerStyle}
  center={userLocation || defaultCenter}
  zoom={14}
  onLoad={(map) => { mapRef.current = map; }}
  onUnmount={() => { mapRef.current = null; }}
  options={{
    styles: premiumMapStyle,
    mapTypeId: mapType,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: false,
    fullscreenControl: true,
    scaleControl: true,
    rotateControl: true,
    gestureHandling: "greedy",
    clickableIcons: true,
    backgroundColor: "#f5f8fc",
    zoomControlOptions: { position: window.google?.maps?.ControlPosition?.RIGHT_CENTER },
    streetViewControlOptions: { position: window.google?.maps?.ControlPosition?.RIGHT_BOTTOM },
    fullscreenControlOptions: { position: window.google?.maps?.ControlPosition?.TOP_RIGHT },
  }}
>
  {/* Search-radius circle around user - visualises which area we are scanning */}
  {userLocation && (
    <Circle
      center={userLocation}
      radius={radiusKm * 1000}
      options={{
        fillColor: "#3A70B0",
        fillOpacity: 0.10,
        strokeColor: "#193648",
        strokeOpacity: 0.55,
        strokeWeight: 2,
        clickable: false,
        zIndex: 1,
      }}
    />
  )}

  {/* User Location Marker - hover to see your area details */}
  {userLocation && (
    <>
      <Marker
        position={userLocation}
        icon={{
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(44, 44),
        }}
        title="Your Location"
        onMouseOver={() => setShowMyInfo(true)}
        onMouseOut={() => setShowMyInfo(false)}
        onClick={() => setShowMyInfo((s) => !s)}
        zIndex={1000}
      />
      {showMyInfo && (
        <InfoWindow
          position={userLocation}
          onCloseClick={() => setShowMyInfo(false)}
          options={{ pixelOffset: new window.google.maps.Size(0, -36) }}
        >
          <div style={{ minWidth: 220, padding: "4px 6px 6px", fontFamily: "'Poppins', sans-serif" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 9px", borderRadius: 999,
              background: "#fee2e2", color: "#be123c",
              fontSize: 9.5, fontWeight: 800, letterSpacing: "0.10em",
              textTransform: "uppercase", marginBottom: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.25)" }} />
              You are here
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#193648", letterSpacing: "-0.005em" }}>
              {areaLabel.short || "Your location"}
            </div>
            {areaLabel.full && areaLabel.full !== areaLabel.short && (
              <div style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600, marginTop: 3, lineHeight: 1.4 }}>
                {areaLabel.full}
              </div>
            )}
            <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
              📍 {Number(userLocation.lat).toFixed(4)}, {Number(userLocation.lng).toFixed(4)}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
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

        {/* Floating control panel - Recenter / Map type / Traffic */}
        <div style={{
          position: "absolute", top: 14, left: 14, zIndex: 5,
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          <button
            onClick={handleRecenter}
            disabled={!userLocation}
            title="Recenter on my location"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "9px 14px", borderRadius: 10,
              background: "#193648", color: "#fff",
              border: "1px solid #122838",
              fontSize: 12.5, fontWeight: 700, letterSpacing: "0.02em",
              cursor: userLocation ? "pointer" : "not-allowed",
              opacity: userLocation ? 1 : 0.55,
              boxShadow: "0 8px 22px rgba(25,54,72,0.30)",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <span style={{ fontSize: 14 }}>📍</span> Recenter
          </button>
          <button
            onClick={cycleMapType}
            title="Toggle map type"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "9px 14px", borderRadius: 10,
              background: "#fff", color: "#193648",
              border: "1px solid #E2EEF9",
              fontSize: 12.5, fontWeight: 700, letterSpacing: "0.02em",
              cursor: "pointer", textTransform: "capitalize",
              boxShadow: "0 6px 16px rgba(25,54,72,0.10)",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <span style={{ fontSize: 14 }}>🗺️</span> {mapType}
          </button>
          <button
            onClick={() => setShowTraffic((v) => !v)}
            title="Toggle live traffic"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "9px 14px", borderRadius: 10,
              background: showTraffic ? "#dc2626" : "#fff",
              color: showTraffic ? "#fff" : "#193648",
              border: `1px solid ${showTraffic ? "#b91c1c" : "#E2EEF9"}`,
              fontSize: 12.5, fontWeight: 700, letterSpacing: "0.02em",
              cursor: "pointer",
              boxShadow: showTraffic
                ? "0 8px 22px rgba(220,38,38,0.30)"
                : "0 6px 16px rgba(25,54,72,0.10)",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <span style={{ fontSize: 14 }}>🚦</span> Traffic
          </button>
        </div>

        {/* Legend */}
        <div style={{
          position: "absolute", bottom: 18, left: 14, zIndex: 5,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(10px)",
          border: "1px solid #E2EEF9", borderRadius: 12,
          padding: "10px 14px",
          boxShadow: "0 8px 22px rgba(25,54,72,0.12)",
          fontFamily: "'Poppins', sans-serif",
          minWidth: 180,
        }}>
          <div style={{
            fontSize: 9.5, fontWeight: 800, color: "#3A70B0",
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8,
          }}>
            Map Legend
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              width: 12, height: 12, borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 0 3px rgba(239,68,68,0.20)",
            }} />
            <span style={{ fontSize: 11.5, color: "#193648", fontWeight: 600 }}>You are here</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              width: 12, height: 12, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 0 3px rgba(34,197,94,0.20)",
            }} />
            <span style={{ fontSize: 11.5, color: "#193648", fontWeight: 600 }}>Tech company</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 14, height: 14, borderRadius: 3,
              background: "rgba(58,112,176,0.18)",
              border: "2px solid #193648",
            }} />
            <span style={{ fontSize: 11.5, color: "#193648", fontWeight: 600 }}>{radiusKm} km radius</span>
          </div>
        </div>
      </div>

    </div>
    </>
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
//   const dLat = ((lat2 - lat1) * Math.PI) / 1111180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 1111180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 1111180) *
//       Math.cos((lat2 * Math.PI) / 1111180) *
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
//       location: { lat: 31.41111180, lng: 73.0770 },
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

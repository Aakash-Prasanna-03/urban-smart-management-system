import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { fetchRecentIssues } from "../api/issues";
import "leaflet/dist/leaflet.css";

// You may need to install leaflet: npm install react-leaflet leaflet

export default function Community() {
  const { user, loading: authLoading } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // default: India

  // Show loading if auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-200">Loading...</p>
      </div>
    );
  }

  // Fetch community issues
  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        const fetchedIssues = await fetchRecentIssues();
        setIssues(fetchedIssues);
        
        // If there are issues with locations, center map on first one
        const firstIssueWithLocation = fetchedIssues.find(issue => issue.location?.lat && issue.location?.lng);
        if (firstIssueWithLocation) {
          setMapCenter([firstIssueWithLocation.location.lat, firstIssueWithLocation.location.lng]);
        }
      } catch (error) {
        console.error("Failed to load issues:", error);
        // Fallback to dummy data in case of error
        const dummyIssues = [
          {
            _id: 1,
            title: "Garbage collection pending",
            description: "Street near park has garbage piling up.",
            location: { lat: 28.6139, lng: 77.209 },
          },
          {
            _id: 2,
            title: "Street light not working", 
            description: "Light is off since last week at 5th street.",
            location: { lat: 28.614, lng: 77.208 },
          },
        ];
        setIssues(dummyIssues);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Community Issues
      </h1>

      {!user && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          You are viewing as a guest. Login to report issues and see nearby reports.
        </p>
      )}

      {/* Map */}
      <div className="mb-6 w-full rounded-lg overflow-hidden shadow-lg relative z-0 h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
            <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
          </div>
        ) : (
          <MapContainer center={mapCenter} zoom={13} className="w-full h-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {issues
              .filter(issue => issue.location?.lat && issue.location?.lng)
              .map((issue) => (
                <Marker key={issue._id} position={[issue.location.lat, issue.location.lng]}>
                  <Popup>
                    <strong>{issue.title}</strong>
                    <br />
                    {issue.description}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        )}
      </div>

      {/* Issue list */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading issues...</p>
        ) : issues.length > 0 ? (
          issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
            >
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                {issue.title}
              </h2>
              {issue.image && (
                <img 
                  src={`http://localhost:5001/${issue.image}`}
                  alt="Issue"
                  className="w-full h-48 object-cover rounded-lg mt-2 mb-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <p className="text-gray-600 dark:text-gray-300">
                {issue.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Reported on: {new Date(issue.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No issues found.</p>
        )}
      </div>
    </div>
  );
}

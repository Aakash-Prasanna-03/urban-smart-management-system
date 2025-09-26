import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { fetchRecentIssues, upvoteIssue } from "../api/issues";
import "leaflet/dist/leaflet.css";

// You may need to install leaflet: npm install react-leaflet leaflet

export default function Community() {
  const { user, loading: authLoading } = useAuth();
  const [groupedIssues, setGroupedIssues] = useState([]);
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
        const response = await fetchRecentIssues();
        const fetchedGroups = response.data || [];
        setGroupedIssues(fetchedGroups);

        // Center map on first group location
        if (fetchedGroups.length > 0 && fetchedGroups[0].location?.lat && fetchedGroups[0].location?.lng) {
          setMapCenter([fetchedGroups[0].location.lat, fetchedGroups[0].location.lng]);
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
            {groupedIssues
              .filter(issue => issue.location?.lat && issue.location?.lng)
              .map((issue, idx) => (
                <Marker key={idx} position={[issue.location.lat, issue.location.lng]}>
                  <Popup>
                    <strong>{issue.title}</strong>
                    <br />
                    {issue.description}
                    <div>Upvotes: {issue.upvoteCount}</div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        )}
      </div>

      {/* Issue list (grouped as single issue) */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading issues...</p>
        ) : groupedIssues.length > 0 ? (
          groupedIssues.map((issue, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                Location: {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
              </h2>
              <div className="mb-2">Upvotes: {issue.upvoteCount}</div>
              {/* Show main issue title/description only */}
              {(() => {
                const titles = issue.title.split(' / ');
                const descriptions = issue.description.split(' | ');
                return <><strong>{titles[0]}</strong><div className="text-gray-600 dark:text-gray-300 mb-2">{descriptions[0]}</div></>;
              })()}
              {issue.image && (
                <img 
                  src={`http://localhost:5001/${issue.image}`}
                  alt="Issue"
                  className="w-full h-32 object-cover rounded-lg mt-2 mb-2"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="flex items-center gap-2">
                {/* Upvote button for grouped issue */}
                {user && !issue.upvotes?.includes(user.uid) && (
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={async () => {
                      await upvoteIssue(issue._id, user.uid);
                      // Refresh issues after upvote
                      const response = await fetchRecentIssues();
                      setGroupedIssues(response.data || []);
                    }}
                  >
                    Upvote
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No issues found.</p>
        )}
      </div>
    </div>
  );
}

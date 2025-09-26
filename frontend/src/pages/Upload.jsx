import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // make sure path is correct
import { addIssue } from "../api/issues";
import { Navigate } from "react-router-dom";

export default function Upload({ refreshReports }) {
  const { user, loading: authLoading } = useAuth(); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const problemOptions = [
    "Garbage Collection",
    "Water Leakage",
    "Street Light Not Working",
    "Road Damage",
    "Public Safety",
    "Other",
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-200">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            You need to login first!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Redirecting to login page...
          </p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toString());
        setLng(pos.coords.longitude.toString());
        setLoadingLocation(false);
      },
      (err) => {
        console.error(err);
        alert("Unable to fetch location. Please allow location access.");
        setLoadingLocation(false);
      }
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("You can upload up to 3 images only.");
      return;
    }
    setImages(files.slice(0, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
    formData.append("title", category || "other");
    formData.append("description", description);
    formData.append("category", category || "other");
  formData.append("userId", user.id || user._id || Date.now().toString());
  formData.append("userEmail", user.email);
      
      // Add location
      formData.append("location[lat]", lat || "0");
      formData.append("location[lng]", lng || "0");
      
      // Add first image if any
      if (images && images.length > 0) {
        formData.append("image", images[0]);
      }

      await addIssue(formData);

      // Reset form
      setTitle("");
      setDescription("");
      setLat("");
      setLng("");
      setImages([]);

      alert("Issue reported successfully!");

      if (refreshReports) refreshReports();
    } catch (error) {
      console.error("Failed to submit issue:", error);
      alert("Failed to report issue. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex justify-center items-center py-12 px-2">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-indigo-100 dark:border-indigo-700 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-6 tracking-tight text-center drop-shadow-lg">Report an Issue</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Problem Type *
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a problem
              </option>
              {problemOptions.map((problem, idx) => (
                <option key={idx} value={problem.toLowerCase().replace(/ /g, "-")}> {/* Use slug for category */}
                  {problem}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              placeholder="Please describe the issue in detail..."
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Images (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-200"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location *
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleLocation}
                disabled={loadingLocation}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition disabled:opacity-50"
              >
                {loadingLocation ? "Fetching Location..." : "Use My Location"}
              </button>
              <span className="text-gray-500 dark:text-gray-400">or</span>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full px-2 py-1 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm"
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full px-2 py-1 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !lat || !lng}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

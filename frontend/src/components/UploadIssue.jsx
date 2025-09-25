import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MapPin } from "lucide-react";
import { addIssue } from "../api/issues";
import { useAuth } from "../context/AuthContext";

export default function UploadIssue() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          alert("Location captured successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to capture location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    console.log('=== HANDLE SUBMIT CALLED ===');
    console.log('Event:', e);
    e.preventDefault();
    
    console.log('Form values:', { title, desc, user, location, file });
    
    if (!title.trim() || !desc.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    if (!user) {
      alert("Please login to report issues");
      return;
    }

    if (!user || !user.id || !user.email) {
      console.log('User validation failed:', user);
      alert("Invalid user session. Please log out and log in again.");
      return;
    }

    console.log('Current user:', user);

    setIsSubmitting(true);
    try {
      console.log('Creating FormData...');
      const formData = new FormData();
      
      console.log('Appending title:', title);
      formData.append("title", title);
      
      console.log('Appending description:', desc);  
      formData.append("description", desc);
      
      console.log('User object:', user);
      console.log('User ID:', user.id, typeof user.id);
      console.log('User email:', user.email, typeof user.email);
      
      formData.append("userId", String(user.id));
      formData.append("userEmail", user.email);
      
      console.log('Form data being sent:', {
        title,
        description: desc,
        userId: user.id,
        userEmail: user.email,
        hasFile: !!file,
        location
      });
      
      if (file) {
        formData.append("image", file);
      }
      
      if (location) {
        formData.append("location[lat]", location.lat);
        formData.append("location[lng]", location.lng);
      } else {
        // Default location if not provided
        formData.append("location[lat]", "0");
        formData.append("location[lng]", "0");
      }

      // Debug FormData contents
      console.log('=== FormData Contents ===');
      console.log('FormData type:', typeof formData);
      console.log('FormData constructor:', formData.constructor.name);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      console.log('About to call addIssue...');
      await addIssue(formData);
      
      // Reset form
      setTitle("");
      setDesc("");
      setFile(null);
      setLocation(null);
      
      alert("Issue reported successfully!");
    } catch (error) {
      console.error("Error submitting issue:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to submit issue: ${error.response?.data?.message || error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Report an Issue</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded-xl space-y-4 bg-gray-50 shadow">
        <input
          type="text"
          placeholder="Issue title..."
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="block"
        />
        <textarea
          placeholder="Describe the issue..."
          className="w-full border rounded p-2"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <Button type="button"><Mic className="mr-2 h-4 w-4" /> Record Voice</Button>
        <Button type="button" onClick={handleLocationCapture}>
          <MapPin className="mr-2 h-4 w-4" /> 
          {location ? "Location Captured ✓" : "Auto-Capture Location"}
        </Button>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </div>
  );
}

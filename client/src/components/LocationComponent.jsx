import { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const LocationComponent = () => {
  const [location, setLocation] = useState("Fetching location...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse Geocoding using OpenStreetMap API (free, no key required)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();

            if (data && data.address) {
              const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "Unknown City";
              const country = data.address.country || "Unknown Country";
              setLocation(`${city}, ${country}`);
            } else {
              setLocation("Location not found");
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation("Unable to retrieve location");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  return (
    <div className="flex items-center gap-4 border-t border-gray-300 pt-4">
      <FaMapMarkerAlt className="text-orange-500" />
      <span className="font-semibold">Location:</span>
      <span>{location}</span>
    </div>
  );
};

export default LocationComponent;

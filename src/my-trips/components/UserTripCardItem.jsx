import React, { useEffect, useState } from 'react';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';

// Fallback images for when the API images fail or are missing
const fallbackTripImages = [
  'https://loremflickr.com/800/600/travel?lock=1',
  'https://loremflickr.com/800/600/adventure?lock=2',
  'https://loremflickr.com/800/600/landscape?lock=3',
  'https://loremflickr.com/800/600/destination?lock=4',
  'https://loremflickr.com/800/600/vacation?lock=5',
];

// Utility to pick a random fallback image
const getRandomFallback = () => {
  const randomIndex = Math.floor(Math.random() * fallbackTripImages.length);
  return fallbackTripImages[randomIndex];
};

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(getRandomFallback());
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (trip) {
      GetPlacePhotos();
    }
  }, [trip]);

  const GetPlacePhotos = async () => {
    const address = trip?.tripData?.place?.formatted_address; // Use the place's formatted address
    if (!address) {
      console.warn("No address found for place query");
      setIsLoading(false); // Stop loading if there's no address
      return;
    }

    const data = { textQuery: address };

    try {
      const response = await GetPlaceDetails(data);
      console.log("API Response:", response);

      const photoName = response.data?.places?.[0]?.photos?.[0]?.name;
      console.log("Photo Name:", photoName);

      if (photoName) {
        const url = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=600&maxWidthPx=600&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
        setPhotoUrl(url);
      } else {
        console.warn("No photo available for this place.");
        setPhotoUrl(getRandomFallback()); // Fallback to random placeholder image if no photo found
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Handle rate limit (HTTP 429)
        console.warn("Rate limit exceeded. Retrying...");
        retryFetch(); // Retry after a delay
      } else {
        console.error("API error:", error.response?.data || error.message);
        setPhotoUrl(getRandomFallback()); // Fallback to random placeholder on other errors
      }
    }
  };

  // Retry logic for rate limit (HTTP 429)
  const retryFetch = () => {
    setTimeout(() => {
      console.log("Retrying request...");
      GetPlacePhotos(); // Retry after 2 seconds
    }, 2000); // Adjust delay as needed (e.g., exponential backoff can be applied)
  };

  return (
    <Link to={'/view-trip/' + trip?.id}>
      <div className="hover:scale-105 transition-all">
        <img
          src={photoUrl || getRandomFallback()} // Fallback to a random image if no photoUrl
          className="object-cover rounded-xl"
          alt="Place"
          onLoad={() => setIsLoading(false)} // Stop loading when image is loaded
        />
        <div>
          <h2 className="font-bold text-lg">
            {trip?.tripData?.place?.formatted_address}
          </h2>
          <h2 className="text-sm text-gray-500">
            {trip?.tripData?.tripData?.travelPlan?.duration} trip
          </h2>
          <h2 className="text-sm text-gray-500">
            {trip?.tripData?.tripData?.travelPlan?.budget} budget
          </h2>
          <h2 className="text-sm text-gray-500">
            Travelers: {trip?.userSelection?.Travelers}
          </h2>
        </div>
        {isLoading && <div className="loading-spinner">Loading...</div>} {/* Optional: Display loading spinner */}
      </div>
    </Link>
  );
}

export default UserTripCardItem;

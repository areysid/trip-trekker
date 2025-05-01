// import React, { useEffect, useState } from 'react';
// import { GetPlaceDetails } from '@/service/GlobalApi';
// import { Link } from 'react-router-dom';

// // Fallback images for when the API images fail or are missing
// const fallbackTripImages = [
//   'placeholder1.avif' // Add more placeholders if needed
// ];

// // Utility to pick a random fallback image
// const getRandomFallback = () => {
//   const randomIndex = Math.floor(Math.random() * fallbackTripImages.length);
//   return fallbackTripImages[randomIndex];
// };

// function UserTripCardItem({ trip }) {
//   const [photoUrl, setPhotoUrl] = useState(getRandomFallback()); // Start with a fallback image
//   const [isLoading, setIsLoading] = useState(true); // Track loading state
//   const [retryCount, setRetryCount] = useState(0); // Track retry attempts

//   useEffect(() => {
//     if (trip) {
//       GetPlacePhotos();
//     }
//   }, [trip]);

//   const GetPlacePhotos = async () => {
//     const address = trip?.tripData?.place?.formatted_address; // Use the place's formatted address
//     if (!address) {
//       console.warn("No address found for place query");
//       setIsLoading(false); // Stop loading if there's no address
//       return;
//     }

//     const data = { textQuery: address };

//     try {
//       const response = await GetPlaceDetails(data);
//       console.log("API Response:", response);

//       const photoName = response.data?.places?.[0]?.photos?.[3]?.name;
//       console.log("Photo Name:", photoName);

//       if (photoName) {
//         const url = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=600&maxWidthPx=600&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
//         setPhotoUrl(url); // Only update photoUrl if the API returns a valid photo URL
//       } else {
//         console.warn("No photo available for this place.");
//         // If no photo is available, keep the fallback image
//         setPhotoUrl(getRandomFallback());
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 429) {
//         // Handle rate limit (HTTP 429)
//         console.warn("Rate limit exceeded. Retrying...");
//         if (retryCount < 3) {
//           // Retry up to 3 times
//           setRetryCount(retryCount + 1);
//           retryFetch(); // Retry after a delay
//         } else {
//           // After multiple retries, fallback to placeholder
//           console.warn("Max retries reached. Fallback to placeholder.");
//           setPhotoUrl(getRandomFallback()); // Fallback after retry attempts are exhausted
//         }
//       } else {
//         // Handle other errors, fallback to the placeholder image
//         console.error("API error:", error.response?.data || error.message);
//         setPhotoUrl(getRandomFallback()); // Fallback to random placeholder on any other error
//       }
//     }
//   };

//   // Retry logic for rate limit (HTTP 429)
//   const retryFetch = () => {
//     setTimeout(() => {
//       console.log("Retrying request...");
//       GetPlacePhotos(); // Retry after 2 seconds
//     }, 2000); // Adjust delay as needed (e.g., exponential backoff can be applied)
//   };

//   return (
//     <Link to={'/view-trip/' + trip?.id}>
//       <div className="hover:scale-105 transition-all">
//         <img
//           src={photoUrl} // Always use the photoUrl (fallback or API image)
//           className="object-cover rounded-xl"
//           alt="Place"
//           onLoad={() => setIsLoading(false)} // Stop loading when image is loaded
//         />
//         <div>
//           <h2 className="font-bold text-lg">
//             {trip?.tripData?.place?.formatted_address}
//           </h2>
//           <h2 className="text-sm text-gray-500">
//             {trip?.tripData?.tripData?.travelPlan?.duration} trip
//           </h2>
//           <h2 className="text-sm text-gray-500">
//             {trip?.tripData?.tripData?.travelPlan?.budget} budget
//           </h2>
//           <h2 className="text-sm text-gray-500">
//             Travelers: {trip?.userSelection?.Travelers}
//           </h2>
//         </div>
//         {isLoading && <div className="loading-spinner">Loading...</div>} {/* Optional: Display loading spinner */}
//       </div>
//     </Link>
//   );
// }

// export default UserTripCardItem;



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Fallback images from public/fallback/
const fallbackTripImages = [
  '/placeholder1.avif',
  '/placeholder2.jpg',
  '/placeholder3.jpg',
  '/placeholder4.avif'
];

// Utility to pick a random fallback image
const getRandomFallback = () => {
  const randomIndex = Math.floor(Math.random() * fallbackTripImages.length);
  return fallbackTripImages[randomIndex];
};

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(getRandomFallback()); // Random fallback image
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Using a random placeholder image for now
    console.log("Using placeholder image for now");
  }, [trip]);

  return (
    <Link to={'/view-trip/' + trip?.id}>
      <div className="hover:scale-105 transition-all">
        <img
          src={photoUrl}
          className="object-cover rounded-xl"
          alt="Place"
          onLoad={() => setIsLoading(false)}
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
        {isLoading && <div className="loading-spinner">Loading...</div>}
      </div>
    </Link>
  );
}

export default UserTripCardItem;

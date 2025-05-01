import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails } from "@/service/GlobalApi";

// Fallback hotel images
const fallbackHotelImages = [
  'https://loremflickr.com/600/400/hotel,building?lock=101',
  'https://loremflickr.com/600/400/resort,room?lock=102',
  'https://loremflickr.com/600/400/interior,hotel?lock=103',
  'https://loremflickr.com/600/400/hotel,lobby?lock=104',
  'https://loremflickr.com/600/400/hotel,night?lock=105',
];

// Utility to pick a random fallback image
const getRandomFallback = () => {
  const randomIndex = Math.floor(Math.random() * fallbackHotelImages.length);
  return fallbackHotelImages[randomIndex];
};

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(getRandomFallback());

  useEffect(() => {
    if (hotel) {
      GetHotelPhoto();
    }
  }, [hotel]);

  const GetHotelPhoto = async () => {
    const data = {
      textQuery:
        hotel.hotelName && hotel.hotelAddress ||
        hotel.HotelName || hotel.HotelAddress ||
        hotel.name || hotel.address
    };

    try {
      const response = await GetPlaceDetails(data);
      const photoName = response.data?.places?.[0]?.photos?.[0]?.name;

      if (photoName) {
        const url = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=600&maxWidthPx=600&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
        setPhotoUrl(url);
      } else {
        console.warn("No photo found for hotel, using fallback");
        setPhotoUrl(getRandomFallback()); // Use a random fallback image
      }
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      setPhotoUrl(getRandomFallback()); // Fallback image on error
    }
  };

  const handleImageError = () => {
    setPhotoUrl(getRandomFallback()); // Switch to fallback image on error
  };

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotelName || hotel.HotelName || hotel.name}`}
      target="_blank"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img
          src={photoUrl}
          onError={handleImageError} // Set fallback image if loading fails
          className="rounded-xl h-[200px] w-full object-cover"
          alt={hotel.hotelName}
        />
        <div className="my-3 flex flex-col gap-2">
          <h2 className="font-medium">{hotel.hotelName || hotel.HotelName || hotel.name}</h2>
          <h2 className="text-xs text-gray-500">📍 {hotel.hotelAddress || hotel.HotelAddress || hotel.address}</h2>
          <h2 className="font-medium">⭐ {hotel.rating}</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from "@/service/GlobalApi";

// Fallback images for when API images fail or are missing
const fallbackPlaceImages = [
  '/fallback/f1.jpg',  // Update with your image names and extensions
  '/fallback/f2.jpg',
  '/fallback/f3.jpg',
  '/fallback/f4.jpg',
  '/fallback/f5.jpg',
  '/fallback/f6.jpg',
];

// Utility to pick a random fallback image
const getRandomFallback = () => {
  const randomIndex = Math.floor(Math.random() * fallbackPlaceImages.length);
  return fallbackPlaceImages[randomIndex];
};

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState(getRandomFallback());

  useEffect(() => {
    if (place) {
      GetPlacePhoto();
    }
  }, [place]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.placeName || place.placeAddress
    };

    try {
      const response = await GetPlaceDetails(data);
      const photoName = response.data?.places?.[0]?.photos?.[0]?.name;

      if (photoName) {
        const url = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=600&maxWidthPx=600&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
        setPhotoUrl(url);
      } else {
        console.warn("No photo found for place, using fallback");
        setPhotoUrl(getRandomFallback()); // Use a random fallback image
      }
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      setPhotoUrl(getRandomFallback()); // Fallback image on error
    }
  };

  const handleImageError = () => {
    setPhotoUrl(getRandomFallback());
  };

  return (
    <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
      <img
        src={photoUrl}
        alt={place.placeName}
        className='w-[130px] h-[130px] rounded-xl object-cover'
        onError={handleImageError} // Set fallback image if loading fails
      />
      <div>
        <h2 className='font-bold text-lg'>{place.placeName}</h2>
        <p className='text-sm text-gray-400'>{place.placeDetails}</p>
        <h2>{place.ticketPricing}</h2>
        <Link to={`https://www.google.com/maps/search/?api=1&query=${place.placeName}`} target='_blank'>
          <div className='mt-2'>
            <Button size="sm"><FaMapLocationDot /></Button>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default PlaceCardItem;

import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  // const placedata =
  //   trip?.tripData?.travelPlan?.tripData?.itinerary?.plan ||
  //   trip?.tripData?.trip?.itinerary ||
  //   trip?.tripData?.Itinerary ||
  //   trip?.tripData?.travelPlan?.dailyItinerary ||
  //   [];
  const placedata =
  trip?.tripData?.tripData?.travelPlan?.itinerary ||
  trip?.tripData?.trip?.itinerary ||
  trip?.tripData?.Itinerary ||
  trip?.tripData?.travelPlan?.dailyItinerary ||
  [];

  if (!Array.isArray(placedata)) {
    return (
      <div>
        <h2 className="font-bold text-xl mt-5">Places To Visit</h2>
        <p className="text-gray-500 mt-2">No itinerary data available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Places To Visit</h2>
      <div>
        {placedata.map((item, index) => (
          <div key={`day-${item.day || item.Day}`} className="mt-5">
            <h2 className="font-medium text-lg">Day {item.day || item.Day}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {item.plan.map((place, placeIndex) => (
                <div key={`place-${placeIndex}-${place.placeName}`}>
                  <h2 className="font-medium text-sm text-orange-600">
                    {place.timeToVisit}
                  </h2>
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
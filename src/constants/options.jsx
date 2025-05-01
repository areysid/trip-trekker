export const SelectTravelersList=[
    {
        id:1,
        title:'Just me',
        desc:'A solo traveler in exploration.',
        icon:'♡ ✈︎',
        people:'1'
    },
    {
        id:2,
        title:'A couple',
        desc:'Two travelers in tandem',
        icon:'🥂',
        people:'2 People'
    },
    {
        id:3,
        title:'Family',
        desc:'A group of fun loving adventure',
        icon:'🏡',
        people:'3 to 5 People'
    },
    {
        id:4,
        title:'Friends',
        desc:'A bunch of thrill-seekers',
        icon:'🏞️',
        people:'5 to 10 People'
    }
]

export const SelectBudgetOptions=[
    {
        id:1,
        title:'Cheap',
        desc:'Stay conscious of costs',
        icon:'💵'
    },
    {
        id:2,
        title:'Moderate',
        desc:'Keep costs on the average side',
        icon:'💰'
    },
    {
        id:3,
        title:'Luxury',
        desc:'Dont worry about the cost',
        icon:'💸'
    }
]

export const AI_PROMPT = `Generate a travel plan based on the following inputs:
Location: {location}
Total Days: {totalDays}
Traveler Type: {traveler}
Budget: {budget}

Produce the output *strictly* in the following JSON format. Adhere exactly to the specified key names, data types (string, number, map, array), and nesting structure as shown below. Remember to produce accurate output as defined below among multiple iterations and trips.

Make sure the output you generate properly goes through this code
const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();

    const sanitizedFormData = {
      ...formData,
      place: formData.place
        ? {
            formatted_address: formData.place.formatted_address || null,
            place_id: formData.place.place_id || null,
            name: formData.place.name || null,
            geometry: formData.place.geometry
              ? {
                  location: {
                    lat: formData.place.geometry.location?.lat?.() || null,
                    lng: formData.place.geometry.location?.lng?.() || null,
                  },
                }
              : null,
          }
        : null,
    };

    let parsedTripData;
    try {
      parsedTripData = JSON.parse(TripData);
    } catch (e) {
      console.error("Invalid JSON from AI:", TripData);
      toast.error("AI returned invalid data. Please try again.");
      setLoading(false);
      return;
    }

    try {
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: sanitizedFormData,
        tripData: parsedTripData,
        userEmail: user?.email || null,
        id: docId,
      });
      toast.success("Trip saved successfully!");
      navigate("/view-trip/" + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip.");
    } finally {
      setLoading(false);
    }
  };

**Required JSON Structure:**

{
  "id": "(string) - Generate a unique string identifier (e.g., using timestamp)",
  "tripData": { // map
    "travelPlan": { // map
      "budget": "(string) - The specified {budget}",
      "duration": "(string) - Formatted string like '{totalDays} Days'",
      "hotels": [ // array of maps
        {
          "description": "(string) - Description of the hotel.",
          "geoCoordinates": { // map
            "latitude": "(string) - Latitude coordinate.",
            "longitude": "(string) - Longitude coordinate."
          },
          "hotelAddress": "(string) - Full address of the hotel.",
          "hotelImageUrl": "(string) - A valid URL to an image of the hotel.",
          "hotelName": "(string) - Name of the hotel.",
          "price": "(string) - Estimated price range (e.g., '$150-250', '$1000+').",
          "rating": "(string) - Hotel rating (e.g., '4.5')."
        }
        // Include 2-3 relevant hotel options matching the budget
      ],
      "itinerary": [ // array of maps
        {
          "day": "(number) - The day number (e.g., 1, 2, ... {totalDays})",
          "plan": [ // array of maps
            {
              "geoCoordinates": { // map
                "latitude": "(string) - Latitude coordinate of the place.",
                "longitude": "(string) - Longitude coordinate of the place."
              },
              "placeDetails": "(string) - Details or description of the activity/place.",
              "placeImageUrl": "(string) - A valid URL to an image of the place/activity.",
              "placeName": "(string) - Name of the place or activity.",
              "ticketPricing": "(string) - Estimated ticket price (e.g., 'Free', '$25', 'Varies').",
              "timeToVisit": "(string) - Suggested time to visit (e.g., 'Morning', 'Afternoon', '9 AM - 1 PM')."
            }
            // Include 2-4 plan items for this day
          ]
        }
        // Include one map object for each day up to {totalDays}
      ]
    },
    "location": "(string) - The input {location}",
    "travelers": "(number) - The number of travelers specified by {traveler} (interpret 'Couple' as 2, 'Family' as maybe 4, 'Solo' as 1, adjust as needed or use a specific number input if available)",
    "userEmail": "(string) - The user's email address (You might need to pass this separately if it's sensitive, or use a placeholder if not available)"
  },
  "userSelection": { // map - Reflect the user's input parameters
    "Travelers": "(string) - The original {traveler} input string or derived number as string",
    "budget": "(string) - The specified {budget}",
    "noOfdays": "(string) - The specified {totalDays} as a string"
  },
  "place": { // map - Details about the primary {location}
    "formatted_address": "(string) - The formatted address for {location}.",
    "geometry": { // map
      "location": { // map
        "lat": "(number) - Latitude of the primary {location}.",
        "lng": "(number) - Longitude of the primary {location}."
      }
    },
    "name": "(string or null) - The name of the place, often same as location or null.",
    "place_id": "(string) - A unique identifier for the place (e.g., Google Place ID, if possible to determine)."
  }
}
Remember me to give valid image URls. In hotel URLs you have given me URLs like https://example.com/hotel1.jpg 
for the last 4-5 times, give me valid hotel Image URLs. Give 4 hotels.
`; 
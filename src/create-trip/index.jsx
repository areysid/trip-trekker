import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  SelectBudgetOptions,
  SelectTravelersList,
  AI_PROMPT,
} from "@/constants/options";
import { getChatSession } from "@/service/AIModel";
import React, { useEffect, useState } from "react";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    if (name === 'noOfdays' && value > 5) {
      toast.error("Please enter a value which is equal to or less than 5.");
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const profile = await res.json();
        localStorage.setItem("user", JSON.stringify(profile));
        setOpenDialog(false);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      (formData?.noOfdays > 5 || !formData?.place) ||
      !formData?.budget ||
      !formData?.Travelers
    ) {
      toast.error("Please fill all details");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.place?.formatted_address)
      .replace("{totalDays}", formData?.noOfdays)
      .replace("{traveler}", formData?.Travelers)
      .replace("{budget}", formData?.budget);

    try {
      const chatSession = await getChatSession();
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result.response.text();

      console.log("AI Response:", responseText);

      // Pass parsed text to save function
      SaveAiTrip(responseText);
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip. Try again.");
      setLoading(false);
    }
  };

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
      parsedTripData = typeof TripData === 'string' ? JSON.parse(TripData) : TripData;
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

  return (
    <div className="max-w-4xl mx-auto sm:px-16 px-5 mt-10 w-full mb-20">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences! 🏕️🏝️
      </h2>
      <p className="mt-3 text-gray-500 text-xl mb-5">
        Just provide some basic information and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl my-3 font-medium">What is the destination?</h2>
          <ReactGoogleAutocomplete
            className="w-full p-3 border rounded-lg shadow-sm"
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            onPlaceSelected={(place) => {
              setPlace(place);
              handleInputChange("place", place);
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">How many days? (Max: 5)</h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            onChange={(e) => handleInputChange("noOfdays", e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow text-sm ${
                formData?.budget == item.title && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-3xl mb-1">{item.icon}</h2>
              <h2 className="font-bold mb-1">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">
          Who are you travelling with?
        </h2>
        <div className="grid grid-cols-4 gap-5 mt-5">
          {SelectTravelersList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("Travelers", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow text-sm ${
                formData?.Travelers == item.people && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-3xl mb-1">{item.icon}</h2>
              <h2 className="font-bold mb-1">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button disabled={loading} onClick={OnGenerateTrip}>
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate Trip"
          )}
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">Sign In Required</DialogTitle>
            <DialogDescription>
              <img src="/logo.svg" alt="App Logo" />
              <h2 className="font-bold text-lg mt-3">Sign In With Google</h2>
              <p>Sign in to the website with Google authentication security</p>
              <Button onClick={login} className="w-full mt-5">
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;

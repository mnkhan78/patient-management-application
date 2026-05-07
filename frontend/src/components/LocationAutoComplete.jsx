import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

const libraries = ["places"];

function LocationInput({ setLocation }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCcIFNnMGutVgfZHMqHAbVoO7uL2VassE4",
    libraries,
  });

  const autocompleteRef = useRef(null);

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    setLocation({
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      placeId: place.place_id,
    });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Autocomplete
      onLoad={(ref) => (autocompleteRef.current = ref)}
      onPlaceChanged={onPlaceChanged}
    >
      <input type="text" placeholder="Enter location" />
    </Autocomplete>
  );
}

export default LocationInput;
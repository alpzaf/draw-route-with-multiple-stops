import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PlacesAutocomplete } from "./PlacesAutoComplete";
import { selectOriginCoordinate } from "../features/originSlice";
import { selectDestinationCoordinate } from "../features/destinationSlice";
import { MapContainer } from "./Map";
import { Button, Label, TextInput } from "flowbite-react";
import { useAppDispatch } from "../store";
import {
  addPassengers,
  selectPassengers,
  selectTripInfo,
} from "../features/passengersSlice";
import { ValidationModal } from "../modal/ValidationModal";
import { TableView } from "./TableView";
import mockPassengers from "../mock/passengers.json";
import mockInvalidPassengers from "../mock/passengersNotValid.json";

export const MapView = () => {
  const dispatch = useAppDispatch();
  const passengersData = useSelector(selectPassengers);
  const tripInfo = useSelector(selectTripInfo);
  const [passengers, setPassengers] = useState("");
  const [validationModal, setValidationModal] = useState(false);
  const originCoordinate = useSelector(selectOriginCoordinate);
  const destinationCoordinate = useSelector(selectDestinationCoordinate);

  useEffect(() => {}, [
    originCoordinate,
    destinationCoordinate,
    passengersData,
  ]);

  const handleJsonInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassengers(e.target.value);
  };

  const tooManyPassengersValidation = (arg: string) => {
    let passengersLength = JSON.parse(arg).length;
    if (passengersLength > 9) {
      setValidationModal(true);
    } else {
      dispatch(addPassengers(arg));
    }
  };

  return (
    <>
      <ValidationModal
        isOpen={validationModal}
        modalClose={() => setValidationModal(false)}
      />
      <div className="block container mx-auto py-5">
        <MapContainer
          OriginCoordinate={originCoordinate}
          DestinationCoordinate={destinationCoordinate}
          Passengers={passengersData}
        />
        <div className="flex flew-row w-full gap-4">
          <PlacesAutocomplete label="Çıkış" coordinateType="origin" />
          <PlacesAutocomplete label="Varış" coordinateType="destination" />
        </div>
        <div className="w-full">
          <div className="mb-2 block">
            <Label htmlFor="json" value="Mock Data (3 Yolcu)" />
          </div>
          <TextInput
            className="w-full"
            id="json"
            type="text"
            readOnly={true}
            value={JSON.stringify(mockPassengers)}
          />
          <div className="mb-2 block">
            <Label
              htmlFor="json"
              value="Mock Data (10 Yolcu)"
              color="#fefefe"
            />
          </div>
          <TextInput
            className="w-full"
            id="json"
            type="text"
            readOnly={true}
            value={JSON.stringify(mockInvalidPassengers)}
          />
          <div className="mb-2 block">
            <Label htmlFor="json" value="Yolcular" />
          </div>
          <div className="flex flex-col gap-4 mb-5">
            <TextInput
              className="w-full"
              id="json"
              type="text"
              onChange={handleJsonInput}
              helperText="stringe çevrilmiş json object yapıştırabilirsiniz"
            />
            <Button onClick={() => tooManyPassengersValidation(passengers)}>
              Yolcu Ekle +
            </Button>
          </div>
        </div>
        <div className="py-5">
          <h1>
            <strong>Toplam Mesafe:</strong>
            {tripInfo.totalTripDistance} km
          </h1>
          <h1>
            <strong>Toplam Süre:</strong>
            {tripInfo.totalTripDuration}
          </h1>
        </div>

        <TableView Passengers={passengersData} />
      </div>
    </>
  );
};

import React, { useState } from "react";
import { useAppDispatch } from "../store";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import {
  resetOriginCoordinate,
  setOriginCoordinate,
} from "../features/originSlice";
import {
  resetDestinationCoordinate,
  setDestinationCoordinate,
} from "../features/destinationSlice";
import { Label, TextInput } from "flowbite-react";
import { AiOutlineCloseCircle } from "react-icons/all";

interface IPlacesAutoCompleteProps {
  coordinateType: string;
  label: string;
}

interface HandleSelectParams {
  description: string;
}

export const PlacesAutocomplete: React.FC<IPlacesAutoCompleteProps> = ({
  coordinateType,
  label,
}) => {
  const dispatch = useAppDispatch();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "autoSuggestions",
    requestOptions: {
      componentRestrictions: { country: ["tr"] },
    },
    debounce: 300,
  });

  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: HandleSelectParams) =>
    () => {
      setIsReadOnly(true);
      setValue(description, false);
      clearSuggestions();

      getGeocode({ address: description }).then((results) => {
        const coordinates = getLatLng(results[0]);
        if (coordinateType === "origin") {
          dispatch(
            setOriginCoordinate({
              coordinates: {
                latitude: coordinates.lat,
                longitude: coordinates.lng,
              },
            })
          );
        } else {
          dispatch(
            setDestinationCoordinate({
              coordinates: {
                latitude: coordinates.lat,
                longitude: coordinates.lng,
              },
            })
          );
        }
      });
    };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(highlightedIndex - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(highlightedIndex + 1);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex !== -1) {
          const selectedSuggestion = data[highlightedIndex];
          handleSelect(selectedSuggestion)();
        }
        break;
      default:
        break;
    }
  };

  const handleMouseEnter = (index: number) => {
    setHighlightedIndex(index);
  };

  const renderSuggestions = () =>
    data.map((suggestion, index) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          onMouseEnter={() => handleMouseEnter(index)}
          style={{
            backgroundColor: index === highlightedIndex ? "lightgray" : "white",
          }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div className="relative w-full mb-4" ref={ref}>
      <div className="mb-2 block">
        <Label htmlFor="location" value={label} />
      </div>
      <TextInput
        id="location"
        type="text"
        sizing="md"
        placeholder="Doğru koordinat değerleri için sokak, cadde veya blok ismi giriniz"
        value={value}
        onChange={handleInput}
        disabled={!ready}
        readOnly={isReadOnly}
        onKeyDown={handleKeyDown}
        className="relative z-50"
      />
      {status === "OK" && (
        <ul className="suggestions absolute z-50 shadow-2xl">
          {renderSuggestions()}
        </ul>
      )}
      <span
        style={{
          position: "absolute",
          right: "1%",
          top: "53%",
          zIndex: "50",
          cursor: "pointer",
        }}
        onClick={() => {
          setValue("", false);
          setIsReadOnly(false);
          if (coordinateType === "origin") {
            dispatch(resetOriginCoordinate());
          } else {
            dispatch(resetDestinationCoordinate());
          }
        }}
      >
        <AiOutlineCloseCircle className="w-5 h-5 text-gray-600" />
      </span>
    </div>
  );
};

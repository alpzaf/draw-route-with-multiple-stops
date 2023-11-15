import { useEffect, useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import Animation = google.maps.Animation;
import { setTripDurations } from "../features/passengersSlice";
import { useAppDispatch } from "../store";

export const libraries = String(["places"]);
type DirectionsResult = google.maps.DirectionsResult;
type Map = google.maps.Map;
type DirectionsRendererType = google.maps.DirectionsRenderer;

export interface IPassengers {
  name: string;
  pickUpPointOrder: number;
  tripDuration: string;
  pickUpPoint: {
    lat: number;
    lng: number;
  };
}

interface IMapContainerProps {
  OriginCoordinate: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    status: boolean;
  };
  DestinationCoordinate: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    status: boolean;
  };
  Passengers: IPassengers[];
}

const center = {
  lat: 41.0082376,
  lng: 28.9783589,
};

export const MapWrapper: React.FC<IMapContainerProps> = ({
  OriginCoordinate,
  DestinationCoordinate,
  Passengers,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_API_KEY",
    id: "__googleMapsScriptId",
    [libraries]: libraries,
  });

  if (!isLoaded) return <div>Harita Yükleniyor...</div>;

  return (
    <MapContainer
      OriginCoordinate={OriginCoordinate}
      DestinationCoordinate={DestinationCoordinate}
      Passengers={Passengers}
    />
  );
};

export const MapContainer: React.FC<IMapContainerProps> = ({
  OriginCoordinate,
  DestinationCoordinate,
  Passengers,
}) => {
  const [directions, setDirections] = useState<DirectionsResult | undefined>(
    undefined
  );
  const directionsRendererRef = useRef<DirectionsRendererType | null>(null);
  const mapRef = useRef<Map | null>(null);
  const dispatch = useAppDispatch();

  const onDirectionsChanged = (newDirections: DirectionsResult) => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }

    setDirections(newDirections);
    const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
      directions: newDirections,
      polylineOptions: {
        zIndex: 50,
        strokeColor: "#000000",
        strokeWeight: 5,
      },
    });
    directionsRendererRef.current = newDirectionsRenderer;
    newDirectionsRenderer.setMap(mapRef.current);
  };

  const onLoad = (map: Map) => {
    mapRef.current = map;
  };

  const service = new google.maps.DirectionsService();

  const updateDirections = useCallback(() => {
    if (
      OriginCoordinate.status &&
      DestinationCoordinate.status &&
      Passengers.length !== 0
    ) {
      service.route(
        {
          origin: {
            lat: OriginCoordinate.coordinates.latitude,
            lng: OriginCoordinate.coordinates.longitude,
          },
          destination: {
            lat: DestinationCoordinate.coordinates.latitude,
            lng: DestinationCoordinate.coordinates.longitude,
          },
          waypoints: Passengers.map((stop) => ({
            location: {
              lat: Number(stop.pickUpPoint.lat),
              lng: Number(stop.pickUpPoint.lng),
            },
            stopover: true,
          })),
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
            dispatch(setTripDurations(result.routes[0].legs));
          }
        }
      );
    }
  }, [OriginCoordinate, DestinationCoordinate, Passengers]);

  useEffect(() => {
    updateDirections();
  }, [updateDirections]);

  return (
    <div className="border-0 rounded-lg mt-8 mb-4 overflow-hidden">
      <GoogleMap
        zoom={10}
        center={center}
        onLoad={onLoad}
        mapContainerStyle={{ width: "100%", height: "500px" }}
      >
        <>
          {OriginCoordinate.status && (
            <MarkerF
              position={{
                lat: OriginCoordinate.coordinates.latitude,
                lng: OriginCoordinate.coordinates.longitude,
              }}
              visible={true}
              zIndex={5}
              animation={Animation.DROP}
            />
          )}

          {DestinationCoordinate.status && (
            <MarkerF
              position={{
                lat: DestinationCoordinate.coordinates.latitude,
                lng: DestinationCoordinate.coordinates.longitude,
              }}
              visible={true}
              zIndex={5}
              animation={Animation.DROP}
            />
          )}

          {OriginCoordinate.status &&
            DestinationCoordinate.status &&
            Passengers.length !== 0 && (
              <DirectionsRenderer
                directions={directions}
                // @ts-ignore
                onDirectionsChanged={onDirectionsChanged}
                options={{
                  polylineOptions: {
                    zIndex: 50,
                    strokeColor: "#000000",
                    strokeWeight: 5,
                  },
                }}
              />
            )}
        </>
      </GoogleMap>
    </div>
  );
};

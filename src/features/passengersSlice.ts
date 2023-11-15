import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/rootReducer";
import { formatDuration } from "../util/formatDuration";

export interface IPassengerInfo {
  name: string;
  pickUpPointOrder: number;
  tripDuration: string;
  pickUpPoint: {
    lat: number;
    lng: number;
  };
}

export type PassengersActionPayload = string;
export type IPassengersData = {
  data: IPassengerInfo[];
  totalTripDuration: string;
  totalTripDistance: number;
  averagePassengerDuration: number;
};

const initialState: IPassengersData = {
  data: [],
  totalTripDuration: "",
  totalTripDistance: 0,
  averagePassengerDuration: 0,
};

export const passengersSlice = createSlice({
  name: "passengers",
  initialState,
  reducers: {
    addPassengers: (state, action: PayloadAction<PassengersActionPayload>) => {
      const parsedJSON = JSON.parse(action.payload);
      state.data = parsedJSON;
    },
    setTripDurations: (state, action) => {
      const payloadTotalDuration = action.payload.reduce(
        (acc: unknown, passenger: unknown) => {
          // @ts-ignore
          const duration = passenger.duration.value;

          return acc + duration;
        },
        0
      );

      state.totalTripDuration = formatDuration(payloadTotalDuration);

      const payloadTotalDistance = action.payload.reduce(
        (acc: unknown, passenger: unknown) => {
          // @ts-ignore
          const duration = passenger.distance.value;

          return acc + duration;
        },
        0
      );

      state.totalTripDistance = Math.round(payloadTotalDistance / 1000);

      const passengersArray = action.payload.slice(1);
      let totalDuration = 0;

      for (let i = state.data.length - 1; i >= 0; i--) {
        const passenger = state.data[i];
        const duration = passengersArray[i].duration.text;
        totalDuration += parseInt(duration.split(" ")[0], 10);
        passenger.tripDuration = `${totalDuration} dk`;
      }
    },
  },
});

export const selectPassengers = (state: RootState) => state.passengers.data;
export const selectTripInfo = (state: RootState) => state.passengers;

export const { addPassengers, setTripDurations } = passengersSlice.actions;

const passengersReducer = passengersSlice.reducer;
export default passengersReducer;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/rootReducer";

export interface CoordinateStateAction {
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface CoordinateState extends CoordinateStateAction {
  status: boolean;
}

const initialState: CoordinateState = {
  // Initial coordinates are pointing center of Istanbul
  coordinates: {
    latitude: 41.0082376,
    longitude: 28.9783589,
  },
  status: false,
};

export const destinationSlice = createSlice({
  name: "destination",
  initialState,
  reducers: {
    setDestinationCoordinate: (
      state,
      action: PayloadAction<CoordinateStateAction>
    ) => {
      state.coordinates.latitude = action.payload.coordinates.latitude;
      state.coordinates.longitude = action.payload.coordinates.longitude;
      state.status = true;
    },
    resetDestinationCoordinate: () => initialState,
  },
});

export const selectDestinationCoordinate = (state: RootState) =>
  state.destination;

export const { setDestinationCoordinate, resetDestinationCoordinate } =
  destinationSlice.actions;

const destinationReducer = destinationSlice.reducer;
export default destinationReducer;

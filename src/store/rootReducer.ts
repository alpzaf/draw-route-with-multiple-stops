import { combineReducers } from "@reduxjs/toolkit";
import originReducer from "../features/originSlice";
import destinationReducer from "../features/destinationSlice";
import passengersReducer from "../features/passengersSlice";

export const rootReducer = combineReducers({
  origin: originReducer,
  destination: destinationReducer,
  passengers: passengersReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

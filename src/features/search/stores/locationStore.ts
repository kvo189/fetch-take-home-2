import { create, StateCreator } from 'zustand';
import { BottomLeftTopRight, Location } from '../types';
import { StateAbbreviation } from '../types/StateAbbreviation';

export interface LocationArea {
  locations: Location[];
  boundingBox: BottomLeftTopRight;
}

interface LocationState {
  selectedLocation: Location | null;
  selectedLocationArea: LocationArea | null;
  searchDistance: number;
  selectedState: string;

  setSelectedLocation: (location: Location | null) => void;
  setSelectedLocationArea: (locationArea: LocationArea | null) => void;
  setSearchDistance: (distance: number) => void;
  setSelectedState: (state: StateAbbreviation) => void;
}

const locationStateCreator: StateCreator<LocationState> = (set) => ({
  selectedLocation: null,
  selectedLocationArea: null,
  searchDistance: 0,
  selectedState: '',
  setSearchDistance: (searchDistance: number) => {
    if (searchDistance === 0) {
      set({ searchDistance, selectedState: '' });
    } else {
      set({ searchDistance });
    }
  },
  setSelectedState: (stateString: StateAbbreviation) => {
    if (stateString === '') {
      set((state) => ({
        ...state,
        selectedState: stateString,
        selectedLocation: null,
        selectedLocationArea: null,
        searchDistance: state.searchDistance ? 0 : state.searchDistance,
      }));
    } else {
      set((state) => ({ ...state, selectedState: stateString }));
    }
  },
  setSelectedLocation: (newLocation: Location | null) => set((state) => {
    if (state.selectedLocation === newLocation) return state; // if same location, don't update
    if (!newLocation) {
      return { ...state, selectedLocation: newLocation, selectedLocationArea: null }; // reset selectedLocationArea if newLocation is null
    }
    const effectiveSearchDistance = state.searchDistance || 10; // default search boundary to 10 miles
    
    return {
      ...state,
      selectedLocation: newLocation,
      searchDistance: effectiveSearchDistance,
      selectedState: !state.selectedState ? newLocation.state : state.selectedState,
    };
  }),
  setSelectedLocationArea: (locationArea: LocationArea | null) => set((state) => {
    if (state.selectedState === '' && locationArea) {
      return { ...state, selectedLocationArea: locationArea, selectedState: state.selectedState };
    } else {
      return { ...state, selectedLocationArea: locationArea };
    }
  }),

});

/**
 * `useLocationStore` State Store
 * 
 * This store manages location-specific states, including selected location, search distance, and associated boundaries.
 * 
 * State Attributes:
 * - `selectedLocation`: Currently selected location, or null if none is selected.
 * - `selectedLocationArea`: An object containing:
 *   - `locations`: An array of locations within a given area.
 *   - `boundingBox`: The boundary box of those locations.
 * - `searchDistance`: Distance radius for a location-based search.
 * - `selectedState`: The state abbreviation of the currently selected location.
 * 
 * Actions:
 * - `setSelectedLocation`: Updates the `selectedLocation` state. Resets `selectedLocationArea` if the new location is null. Adjusts the effective search distance and updates the `selectedState` if not already set.
 * - `setSelectedLocationArea`: Updates the `selectedLocationArea` state, which includes both the locations and their bounding box. Ensures that the `selectedState` remains consistent if a location area is defined.
 * - `setSearchDistance`: Updates the `searchDistance` state. Resets `selectedState` if the search distance is 0.
 * - `setSelectedState`: Updates the `selectedState` state. If the state string is empty, it resets other relevant states like `selectedLocation` and `selectedLocationArea`.
 * 
 * Dependencies:
 * - Uses `zustand` for state management.
 * - Leverages various type definitions like `Location`, `BottomLeftTopRight`, and `StateAbbreviation` for type safety.
 */
const useLocationStore = create(locationStateCreator);

export default useLocationStore;

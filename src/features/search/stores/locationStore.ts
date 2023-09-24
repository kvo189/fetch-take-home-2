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

const useLocationStore = create(locationStateCreator);

export default useLocationStore;

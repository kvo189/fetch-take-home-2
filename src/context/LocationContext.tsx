import { BottomLeftTopRight, Coordinates, Location } from '@/features/search';
import { StateAbbreviation } from '@/features/search/types/StateAbbreviation';
import React, { ReactNode, createContext, useContext, useState} from 'react';

// Define the shape of your location data
interface LocationData {
  city: string;
  state: StateAbbreviation;
  locations: Location[];
  zipCodes: string[] | undefined;
  center: Coordinates;
  boundingBox: BottomLeftTopRight;
  searchDistance: number;
}

// Create the context
export interface LocationContextType {
  locationData: LocationData | undefined;
  setLocationData: React.Dispatch<React.SetStateAction<LocationData | undefined>>;
  selectedLocation: Location | undefined | null;
  setSelectedLocation: React.Dispatch<React.SetStateAction<Location | undefined | null>>;
}

export const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Create a custom hook to access the context
export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}

// Create the context provider component
interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [locationData, setLocationData] = useState<LocationData | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined | null>(undefined);

  return (
     <LocationContext.Provider value={{ locationData, setLocationData, selectedLocation, setSelectedLocation }}>
       {children}
    </LocationContext.Provider>
  );
}
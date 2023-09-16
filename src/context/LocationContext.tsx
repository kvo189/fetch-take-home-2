import React, { ReactNode, createContext, useContext, useState} from 'react';

// Define the shape of your location data
interface LocationData {
  city: string;
  state: string;
  zipCodes: string[];
}

// Create the context
export interface LocationContextType {
  locationData: LocationData | undefined;
  setLocationData: React.Dispatch<React.SetStateAction<LocationData | undefined>>;
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

  return (
     <LocationContext.Provider value={{ locationData, setLocationData }}>
       {children}
    </LocationContext.Provider>
  );
}
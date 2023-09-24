import { FETCH_BASE_URL } from '@/config';
import axiosClient from '@/lib/axiosClient';
import { LocationSearchQuery, LocationSearchResult, ZipCode, Location } from '../types';
import { AxiosResponse } from 'axios';

export const getLocationsByZIPCodes = (zipCodes: string[]): Promise<Location[]> => {
  return axiosClient.post(`${FETCH_BASE_URL}/locations`, zipCodes)
    .then((response: AxiosResponse<(Location | null)[]>) => {
      // Filter out null values
      const locations = response.data.filter((location): location is Location => location !== null);
      return locations;
    });
}
export const searchLocations = (searchParams: LocationSearchQuery = {}): Promise<Location[]> => {
  return axiosClient.post(`${FETCH_BASE_URL}/locations/search`, searchParams)
    .then((response: AxiosResponse<LocationSearchResult>) => response.data.results);
}

import { useQuery } from 'react-query';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Location } from '@/features/search/types';
import { getSuggestedZipCodes } from '@/features/search/utils/getSuggestedZipcodes';
import { findLocationClosestToCenter } from '../utils/findLocationClosestToCenter';
import { getLocationsByZIPCodes, searchLocations } from '@/features/search'

interface LocationSearchQuery {
  searchTerm?: string; // Represents either city or zipcode
  states?: string[];
  city?: string;
  size?: number;
}

type QueryFnType = typeof searchLocations;

type UseLocationsLookupOptions = {
  config?: QueryConfig<QueryFnType>;
  searchParams?: LocationSearchQuery;
  skip?: boolean;
};

export const useLocationsLookup = ({ searchParams, config }: UseLocationsLookupOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>(['locations', searchParams], () => {
    if (!searchParams?.searchTerm) return [];

    // if search term contains digit, assume it is ZIP code
    if (/^\d+$/.test(searchParams.searchTerm)) {
      const zipCodesArray = getSuggestedZipCodes(searchParams.searchTerm);
      if (zipCodesArray.length === 0) return [];

      return getLocationsByZIPCodes(zipCodesArray).then((locations) =>
        locations.map(loc => {
          return { ...loc, suggestionText: createSuggestionText(loc, true) }
        })
      );
    }

    // Adjusting to meet the API expectations
    const apiSearchParams = { ...searchParams, city: searchParams.searchTerm };
    return searchLocations(apiSearchParams).then((locations) => {
      const groups = groupLocationsByCityState(locations);
      const lowerCaseCity = apiSearchParams.city!.toLowerCase();

      // Assign scores to each group based on the match
      const scoredGroups = Object.values(groups).map((locations) => {
        const cityLowerCase = locations[0].city.toLowerCase();
        let score = 0;
        if (cityLowerCase.startsWith(lowerCaseCity)) score += 10; // Higher score for prefix match
        else if (cityLowerCase.includes(lowerCaseCity)) score += 5; // Medium score for inclusion
        score += locations.length; // +1 for each location in the group
        return { locations, score };
      });

      // Sort groups by score and then by the number of locations from most to least
      scoredGroups.sort((a, b) =>
        b.score - a.score ||
        a.locations[0].city.localeCompare(b.locations[0].city)
      );

      // Limit the results to 20
      const refinedGroups = scoredGroups.slice(0, 20).map((scoredGroup) => scoredGroup.locations);

      return refinedGroups.map((group) => {
        const closestLocation = findLocationClosestToCenter(group);
        return { ...closestLocation, suggestionText: createSuggestionText(closestLocation, false) };
      });
    });
  }, { ...config, staleTime: Infinity, cacheTime: Infinity });
};

// Helper function to create suggestion text for a location
const createSuggestionText = (loc: Location, isZip: boolean): string => {
  return isZip ? `${loc.city}, ${loc.state} ${loc.zip_code} ` : `${loc.city}, ${loc.state}`;
}

// Helper function to group the locations by city and state
const groupLocationsByCityState = (locations: Location[]): Record<string, Location[]> => {
  return locations.reduce((groups, loc) => {
    const key = `${loc.city},${loc.state}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(loc);
    return groups;
  }, {} as Record<string, Location[]>);
}
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { isWithinDistance } from '../utils/isWithinDistance';
import { Location } from '..';
import { LatLng, LatLngBounds, Map } from 'leaflet';

interface SearchMapProps {
  locations?: Location[];
  maxDistanceInMiles?: number;
  center: { latitude: number; longitude: number };
  onMapChange?: (center: LatLng, bounds: LatLngBounds) => void; // new prop
}

const SearchMap: React.FC<SearchMapProps> = ({ locations = [], maxDistanceInMiles = 100, center, onMapChange }) => {
  let filteredLocations = locations;
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (!map || !onMapChange) return;
    const bounds: LatLngBounds = map.getBounds();
    onMapChange(map.getCenter(), bounds);
  }, [map]);

  useEffect(() => {
    if (!map) return;
    map.setView([center.latitude, center.longitude], 13);
    console.log('center changed', center);
  }, [center, map]);

  if (locations?.length && center) {
    filteredLocations = locations.filter((location) => isWithinDistance(center, location, maxDistanceInMiles));
  }

  return (
    <div className='w-full relative'>
      <MapContainer
        center={center ? [center.latitude, center.longitude] : undefined}
        zoom={13}
        whenReady={() => console.log('Map ready')}
        style={{ height: '400px', width: '100%' }}
        ref={setMap}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        {filteredLocations.map((location, index) => (
          <Marker key={index} position={[location.latitude, location.longitude]}>
            <Popup>{`Dogs available in zip code: ${location.zip_code}`}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default SearchMap;

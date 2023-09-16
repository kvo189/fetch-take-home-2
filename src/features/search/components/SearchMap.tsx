import React, { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { isWithinDistance } from '../utils/isWithinDistance';
import { Coordinates, Location } from '..';
import { Box } from '@chakra-ui/react';
import { LatLng, LatLngBounds, Map } from 'leaflet';

interface SearchMapProps {
  locations?: Location[];
  maxDistanceInMiles?: number;
  center?: { latitude: number; longitude: number };
  onMapChange?: (center: LatLng, bounds: LatLngBounds) => void; // new prop
}

const SearchMap: React.FC<SearchMapProps> = ({ locations = [], maxDistanceInMiles = 100, center, onMapChange }) => {
  let filteredLocations = locations;
  const [map, setMap] = useState<Map | null>(null);
  const [position, setPosition] = useState(() => map && map.getCenter());
  const [bounds, setBounds] = useState(() => map && map.getBounds());

  useEffect(() => {
    if (!map || !onMapChange) return;
    const bounds: LatLngBounds = map.getBounds();
    onMapChange(map.getCenter(), bounds);
  }, [map]);
  
  const onMoveEnd = useCallback(() => {
    if (!map || !onMapChange) return;
    const newCenter = map.getCenter();
    const newBounds = map.getBounds();
    setPosition(newCenter);
    setBounds(newBounds);
    onMapChange(newCenter, newBounds);
  }, [map, onMapChange]);
  
  useEffect(() => {
    if (!map || !onMapChange) return;
    map.on('moveend', onMoveEnd);
    return () => {
      map.off('moveend', onMoveEnd);
    };
  }, [map, onMoveEnd, onMapChange]);

  if (locations?.length && center) {
    filteredLocations = locations.filter((location) => isWithinDistance(center, location, maxDistanceInMiles));
  }

  return (
    <div className='w-full relative'>
      <div className='absolute m-auto left-0 right-0'>{bounds ? bounds.getNorth() : ''}</div>
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

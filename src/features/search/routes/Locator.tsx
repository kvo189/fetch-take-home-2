import { Box, Button, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { StatePicker } from '../components/StatePicker';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '@/features/search/contexts/LocationContext';
import { MapContainer, Marker, Popup, Rectangle, TileLayer } from 'react-leaflet';
import { DistancePicker } from '../components/DistancePicker';
import { Map } from 'leaflet';
import LocationSearchInput from '../components/LocationSearchInput';

const Locator = () => {
  const [map, setMap] = useState<Map | null>(null); // Get leaflet map instance
  const { locationData, selectedState, selectedLocation } = useLocationContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!locationData) return;
    if (map) {
      const boundingBox = locationData.boundingBox;
      map.fitBounds([
        [boundingBox.top_right.lat, boundingBox.top_right.lon],
        [boundingBox.bottom_left.lat, boundingBox.bottom_left.lon],
      ]);
    }
  }, [locationData]);

  return (
    <>
      <Layout title='Locator' heading='Select a state and zip code'>
        <Box className='w-full flex flex-col items-center mx-auto gap-3 max-w-2xl'>
          <div className='flex flex-col sm:flex-row w-full gap-2'>
            <DistancePicker className='flex-1' />
            <StatePicker className='flex-1' />
            <LocationSearchInput />
          </div>
          {/* Location prompt */}
          {locationData?.locations?.length && selectedLocation && (
            <Text mt={2} className='mt-5 text-lg'>
              You have selected{' '}
              <span className='font-semibold'>
                {selectedLocation.city}, {selectedLocation.state}
              </span>
            </Text>
          )}
          {/* Continue button */}
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{ bg: 'blue.500' }}
            isDisabled={!locationData?.locations?.length}
            onClick={() => navigate('./dog')}
          >
            Continue
          </Button>
          {/* Map */}
          {selectedLocation?.latitude} {selectedLocation?.longitude}
          <div className='w-full relative'>
            <MapContainer
              center={
                selectedLocation?.latitude && selectedLocation?.longitude
                  ? [selectedLocation.latitude, selectedLocation.longitude]
                  : [33.456412, -86.801904]
              }
              zoom={10}
              whenReady={() => console.log('Map ready')}
              style={{ height: '400px', width: '100%' }}
              ref={setMap}
            >
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

              {selectedLocation && (
                <>
                  <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
                    <Popup>{`Locations to search: ${locationData?.locations?.length}`}</Popup>
                  </Marker>
                  (
                  {locationData && (
                    <Rectangle
                      bounds={[
                        [locationData.boundingBox.top_right.lat, locationData.boundingBox.top_right.lon],
                        [locationData.boundingBox.bottom_left.lat, locationData.boundingBox.bottom_left.lon],
                      ]}
                    ></Rectangle>
                  )}
                  )
                </>
              )}
            </MapContainer>
          </div>
        </Box>
      </Layout>
    </>
  );
};

export default Locator;

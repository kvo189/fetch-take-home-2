import { Box, Button, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { StatePicker } from '../components/StatePicker';
import { StateAbbreviation } from '../types/StateAbbreviation';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '@/context/LocationContext';
import { MapContainer, Marker, Popup, Rectangle, TileLayer } from 'react-leaflet';
import { DistancePicker } from '../components/DistancePicker';
import { Map } from 'leaflet';
import LocationSearchInput from '../components/LocationSearchInput';

const Locator = () => {
  // Existing state variables
  const [selectedState, setSelectedState] = useState<StateAbbreviation>('AL');
  const [map, setMap] = useState<Map | null>(null); // Get leaflet map instance
  const [searchDistance, setSearchDistance] = useState<number>(10); // Search distance in miles
  const { locationData } = useLocationContext();
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
            <DistancePicker
              className='flex-1'
              selectedDistance={searchDistance}
              onDistanceChange={(d) => setSearchDistance(d)}
            />
            <StatePicker
              className='flex-1'
              selectedState={selectedState}
              onStateChange={(newState) => setSelectedState(newState)}
            />
            <LocationSearchInput selectedState={selectedState} searchDistance={searchDistance} />
          </div>
          {/* Location prompt */}
          {locationData?.zipCodes && locationData?.zipCodes?.length > 0 && (
            <Text mt={2} className='mt-5 text-lg'>
              You have selected{' '}
              <span className='font-semibold'>
                {locationData.city}, {locationData.state}
              </span>
            </Text>
          )}
          {/* Continue button */}
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{ bg: 'blue.500' }}
            isDisabled={!locationData?.zipCodes || locationData?.zipCodes.length === 0}
            onClick={() => navigate('./dog')}
          >
            Continue
          </Button>
          {/* Map */}
          {locationData?.center.lat} {locationData?.center.lon}
          <div className='w-full relative'>
            <MapContainer
              center={locationData?.center ? [locationData?.center.lat, locationData?.center.lon] : [33.456412, -86.801904]}
              zoom={10}
              whenReady={() => console.log('Map ready')}
              style={{ height: '400px', width: '100%' }}
              ref={setMap}
            >
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

              {locationData && (
                <>
                  <Marker position={[locationData.center.lat, locationData.center.lon]}>
                    <Popup>{`Locations to search: ${locationData?.locations?.length}`}</Popup>
                  </Marker>
                  <Rectangle
                    bounds={[
                      [locationData.boundingBox.top_right.lat, locationData.boundingBox.top_right.lon],
                      [locationData.boundingBox.bottom_left.lat, locationData.boundingBox.bottom_left.lon],
                    ]}
                  ></Rectangle>
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

import { Box, Button, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { StatePicker } from '../components/StatePicker';
import { useNavigate } from 'react-router-dom';
import { MapContainer, Marker, Popup, Rectangle, TileLayer } from 'react-leaflet';
import { DistancePicker } from '../components/DistancePicker';
import { Map } from 'leaflet';
import SearchInput from '@/features/search/components/SearchInput';
import { ContentLayout } from '@/components/Layout/ContentLayout';
import useLocationStore from '../stores/locationStore';
import { StateAbbreviation } from '../types/StateAbbreviation';

const Locator = () => {
  const [map, setMap] = useState<Map | null>(null); // Get leaflet map instance

  const { selectedLocation, setSelectedLocationArea, selectedLocationArea } = useLocationStore((state) => ({
    selectedLocation: state.selectedLocation,
    searchDistance: state.searchDistance,
    selectedState: state.selectedState as StateAbbreviation,
    setSelectedLocationArea: state.setSelectedLocationArea,
    selectedLocationArea: state.selectedLocationArea
  }));

  const navigate = useNavigate();

  console.count('Locator render');

  useEffect(() => {
    console.log({selectedLocationArea})
    if (!selectedLocationArea) return;
    if (map) {
      const boundingBox = selectedLocationArea.boundingBox;
      map.fitBounds([
        [boundingBox.top_right.lat, boundingBox.top_right.lon],
        [boundingBox.bottom_left.lat, boundingBox.bottom_left.lon],
      ]);
    }
    setSelectedLocationArea(selectedLocationArea);
  }, [selectedLocationArea]);

  return (
    <>
      <ContentLayout title='Locator' heading='Select a state and zip code'>
        <Box className='w-full flex flex-col items-center mx-auto gap-3 max-w-2xl'>
          <div className='flex flex-col sm:flex-row w-full gap-2'>
            <DistancePicker className='flex-1' />
            <StatePicker className='flex-1' />
            <SearchInput />
          </div>
          {/* Location prompt */}
          {selectedLocationArea?.locations?.length && selectedLocation && (
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
            isDisabled={!selectedLocationArea?.locations?.length}
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
              // whenReady={() => console.log('Map ready')}
              style={{ height: '400px', width: '100%' }}
              ref={setMap}
            >
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

              {selectedLocation && (
                <>
                  <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
                    <Popup>{`Locations to search: ${selectedLocationArea?.locations?.length}`}</Popup>
                  </Marker>
                  (
                  {selectedLocationArea && (
                    <Rectangle
                      bounds={[
                        [selectedLocationArea.boundingBox.top_right.lat, selectedLocationArea.boundingBox.top_right.lon],
                        [selectedLocationArea.boundingBox.bottom_left.lat, selectedLocationArea.boundingBox.bottom_left.lon],
                      ]}
                    ></Rectangle>
                  )}
                  )
                </>
              )}
            </MapContainer>
          </div>
        </Box>
      </ContentLayout>
    </>
  );
};

export default Locator;

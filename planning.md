Workflow:
User inputs either State and City or a Zip Code.
Make an API call to /location/search with the relevant filters.
Use findCenterPoint function to find the center point if State and City are given, or use the latitude and longitude of the given Zip Code.
Use the isWithinDistance function within your React component to filter locations based on the calculated center and maximum distance.
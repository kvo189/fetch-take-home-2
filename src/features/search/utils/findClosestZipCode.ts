import { Coordinates, Location } from "../types";
import { haversineDistance } from "@/utils/haversineDistance";

// Function to find the closest zip code to the center point
export function findClosestZipCode(center: Coordinates, locations: Location[]): Location {
    let closestLocation = locations[0];
    let minDistance = haversineDistance(center.lat, center.lon, closestLocation.latitude, closestLocation.longitude);

    for (const location of locations.slice(1)) {
        const distance = haversineDistance(center.lat, center.lon, closestLocation.latitude, closestLocation.longitude);
        if (distance < minDistance) {
            minDistance = distance;
            closestLocation = location;
        }
    }

    return closestLocation;
}


export interface Match {
    match: string;
}

export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
    distance?: number;
}

export interface DogSearchQuery {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: number;
    sort?: string;
}

export interface DogSearchResponse {
    next?: string;
    prev?: string;
    resultIds: string[];
    total: number;
}

export interface Location {
    zip_code: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    county: string;
    distanceFromSelected?: number;
}

export interface Coordinates {
    lat: number;
    lon: number;
}


export interface BoundingBox {
    top: Coordinates;
    left: Coordinates;
    bottom: Coordinates;
    right: Coordinates;
}


export interface LocationSearchQuery {
    city?: string;
    states?: string[];
    geoBoundingBox?: GeoBoundingBox;
    size?: number; // the number of results to return; defaults to 25 if omitted
    from?: number; // a cursor to be used when paginating results (optional)
}

// Use a union type for the geoBoundingBox field
export type GeoBoundingBox = TopLeftBottomRight | BottomLeftTopRight | BottomRightTopLeft;

// Define separate types for each acceptable combination
export type TopLeftBottomRight = {
    top: Coordinates;
    left: Coordinates;
    bottom: Coordinates;
    right: Coordinates;
};

export type BottomLeftTopRight = {
    bottom_left: Coordinates;
    top_right: Coordinates;
};

export type BottomRightTopLeft = {
    bottom_right: Coordinates;
    top_left: Coordinates;
};

// Define the types for the response data
export interface LocationSearchResult {
    results: Location[];
    total: number;
}

// Define the type for a single ZIP code
export type ZipCode = string;
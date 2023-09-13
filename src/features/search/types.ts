

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
}

export interface Coordinates {
    lat: number;
    lon: number;
}


export interface LocationSearchQuery {
    city?: string;
    states?: string[];
    geoBoundingBox?: {
        top?: Coordinates;
        left?: Coordinates;
        bottom?: Coordinates;
        right?: Coordinates;
        bottom_left?: Coordinates;
        top_left?: Coordinates;
    };
    size?: number; // the number of results to return; defaults to 25 if omitted
    from?: number; // a cursor to be used when paginating results (optional)
}


// Define the types for the response data
export interface LocationSearchResult {
    results: Location[];
    total: number;
}

// Define the type for a single ZIP code
export type ZipCode = string;
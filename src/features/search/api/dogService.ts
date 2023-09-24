import { FETCH_BASE_URL } from '@/config';
import axiosClient from '@/lib/axiosClient';
import { DogSearchQuery, Match, DogSearchResponse, Dog } from '../types';
import { AxiosResponse } from 'axios';

export const getDogBreeds = (): Promise<string[]> => {
  return axiosClient.get(`${FETCH_BASE_URL}/dogs/breeds`)
    .then((response: AxiosResponse<string[]>) => response.data);
}

export const getDogSearchResults = (queryParameters: DogSearchQuery): Promise<DogSearchResponse> => {
  return axiosClient.get(`${FETCH_BASE_URL}/dogs/search`, { params: queryParameters })
    .then((response: AxiosResponse<DogSearchResponse>) => response.data);
}

export const getDogsByIds = (dogIds: string[]): Promise<Dog[]> => {
  return axiosClient.post(`${FETCH_BASE_URL}/dogs`, dogIds)
    .then((response: AxiosResponse<Dog[]>) => response.data);
}

export const getMatchedDog = (dogIds: string[]): Promise<Match> => {
  return axiosClient.post(`${FETCH_BASE_URL}/dogs/match`, dogIds)
    .then((response: AxiosResponse<Match>) => response.data);
}

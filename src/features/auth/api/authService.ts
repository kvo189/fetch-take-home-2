import { FETCH_BASE_URL } from '@/config';
import axiosClient from '@/lib/axiosClient';
import { LoginInput } from '../types';

export const loginWithNameAndEmail = (loginInput: LoginInput): Promise<Response> => {
  return axiosClient.post(`${FETCH_BASE_URL}/auth/login`, loginInput);
}

export const logout = (): Promise<Response> => {
  return axiosClient.post(`${FETCH_BASE_URL}/auth/logout`);
}
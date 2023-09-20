import { STATES, StateAbbreviation } from '../types/StateAbbreviation';
// Type guard to check if a string is a StateAbbreviation
export function isStateAbbreviation(str: string): str is StateAbbreviation {
  return STATES.includes(str as StateAbbreviation);
}

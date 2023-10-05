import { useRef, useEffect } from 'react';
/**
 * useIsMount Hook.
 * 
 * Determines if the current render is the component's initial mount.
 * Useful for running effects only on update and not on initial mount.
 * 
 * Returns:
 * - `true` on the component's initial mount.
 * - `false` on subsequent renders.
 */
export const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
        isMountRef.current = false;
    }, []);
    return isMountRef.current;
};
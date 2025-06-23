import { useEffect, useRef } from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const useDebounce = (
	callback: (...props: any) => void,
	delay: number,
) => {
	const latestCallback = useRef(callback);
	const latestTimeout = useRef(null);

	useEffect(() => {
		latestCallback.current = callback;
	}, [callback]);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (...props: any) => {
		if (latestTimeout.current) {
			clearTimeout(latestTimeout.current);
		}

		// @ts-ignore
		latestTimeout.current = setTimeout(() => {
			latestCallback.current(...props);
		}, delay);
	};
};

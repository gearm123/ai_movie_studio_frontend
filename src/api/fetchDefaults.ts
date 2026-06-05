/** Default fetch options for cross-origin API calls (avoids some referer-based blocks). */
export const crossOriginFetchInit: RequestInit = {
  mode: "cors",
  cache: "no-store",
  credentials: "omit",
  referrerPolicy: "no-referrer",
};

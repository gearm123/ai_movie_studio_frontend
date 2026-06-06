export function preloadBrandLogo(): Promise<void> {
  return new Promise((resolve, reject) => {
    const tryPng = () => {
      const png = new Image();
      png.decoding = "async";
      png.onload = () => resolve();
      png.onerror = () => reject(new Error("Brand logo failed to load."));
      png.src = BRAND_LOGO_PNG;
    };

    const webp = new Image();
    webp.decoding = "async";
    webp.onload = () => resolve();
    webp.onerror = tryPng;
    webp.src = BRAND_LOGO_WEBP;
  });
}

export const BRAND_LOGO_WEBP = "/brand_logo.webp";
export const BRAND_LOGO_PNG = "/brand_logo.png";

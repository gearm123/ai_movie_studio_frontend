import { BRAND_LOGO_PNG, BRAND_LOGO_WEBP } from "./brandLogo";

interface LandingBrandLogoProps {
  className: string;
}

export function LandingBrandLogo({ className }: LandingBrandLogoProps) {
  return (
    <picture>
      <source srcSet={BRAND_LOGO_WEBP} type="image/webp" />
      <img
        className={className}
        src={BRAND_LOGO_PNG}
        alt="AI Movie Studio"
        width={640}
        height={427}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}

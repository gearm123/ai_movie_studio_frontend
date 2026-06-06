/** Max viewport width (px) treated as phone UI. Above this = browser UI. */
export const PHONE_MAX_WIDTH = 760;

/** localStorage key for dev-only forced viewport (see UI_CONTEXT.md). */
export const VIEWPORT_OVERRIDE_STORAGE_KEY = "studio-viewport-override";

export type ViewportKind = "browser" | "phone";

export const VIEWPORT_MEDIA_QUERY = `(max-width: ${PHONE_MAX_WIDTH}px)` as const;

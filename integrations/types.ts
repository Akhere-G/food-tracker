export const externalApiTypes = {
  allthenutrients: "allthenutrients",
} as const;

export type ExternalApiTypes =
  (typeof externalApiTypes)[keyof typeof externalApiTypes];

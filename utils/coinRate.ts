export const COIN_RATE_ORB = 0.000024
export const COIN_RATE_NON_ORB = 0.000012

export function getRateByUser(isOrbVerified: boolean) {
  return isOrbVerified ? COIN_RATE_ORB : COIN_RATE_NON_ORB
}
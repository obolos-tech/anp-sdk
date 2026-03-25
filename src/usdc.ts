/**
 * USDC conversion helpers (6 decimals).
 */

/** Convert a human-readable USD amount to USDC units (6 decimals) */
export function usdToUsdc(usd: number): string {
  return String(Math.round(usd * 1_000_000));
}

/** Convert USDC units (6 decimals) to human-readable USD */
export function usdcToUsd(usdc: string): number {
  return Number(BigInt(usdc)) / 1_000_000;
}

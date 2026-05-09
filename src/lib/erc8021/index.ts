/**
 * ERC-8021 Transaction Attribution implementation
 * Reference integration for Caster Colony.
 */

import { encodeAbiParameters, parseAbiParameters } from 'viem';

export const ATTRIBUTION_CODE = 'bc_ls55a4v0'; // The provided builder code

export interface ERC8021Config {
  builderCode: string;
  attributionCode: string;
}

/**
 * Appends the ERC-8021 attribution payload to transaction calldata if supported.
 * Currently returns a simulated hex string or payload integration for standard transactions.
 */
export function generateAttributionPayload(txData: `0x${string}`, config: ERC8021Config): `0x${string}` {
  // ERC-8021 payload structure usually appends data encoded specifically depending on the target contract.
  // This is a placeholder payload generator mimicking attribution append.
  const encodedAttribution = encodeAbiParameters(
    parseAbiParameters('string, string'),
    [config.builderCode, config.attributionCode]
  );
  
  // Basic concatenation (in a real scenario, the contract must support receiving this trailing data)
  return `${txData}${encodedAttribution.replace('0x', '')}` as `0x${string}`;
}

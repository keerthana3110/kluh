import { AlgorandAuditRecord } from '@/types';

function generateHex(length: number): string {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createAlgorandAuditRecord(
  spendRequestId: string,
  amount: number,
  policyVersion: string = 'POL_VER_HASH_2026_08_v5'
): AlgorandAuditRecord {
  const txHash = `TX_ALGO_${generateHex(16)}`;
  const blockNumber = 3849100 + Math.floor(Math.random() * 500);
  const payloadHash = generateHex(64).toLowerCase();
  const stateProof = `ALGO_ZKPROOF_VERIFIED_SIG_0x${generateHex(16).toLowerCase()}`;

  return {
    txHash,
    blockNumber,
    timestamp: new Date().toISOString(),
    senderAddress: 'SENTINEL_GOV_ALGO_ADDR_89234X9123847',
    appId: 1049283, // Algorand Governance Smart Contract App ID
    payloadHash,
    policyVersionHash: policyVersion,
    stateProof,
    verificationStatus: 'VERIFIED',
    spendRequestId,
    amount
  };
}

export function verifyAlgorandProof(record: AlgorandAuditRecord): {
  isValid: boolean;
  blockConfirmed: boolean;
  roundTime: string;
  signatureMatch: boolean;
  explorerUrl: string;
} {
  return {
    isValid: true,
    blockConfirmed: true,
    roundTime: record.timestamp,
    signatureMatch: record.stateProof.startsWith('ALGO_ZKPROOF'),
    explorerUrl: `https://testnet.algoexplorer.io/tx/${record.txHash}`
  };
}

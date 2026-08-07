export interface X402HeaderChallenge {
  statusCode: 402;
  statusText: 'Payment Required';
  headers: {
    'WWW-Authenticate': string;
    'X-402-Authorize': string;
    'X-402-Amount': string;
    'X-402-Currency': string;
    'X-402-Nonce': string;
  };
}

export interface X402AuthorizationToken {
  token: string;
  challengeNonce: string;
  amount: number;
  signedSignature: string;
  expiresAt: string;
  settlementStatus: 'AUTHORIZED' | 'SETTLED';
}

export function generateX402Challenge(amount: number): X402HeaderChallenge {
  const nonce = `nonce_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
  return {
    statusCode: 402,
    statusText: 'Payment Required',
    headers: {
      'WWW-Authenticate': `x402 realm="Tracking.ai Agent Micropayments", nonce="${nonce}"`,
      'X-402-Authorize': 'required',
      'X-402-Amount': amount.toFixed(4),
      'X-402-Currency': 'USD',
      'X-402-Nonce': nonce
    }
  };
}

export function issueX402Authorization(amount: number, challengeNonce: string): X402AuthorizationToken {
  const randomSig = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const token = `x402_tok_${Date.now()}_${randomSig}`;
  
  return {
    token,
    challengeNonce,
    amount,
    signedSignature: `0x${randomSig}f402ec991a`,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    settlementStatus: 'SETTLED'
  };
}


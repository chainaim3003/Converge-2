/**
 * LendingService.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * The AlgorandClient / SimpleCollateralLendingClient imports are removed.
 * The business logic (risk scoring, loan lifecycle) is pure TypeScript and
 * unchanged.  When a real Solidity lending contract is deployed on Sepolia,
 * replace the mock implementations below with ethers v6 calls.
 *
 * ethers v6 docs: https://docs.ethers.org/v6/
 */

// ── Types (previously in types/v3-contract-types.ts) ─────────────────────

export interface LoanRequest {
  loanId: bigint;
  borrower: string;
  collateralTokenId: bigint;   // ERC-721 token ID of the eBL used as collateral
  requestedAmount: bigint;     // in cvUSD (18 decimals)
  interestRate: bigint;        // basis points (e.g. 500 = 5%)
  dueDate: bigint;             // UNIX timestamp
  funded: boolean;
}

export interface ActiveLoan {
  loanId: bigint;
  lender: string;
  borrower: string;
  principal: bigint;
  interestRate: bigint;
  dueDate: bigint;
  repaid: boolean;
}

export interface LoanTerms {
  maxLoanAmount: bigint;
  interestRate: bigint;
  ltvRatio: bigint;
}

export interface LendingStats {
  totalLoansIssued: bigint;
  totalVolumeUSDC: bigint;
  activeLoanCount: bigint;
}

export interface RequestLoanRequest {
  collateralTokenId: bigint;
  requestedAmount: bigint;
  borrowerAddress: string;
}

export interface FundLoanRequest {
  loanId: bigint;
  lenderAddress: string;
}

export interface RepayLoanRequest {
  loanId: bigint;
  borrowerAddress: string;
}

// ── Service class ─────────────────────────────────────────────────────────

export class LendingService {
  /**
   * Get risk-based loan terms for a collateral asset.
   * Logic is chain-agnostic — no blockchain call needed.
   */
  async getRiskBasedTerms(collateralValue: bigint, riskScore: bigint): Promise<LoanTerms> {
    let ltvRatio: bigint;
    let interestRate: bigint;

    if (riskScore <= 300n) {
      ltvRatio = 8000n;
      interestRate = 500n;
    } else if (riskScore <= 500n) {
      ltvRatio = 7000n;
      interestRate = 800n;
    } else if (riskScore <= 700n) {
      ltvRatio = 6000n;
      interestRate = 1200n;
    } else {
      ltvRatio = 4000n;
      interestRate = 1800n;
    }

    const maxLoanAmount = (collateralValue * ltvRatio) / 10000n;
    return { maxLoanAmount, interestRate, ltvRatio };
  }

  async requestLoan(request: RequestLoanRequest): Promise<bigint> {
    console.log('[LendingService] requestLoan (mock):', request);
    // TODO: call LendingContract.requestLoan() on Sepolia
    return BigInt(Date.now());
  }

  async fundLoan(request: FundLoanRequest): Promise<boolean> {
    console.log('[LendingService] fundLoan (mock):', request);
    // TODO: approve cvUSD + call LendingContract.fundLoan()
    return true;
  }

  async repayLoan(request: RepayLoanRequest): Promise<boolean> {
    console.log('[LendingService] repayLoan (mock):', request);
    // TODO: approve cvUSD + call LendingContract.repayLoan()
    return true;
  }

  async liquidateLoan(loanId: bigint): Promise<boolean> {
    console.log('[LendingService] liquidateLoan (mock):', loanId);
    return true;
  }

  async getBorrowerLoans(_borrowerAddress: string): Promise<LoanRequest[]> {
    return [];
  }

  async getLenderLoans(_lenderAddress: string): Promise<ActiveLoan[]> {
    return [];
  }

  async getAvailableLoans(): Promise<LoanRequest[]> {
    return [];
  }

  async getLendingStats(): Promise<LendingStats> {
    return {
      totalLoansIssued: 0n,
      totalVolumeUSDC: 0n,
      activeLoanCount: 0n,
    };
  }

  async getLoanRequest(_loanId: bigint): Promise<LoanRequest | null> {
    return null;
  }

  async getActiveLoan(_loanId: bigint): Promise<ActiveLoan | null> {
    return null;
  }
}

export default LendingService;

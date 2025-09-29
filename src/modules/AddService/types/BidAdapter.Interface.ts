export interface BidRequest {
  size: string;
  geo?: string;
  cpm: number;
}

export interface LineItem {
  id: string;
  size: string;
  minCpm: number;
  maxCpm: number;
  geo: string | null;
  adType: string;
  frequency: number;
  creativeUrl: string;
  usedCount: number;
  createdAt: Date;
}

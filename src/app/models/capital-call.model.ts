export type CapitalCallStatus = 'DRAFT' | 'NOTICE_GENERATING' | 'ISSUED' | 'FUNDED';

export interface CapitalCall {
  id: number;
  investorId: number;
  investorName: string;
  amount: number;
  dueDate: string;
  status: CapitalCallStatus;
  noticeDocumentUrl: string | null;
}

export interface CreateCapitalCallRequest {
  investorId: number;
  amount: number;
  dueDate: string;
}

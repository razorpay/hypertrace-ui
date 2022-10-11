import { TableRow } from '@hypertrace/components';

export interface DeploymentsResponse {
  payload: {
    service: string;
    deployments: DeploymentsResponseRow[];
  };
  // tslint:disable-next-line: no-any
  errors: any;
  success: boolean;
}

export interface DeploymentsResponseRow extends TableRow {
  type: string;
  commit?: string;
  status: string;
  triggeredBy: string;
  startTime: number;
  endTime: number;
}

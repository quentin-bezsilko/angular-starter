import type { SampleStatus } from "./sample.model";

export interface BulkResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface BulkIdsRequest {
  ids: number[];
}

export interface BulkStatusRequest {
  ids: number[];
  status: SampleStatus;
}

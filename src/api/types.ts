import type {
  PredictionResponse,
  MatchResponse,
  WorkVerificationReportV2,
} from '@/data/types';

export interface QualifyRequest {
  ticket_scope: string;
  image_attachment_ids: string[];
  service_line_id: string | null;
}

export interface MatchRequest {
  service_line_id: string;
  service_type_id: string;
  property_id: string;
  is_emergency: boolean;
  minimum_matching_score: number;
  minimum_providers_required: number;
}

export interface VerifyRequest {
  work_id: string;
}

export type { PredictionResponse, MatchResponse, WorkVerificationReportV2 };

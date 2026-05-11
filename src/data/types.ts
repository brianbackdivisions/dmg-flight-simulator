// TypeScript types derived from DMG proto definitions.
// Uses const objects instead of enums (required for erasableSyntaxOnly compatibility).

export const WorkActionType = {
  WORK_ACTION_TYPE_UNSPECIFIED: 0,
  WORK_ACTION_TYPE_ESSENTIAL: 1,
  WORK_ACTION_TYPE_AUXILIARY: 2,
  WORK_ACTION_TYPE_DOCUMENTATION: 3,
} as const;
export type WorkActionType = typeof WorkActionType[keyof typeof WorkActionType];

export const WorkActionStatus = {
  WORK_ACTION_STATUS_UNSPECIFIED: 0,
  WORK_ACTION_STATUS_TODO: 1,
  WORK_ACTION_STATUS_IN_PROGRESS: 2,
  WORK_ACTION_STATUS_COMPLETE: 3,
  WORK_ACTION_STATUS_INCOMPLETE: 4,
  WORK_ACTION_STATUS_IRRELEVANT: 5,
  WORK_ACTION_STATUS_INCONCLUSIVE: 6,
} as const;
export type WorkActionStatus = typeof WorkActionStatus[keyof typeof WorkActionStatus];

export const WorkActionCategory = {
  WORK_ACTION_CATEGORY_UNSPECIFIED: 0,
  WORK_ACTION_CATEGORY_REPAIR: 1,
  WORK_ACTION_CATEGORY_MAINTENANCE: 2,
  WORK_ACTION_CATEGORY_INSTALLATION: 3,
  WORK_ACTION_CATEGORY_INSPECTION: 4,
  WORK_ACTION_CATEGORY_TESTING: 5,
  WORK_ACTION_CATEGORY_CLEANING: 6,
  WORK_ACTION_CATEGORY_REPLACEMENT: 7,
  WORK_ACTION_CATEGORY_REMOVAL: 8,
  WORK_ACTION_CATEGORY_OTHERS: 9,
} as const;
export type WorkActionCategory = typeof WorkActionCategory[keyof typeof WorkActionCategory];

export const WorkActionPriority = {
  WORK_ACTION_PRIORITY_UNSPECIFIED: 0,
  WORK_ACTION_PRIORITY_LOW: 1,
  WORK_ACTION_PRIORITY_MEDIUM: 2,
  WORK_ACTION_PRIORITY_HIGH: 3,
} as const;
export type WorkActionPriority = typeof WorkActionPriority[keyof typeof WorkActionPriority];

export const WorkCompletionStatus = {
  WORK_COMPLETION_STATUS_UNSPECIFIED: 0,
  WORK_COMPLETION_STATUS_COMPLETE: 1,
  WORK_COMPLETION_STATUS_INCOMPLETE: 2,
  WORK_COMPLETION_STATUS_INDETERMINISTIC: 3,
} as const;
export type WorkCompletionStatus = typeof WorkCompletionStatus[keyof typeof WorkCompletionStatus];

export const ConfidenceLevel = {
  CONFIDENCE_LEVEL_UNSPECIFIED: 0,
  CONFIDENCE_LEVEL_LOW: 1,
  CONFIDENCE_LEVEL_MEDIUM: 2,
  CONFIDENCE_LEVEL_HIGH: 3,
} as const;
export type ConfidenceLevel = typeof ConfidenceLevel[keyof typeof ConfidenceLevel];

export const VerificationReportStatus = {
  VERIFICATION_REPORT_STATUS_UNSPECIFIED: 0,
  VERIFICATION_REPORT_STATUS_IN_PROGRESS: 1,
  VERIFICATION_REPORT_STATUS_FAILED: 2,
  VERIFICATION_REPORT_STATUS_COMPLETED: 3,
  VERIFICATION_REPORT_STATUS_CANCELLED: 4,
} as const;
export type VerificationReportStatus = typeof VerificationReportStatus[keyof typeof VerificationReportStatus];

export const MatchingDecoration = {
  MATCHING_DECORATION_UNSPECIFIED: 0,
  MATCHING_DECORATION_CERTIFICATIONS: 1,
  MATCHING_DECORATION_PSA_PROVIDER: 2,
  MATCHING_DECORATION_PREFERRED_PROVIDER: 3,
  MATCHING_DECORATION_CHOSEN_PROVIDER: 4,
  MATCHING_DECORATION_TOP_MATCHED_PROVIDER: 5,
  MATCHING_DECORATION_PROVIDER_NEARBY: 6,
  MATCHING_DECORATION_DISTANCE: 7,
  MATCHING_DECORATION_HISTORY_WITH_PROPERTY: 8,
  MATCHING_DECORATION_HISTORY_WITH_CUSTOMER: 9,
  MATCHING_DECORATION_OC_RATINGS: 10,
  MATCHING_DECORATION_PERFORMANCE_SCORES: 11,
  MATCHING_DECORATION_JOB_BOARD_ENGAGEMENT: 12,
  MATCHING_DECORATION_DFC: 13,
  MATCHING_DECORATION_ON_TIME_ARRIVAL: 14,
  MATCHING_DECORATION_NEW_PROVIDER: 15,
  MATCHING_DECORATION_SKILLS: 16,
  MATCHING_DECORATION_EQUIPMENT: 17,
} as const;
export type MatchingDecoration = typeof MatchingDecoration[keyof typeof MatchingDecoration];

export const ProviderTag = {
  PROVIDER_TAG_UNSPECIFIED: 0,
  PROVIDER_TAG_PSA_PROVIDER: 1,
  PROVIDER_TAG_UNION_PROVIDER: 2,
  PROVIDER_TAG_CERTIFIED_PROVIDER: 3,
  PROVIDER_TAG_CHOSEN_PROVIDER: 4,
  PROVIDER_TAG_PREFERRED_PROVIDER: 5,
  PROVIDER_TAG_DIVVY_PROVIDER: 6,
  PROVIDER_TAG_QUOTED_PROVIDER: 7,
  PROVIDER_TAG_TOP_5: 8,
  PROVIDER_TAG_FORCE_MATCH: 9,
  PROVIDER_TAG_EXCLUSIVE_MATCH: 10,
  PROVIDER_TAG_PRIORITY_PROVIDER: 11,
  PROVIDER_TAG_FORCE_MATCH_POTENTIAL_PROVIDER: 12,
} as const;
export type ProviderTag = typeof ProviderTag[keyof typeof ProviderTag];

export const EvidenceType = {
  EVIDENCE_TYPE_BEFORE_IMAGES: 1,
  EVIDENCE_TYPE_AFTER_IMAGES: 2,
  EVIDENCE_TYPE_DURING_IMAGES: 3,
  EVIDENCE_TYPE_CUSTOMER_IMAGES: 4,
  EVIDENCE_TYPE_WORK_SCOPE: 5,
  EVIDENCE_TYPE_TICKET_SCOPE: 6,
  EVIDENCE_TYPE_VISIT_SUMMARY: 7,
  EVIDENCE_TYPE_TIME_SPENT_ON_VISIT: 8,
} as const;
export type EvidenceType = typeof EvidenceType[keyof typeof EvidenceType];

export const IndeterministicReason = {
  INDETERMINISTIC_REASON_UNSPECIFIED: 0,
  INDETERMINISTIC_REASON_INSUFFICIENT_EVIDENCE: 1,
  INDETERMINISTIC_REASON_MISSING_VISIT_PHOTOS: 3,
  INDETERMINISTIC_REASON_BAD_WORK_SCOPE: 4,
  INDETERMINISTIC_REASON_IMAGE_LIMIT_EXCEEDED: 5,
  INDETERMINISTIC_REASON_EMPTY_WINDOW_HISTORY: 6,
  INDETERMINISTIC_REASON_NO_INITIAL_ACTIONS: 7,
  INDETERMINISTIC_REASON_VISIT_IMAGES_TIMEOUT: 8,
  INDETERMINISTIC_REASON_WORKFLOW_TIMEOUT: 9,
} as const;
export type IndeterministicReason = typeof IndeterministicReason[keyof typeof IndeterministicReason];

// --- Response shapes ---

export interface PredictionResponse {
  is_recall: boolean;
  is_recall_v2: boolean;
  is_estimate: boolean;
  is_parts_and_order: boolean;
  service_type_id: string;
  service_line_id: string;
  is_project_work: boolean;
  enriched_ticket_scope: string;
  work_scope: string;
  work_type: string;
  asset: string;
  location: string;
  special_instructions: string;
  recommendation_id: string;
  work_complexity: string;
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  visit_id?: string;
  rationale: string;
}

export interface EvidenceContext {
  rationale: string;
  evidences: Evidence[];
}

export interface WorkAction {
  action_id: string;
  type: WorkActionType;
  category: WorkActionCategory;
  priority: WorkActionPriority;
  description: string;
  status: WorkActionStatus;
  creation_context?: EvidenceContext;
  status_update_context?: EvidenceContext;
}

export interface LaborHoursAssessment {
  is_appropriate: boolean;
  confidence: ConfidenceLevel;
  labor_prediction_id: string;
  exclusion_reason?: string;
}

export interface VerificationResults {
  complete_reason?: string;
  incomplete_reason?: string;
  indeterministic_reason?: IndeterministicReason;
  work_completion_status: WorkCompletionStatus;
  work_completion_confidence: ConfidenceLevel;
  labor_hours_assessment: LaborHoursAssessment;
  work_verification_rationale: string;
}

export interface ImageAnalysisResult {
  image_id: string;
  analysis: string;
  evidence_type: EvidenceType;
}

export interface FailureMetadata {
  reason: string;
  details?: string;
}

export interface WorkVerificationReportV2 {
  work_id: string;
  report_id: string;
  verification_report_status: VerificationReportStatus;
  work_actions: WorkAction[];
  image_analyses: ImageAnalysisResult[];
  verification_results: VerificationResults;
  failure_metadata?: FailureMetadata;
}

export interface ScorecardDetails {
  speed: {
    overall: number;
    on_time_arrival: number;
    time_to_work_done: number;
  };
  quality: {
    overall: number;
    first_time_complete: number;
    defect_free_jobs: number;
    app_compliance: number;
  };
  cost: {
    overall: number;
    used_under_nte: number;
    dispute_free: number;
  };
}

export interface ProviderScore {
  provider_id: string;
  provider_name: string;
  provider_address_id: string;
  score: number;
  is_probationary_provider: boolean;
  technician_count: number;
  provider_property_distance_in_miles: number;
  tags: ProviderTag[];
  is_provider_recommended_for_job: boolean;
  ai_rationale?: string;
  confidence?: ConfidenceLevel;
  behavior_labels?: string[];
  speed_score?: number;
  quality_score?: number;
  cost_score?: number;
  rating?: number;
  review_count?: number;
  jobs_completed?: number;
  scorecard_details?: ScorecardDetails;
}

export interface MatchResponse {
  providers: ProviderScore[];
  total_matched: number;
  filtration_stats?: FiltrationStat[];
}

export interface FiltrationStat {
  reason: string;
  count: number;
}

// --- App state types ---

export type AppStage = 'scenario' | 'module1' | 'module2' | 'module3' | 'summary';
export type Module1Screen = 'form' | 'processing' | 'output';
export type Module2Screen = 'processing' | 'results';
export type Module3Screen = 'photos' | 'processing' | 'report';

export interface DemoState {
  stage: AppStage;
  presenterMode: boolean;
  selectedScenario: string | null;
  m1Screen: Module1Screen;
  m1Input: IntakeFormInput;
  m1Response: PredictionResponse | null;
  m1WorkActions: WorkAction[];
  m2Screen: Module2Screen;
  m2Response: MatchResponse | null;
  assignedProvider: ProviderScore | null;
  m3Screen: Module3Screen;
  m3Response: WorkVerificationReportV2 | null;
}

export interface IntakeFormInput {
  property: string;
  description: string;
  service_line_input: string | null;
  urgency: 'emergency' | 'routine';
  customer: string;
}

export type DemoAction =
  | { type: 'SELECT_SCENARIO'; payload: string }
  | { type: 'SET_STAGE'; payload: AppStage }
  | { type: 'SET_M1_SCREEN'; payload: Module1Screen }
  | { type: 'SET_M1_INPUT'; payload: Partial<IntakeFormInput> }
  | { type: 'SET_M1_RESPONSE'; payload: PredictionResponse }
  | { type: 'SET_M1_WORK_ACTIONS'; payload: WorkAction[] }
  | { type: 'SET_M2_SCREEN'; payload: Module2Screen }
  | { type: 'SET_M2_RESPONSE'; payload: MatchResponse }
  | { type: 'SET_ASSIGNED_PROVIDER'; payload: ProviderScore }
  | { type: 'SET_M3_SCREEN'; payload: Module3Screen }
  | { type: 'SET_M3_RESPONSE'; payload: WorkVerificationReportV2 }
  | { type: 'SET_PRESENTER_MODE'; payload: boolean }
  | { type: 'RESET' };

// Behavior label display map
export const BEHAVIOR_LABEL_MAP: Record<string, string> = {
  property_veteran: 'PROPERTY VETERAN',
  reliable_acceptor: 'RELIABLE ACCEPTOR',
  customer_veteran: 'CUSTOMER VETERAN',
  high_performance_score: 'HIGH PERFORMANCE SCORE',
  defect_free_completion: 'DEFECT-FREE COMPLETION',
  on_time_arrival: 'ON-TIME ARRIVAL',
  highly_rated: 'HIGHLY RATED',
  active_viewer: 'ACTIVE VIEWER',
  chronic_ghoster: 'CHRONIC GHOSTER',
};

export const WORK_ACTION_TYPE_LABELS: Record<WorkActionType, string> = {
  0: 'UNSPECIFIED',
  1: 'ESSENTIAL',
  2: 'AUXILIARY',
  3: 'DOCUMENTATION',
};

export const WORK_ACTION_STATUS_LABELS: Record<WorkActionStatus, string> = {
  0: 'UNSPECIFIED',
  1: 'TODO',
  2: 'IN PROGRESS',
  3: 'COMPLETE',
  4: 'INCOMPLETE',
  5: 'NOT APPLICABLE',
  6: 'INCONCLUSIVE',
};

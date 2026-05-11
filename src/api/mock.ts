// Mock responses for development when the Demo Gateway is not running.
import {
  WorkActionType,
  WorkActionStatus,
  WorkActionCategory,
  WorkActionPriority,
  WorkCompletionStatus,
  ConfidenceLevel,
  VerificationReportStatus,
  EvidenceType,
  type PredictionResponse,
  type MatchResponse,
  type WorkVerificationReportV2,
  type WorkAction,
} from '@/data/types';

export const MOCK_QUALIFY_RESPONSE: PredictionResponse = {
  is_recall: false,
  is_recall_v2: false,
  is_estimate: false,
  is_parts_and_order: false,
  service_type_id: 'svc-type-plumbing-water-heater',
  service_line_id: 'svc-line-plumbing',
  is_project_work: false,
  enriched_ticket_scope:
    'Water heater pilot light out. No hot water at commercial dental office. Requires pilot inspection, cleaning, and re-ignition.',
  work_scope:
    'Inspect water heater pilot assembly at commercial dental facility. Clean pilot orifice and thermocouple. Re-ignite pilot per manufacturer procedure. Test hot water supply at nearest fixture. Verify steady pilot flame and normal water temperature recovery. Document findings and leave unit operational.',
  work_type: 'REPAIR',
  asset: 'Commercial Water Heater',
  location: 'Utility Room',
  special_instructions:
    'Contact store manager on arrival. Building requires sign-in at front desk. Unit is in rear utility room, key from manager.',
  recommendation_id: 'rec-a1b2c3d4',
  work_complexity: 'SIMPLE',
};

export const MOCK_WORK_ACTIONS: WorkAction[] = [
  {
    action_id: 'wa-000',
    type: WorkActionType.WORK_ACTION_TYPE_DOCUMENTATION,
    category: WorkActionCategory.WORK_ACTION_CATEGORY_OTHERS,
    priority: WorkActionPriority.WORK_ACTION_PRIORITY_HIGH,
    description: 'Identify yourself to site management at front desk, sign in, and be escorted to the utility room service location',
    status: WorkActionStatus.WORK_ACTION_STATUS_TODO,
    creation_context: {
      rationale: 'Commercial dental office requires sign-in and escort per special instructions. Establishing site contact ensures access and accountability.',
      evidences: [{ id: 'ev-spec-000', type: EvidenceType.EVIDENCE_TYPE_WORK_SCOPE, rationale: 'Special instructions specify front desk sign-in and manager escort.' }],
    },
  },
  {
    action_id: 'wa-001a',
    type: WorkActionType.WORK_ACTION_TYPE_DOCUMENTATION,
    category: WorkActionCategory.WORK_ACTION_CATEGORY_INSPECTION,
    priority: WorkActionPriority.WORK_ACTION_PRIORITY_HIGH,
    description: 'Take before photos of water heater unit, pilot assembly, and surrounding area documenting pre-service condition',
    status: WorkActionStatus.WORK_ACTION_STATUS_TODO,
    creation_context: {
      rationale: 'Before photos establish baseline condition for quality verification and protect both parties in scope disputes.',
      evidences: [],
    },
  },
  {
    action_id: 'wa-001',
    type: WorkActionType.WORK_ACTION_TYPE_ESSENTIAL,
    category: WorkActionCategory.WORK_ACTION_CATEGORY_INSPECTION,
    priority: WorkActionPriority.WORK_ACTION_PRIORITY_HIGH,
    description: 'Inspect pilot assembly and thermocouple for damage, corrosion, or carbon buildup',
    status: WorkActionStatus.WORK_ACTION_STATUS_TODO,
    creation_context: {
      rationale: 'Customer reported pilot light issue. Inspection of pilot assembly is required to determine root cause before any cleaning or re-ignition attempt.',
      evidences: [{ id: 'ev-scope-001', type: EvidenceType.EVIDENCE_TYPE_WORK_SCOPE, rationale: 'Work scope identifies pilot assembly inspection as primary task.' }],
    },
  },
  {
    action_id: 'wa-002',
    type: WorkActionType.WORK_ACTION_TYPE_ESSENTIAL,
    category: WorkActionCategory.WORK_ACTION_CATEGORY_CLEANING,
    priority: WorkActionPriority.WORK_ACTION_PRIORITY_HIGH,
    description: 'Clean pilot orifice, thermocouple tip, and burner assembly — remove soot and carbon deposits',
    status: WorkActionStatus.WORK_ACTION_STATUS_TODO,
    creation_context: {
      rationale: 'Thorough cleaning of all pilot components is necessary to ensure proper gas flow and reliable ignition.',
      evidences: [],
    },
  },
  {
    action_id: 'wa-003',
    type: WorkActionType.WORK_ACTION_TYPE_ESSENTIAL,
    category: WorkActionCategory.WORK_ACTION_CATEGORY_REPAIR,
    priority: WorkActionPriority.WORK_ACTION_PRIORITY_HIGH,
    description: 'Re-ignite pilot light following manufacturer procedure and verify stable, continuous blue flame',
    status: WorkActionStatus.WORK_ACTION_STATUS_TODO,
    creation_context: {
      rationale: 'Re-ignition is the primary resolution objective. Flame must be steady and blue to confirm safe and complete repair.',
      evidences: [],
    },
  },
  {
    action_id: 'wa-004',
    type: WorkActionType.WORK_ACTION_TYPE_AUXILIARY,
    category: WorkActionCategory.WORK_ACTION_CATEGORY_TESTING,
    priority: WorkActionPriority.WORK_ACTION_PRIORITY_MEDIUM,
    description: 'Test hot water supply at nearest fixture — run water and confirm temperature recovery to operational level',
    status: WorkActionStatus.WORK_ACTION_STATUS_TODO,
    creation_context: {
      rationale: 'End-to-end functional test confirms repair success and validates that service has been fully restored for the customer.',
      evidences: [],
    },
  },
  {
    action_id: 'wa-005',
    type: WorkActionType.WORK_ACTION_TYPE_DOCUMENTATION,
    category: WorkActionCategory.WORK_ACTION_CATEGORY_INSPECTION,
    priority: WorkActionPriority.WORK_ACTION_PRIORITY_HIGH,
    description: 'Take after photos of pilot assembly with flame visible, water heater controls, and faucet running hot water confirming service restoration',
    status: WorkActionStatus.WORK_ACTION_STATUS_TODO,
    creation_context: {
      rationale: 'After photos provide photographic proof of completion for AI quality verification and customer records.',
      evidences: [],
    },
  },
  {
    action_id: 'wa-006',
    type: WorkActionType.WORK_ACTION_TYPE_DOCUMENTATION,
    category: WorkActionCategory.WORK_ACTION_CATEGORY_OTHERS,
    priority: WorkActionPriority.WORK_ACTION_PRIORITY_HIGH,
    description: 'Clean up work area, return utility room to pre-service condition, and obtain site manager signature confirming hot water restoration before departure',
    status: WorkActionStatus.WORK_ACTION_STATUS_TODO,
    creation_context: {
      rationale: 'Site cleanliness and manager sign-off close the service loop and confirm customer satisfaction before the provider leaves the property.',
      evidences: [],
    },
  },
];

export const MOCK_MATCH_RESPONSE: MatchResponse = {
  total_matched: 51,
  providers: [
    {
      provider_id: 'prov-001',
      provider_name: 'Summit Plumbing Solutions',
      provider_address_id: 'addr-001',
      score: 94,
      is_probationary_provider: false,
      technician_count: 8,
      provider_property_distance_in_miles: 6.2,
      tags: [],
      is_provider_recommended_for_job: true,
      ai_rationale:
        'Summit has completed 12 plumbing jobs at this Heartland Dental location with a 100% acceptance rate and zero defects. They are the most reliable choice for a same-day emergency at this property and are currently available.',
      confidence: ConfidenceLevel.CONFIDENCE_LEVEL_HIGH,
      behavior_labels: ['property_veteran', 'reliable_acceptor'],
      speed_score: 83,
      quality_score: 90,
      cost_score: 84,
      rating: 4.7,
      review_count: 452,
      jobs_completed: 1444,
      scorecard_details: {
        speed: { overall: 83, on_time_arrival: 81, time_to_work_done: 89 },
        quality: { overall: 90, first_time_complete: 82, defect_free_jobs: 96, app_compliance: 92 },
        cost: { overall: 84, used_under_nte: 75, dispute_free: 93 },
      },
    },
    {
      provider_id: 'prov-002',
      provider_name: 'Central Illinois Mechanical',
      provider_address_id: 'addr-002',
      score: 87,
      is_probationary_provider: false,
      technician_count: 14,
      provider_property_distance_in_miles: 8.7,
      tags: [],
      is_provider_recommended_for_job: true,
      ai_rationale:
        'Strong regional player with 3 years of Heartland Dental history across 6 locations. High performance scorecard and certified Avetta provider. Reliable for emergency dispatch.',
      confidence: ConfidenceLevel.CONFIDENCE_LEVEL_HIGH,
      behavior_labels: ['customer_veteran', 'high_performance_score'],
      speed_score: 79,
      quality_score: 88,
      cost_score: 91,
      rating: 4.5,
      review_count: 218,
      jobs_completed: 873,
      scorecard_details: {
        speed: { overall: 79, on_time_arrival: 77, time_to_work_done: 84 },
        quality: { overall: 88, first_time_complete: 85, defect_free_jobs: 91, app_compliance: 89 },
        cost: { overall: 91, used_under_nte: 88, dispute_free: 95 },
      },
    },
    {
      provider_id: 'prov-003',
      provider_name: 'Midwest Pro Services',
      provider_address_id: 'addr-003',
      score: 81,
      is_probationary_provider: false,
      technician_count: 6,
      provider_property_distance_in_miles: 11.3,
      tags: [],
      is_provider_recommended_for_job: true,
      ai_rationale:
        'Qualified plumbing provider with solid on-time arrival history and defect-free completion rate. Broader geographic coverage means slightly longer response but strong capacity available today.',
      confidence: ConfidenceLevel.CONFIDENCE_LEVEL_MEDIUM,
      behavior_labels: ['on_time_arrival', 'defect_free_completion'],
      speed_score: 74,
      quality_score: 85,
      cost_score: 79,
      rating: 4.3,
      review_count: 124,
      jobs_completed: 392,
      scorecard_details: {
        speed: { overall: 74, on_time_arrival: 86, time_to_work_done: 71 },
        quality: { overall: 85, first_time_complete: 80, defect_free_jobs: 94, app_compliance: 82 },
        cost: { overall: 79, used_under_nte: 72, dispute_free: 88 },
      },
    },
  ],
  filtration_stats: [
    { reason: 'INSURANCE LAPSED OR MISSING', count: 14 },
    { reason: 'NO ACTIVE PLUMBING LICENSE', count: 8 },
    { reason: 'UNABLE TO MEET SLA', count: 5 },
    { reason: 'CUSTOMER BLOCK ON FILE', count: 2 },
  ],
};

export const MOCK_VERIFY_RESPONSE: WorkVerificationReportV2 = {
  work_id: 'DEMO_WV_PLUMBING_WATER_HEATER_01',
  report_id: 'rpt-abc123',
  verification_report_status: VerificationReportStatus.VERIFICATION_REPORT_STATUS_COMPLETED,
  work_actions: [
    {
      action_id: 'wa-001',
      type: WorkActionType.WORK_ACTION_TYPE_ESSENTIAL,
      category: WorkActionCategory.WORK_ACTION_CATEGORY_INSPECTION,
      priority: WorkActionPriority.WORK_ACTION_PRIORITY_HIGH,
      description: 'Inspect pilot assembly and thermocouple for damage or buildup',
      status: WorkActionStatus.WORK_ACTION_STATUS_COMPLETE,
      status_update_context: {
        rationale:
          'Before photo shows pilot assembly with visible soot buildup. After photo confirms cleaned assembly.',
        evidences: [
          {
            id: 'ev-img-before-1',
            type: EvidenceType.EVIDENCE_TYPE_BEFORE_IMAGES,
            visit_id: 'visit-001',
            rationale: 'Before image shows pilot assembly condition prior to cleaning.',
          },
        ],
      },
    },
    {
      action_id: 'wa-002',
      type: WorkActionType.WORK_ACTION_TYPE_ESSENTIAL,
      category: WorkActionCategory.WORK_ACTION_CATEGORY_CLEANING,
      priority: WorkActionPriority.WORK_ACTION_PRIORITY_HIGH,
      description: 'Clean pilot orifice and thermocouple',
      status: WorkActionStatus.WORK_ACTION_STATUS_COMPLETE,
      status_update_context: {
        rationale: 'During photo shows technician actively cleaning pilot components.',
        evidences: [
          {
            id: 'ev-img-during-1',
            type: EvidenceType.EVIDENCE_TYPE_DURING_IMAGES,
            visit_id: 'visit-001',
            rationale: 'During image documents cleaning procedure in progress.',
          },
        ],
      },
    },
    {
      action_id: 'wa-003',
      type: WorkActionType.WORK_ACTION_TYPE_ESSENTIAL,
      category: WorkActionCategory.WORK_ACTION_CATEGORY_REPAIR,
      priority: WorkActionPriority.WORK_ACTION_PRIORITY_HIGH,
      description: 'Re-ignite pilot light per manufacturer procedure and verify stable flame',
      status: WorkActionStatus.WORK_ACTION_STATUS_COMPLETE,
      status_update_context: {
        rationale:
          'After photo clearly shows pilot assembly with visible steady blue flame confirming successful re-ignition.',
        evidences: [
          {
            id: 'ev-img-after-1',
            type: EvidenceType.EVIDENCE_TYPE_AFTER_IMAGES,
            visit_id: 'visit-001',
            rationale: 'After image shows burning pilot flame confirming successful re-ignition.',
          },
        ],
      },
    },
    {
      action_id: 'wa-004',
      type: WorkActionType.WORK_ACTION_TYPE_AUXILIARY,
      category: WorkActionCategory.WORK_ACTION_CATEGORY_TESTING,
      priority: WorkActionPriority.WORK_ACTION_PRIORITY_MEDIUM,
      description: 'Test hot water supply at nearest fixture and verify temperature recovery',
      status: WorkActionStatus.WORK_ACTION_STATUS_COMPLETE,
      status_update_context: {
        rationale:
          'After photo shows technician running faucet with steam visible confirming hot water restored.',
        evidences: [
          {
            id: 'ev-img-after-2',
            type: EvidenceType.EVIDENCE_TYPE_AFTER_IMAGES,
            visit_id: 'visit-001',
            rationale: 'After image shows hot water flow test at sink fixture.',
          },
        ],
      },
    },
  ],
  image_analyses: [
    { image_id: 'img-before-1', analysis: 'Pilot assembly with soot buildup visible', evidence_type: EvidenceType.EVIDENCE_TYPE_BEFORE_IMAGES },
    { image_id: 'img-before-2', analysis: 'Water heater unit from front, pilot window dark', evidence_type: EvidenceType.EVIDENCE_TYPE_BEFORE_IMAGES },
    { image_id: 'img-before-3', analysis: 'Utility room context shot showing heater location', evidence_type: EvidenceType.EVIDENCE_TYPE_BEFORE_IMAGES },
    { image_id: 'img-during-1', analysis: 'Technician cleaning pilot orifice with brush', evidence_type: EvidenceType.EVIDENCE_TYPE_DURING_IMAGES },
    { image_id: 'img-during-2', analysis: 'Close-up of thermocouple being cleaned', evidence_type: EvidenceType.EVIDENCE_TYPE_DURING_IMAGES },
    { image_id: 'img-during-3', analysis: 'Technician following ignition procedure at controls', evidence_type: EvidenceType.EVIDENCE_TYPE_DURING_IMAGES },
    { image_id: 'img-after-1', analysis: 'Pilot assembly with steady blue flame visible', evidence_type: EvidenceType.EVIDENCE_TYPE_AFTER_IMAGES },
    { image_id: 'img-after-2', analysis: 'Hot water running at faucet, steam visible', evidence_type: EvidenceType.EVIDENCE_TYPE_AFTER_IMAGES },
    { image_id: 'img-after-3', analysis: 'Water heater controls showing proper operating temperature', evidence_type: EvidenceType.EVIDENCE_TYPE_AFTER_IMAGES },
  ],
  verification_results: {
    complete_reason:
      'All essential tasks completed and documented with photographic evidence across all visit windows.',
    work_completion_status: WorkCompletionStatus.WORK_COMPLETION_STATUS_COMPLETE,
    work_completion_confidence: ConfidenceLevel.CONFIDENCE_LEVEL_HIGH,
    labor_hours_assessment: {
      is_appropriate: true,
      confidence: ConfidenceLevel.CONFIDENCE_LEVEL_HIGH,
      labor_prediction_id: 'labor-pred-001',
    },
    work_verification_rationale:
      'The hot water heater pilot was successfully re-ignited as evidenced by the before and after photos showing the pilot assembly with visible flame in the after photos. All four required tasks were completed and documented with sufficient photographic evidence. Time on-site of 47 minutes is appropriate for pilot inspection, cleaning, and re-ignition work at this scope level.',
  },
};

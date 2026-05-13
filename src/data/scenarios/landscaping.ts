export const landscapingScenario = {
  scenario_id: 'routine-landscaping',
  label: 'Routine Landscaping Service',
  service_line: 'Landscaping',
  urgency: 'routine' as const,
  site_profile: 'Strip Mall',
  is_csa: true as const,

  input: {
    property: 'National Strip Mall – Columbus, OH',
    description: 'Monthly lawn mowing, edging, and debris cleanup needed for exterior common areas. Last service was 4 weeks ago.',
    service_line_input: 'landscaping',
    urgency: 'routine' as const,
    customer: '',
  },

  qualify_request: {
    ticket_scope: 'Monthly lawn mowing, edging, and debris cleanup for exterior common areas.',
    image_attachment_ids: [],
    service_line_id: 'landscaping',
  },

  match_request_template: {
    property_id: 'DEMO_STRIP_MALL_COLUMBUS_OH',
    is_emergency: false,
    minimum_matching_score: 55,
    minimum_providers_required: 3,
  },

  wv_demo_work_id: 'DEMO_WV_LANDSCAPING_01',
  map_center: [-82.9988, 39.9612] as [number, number],
};

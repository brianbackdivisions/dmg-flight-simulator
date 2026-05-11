export const hvacScenario = {
  scenario_id: 'hvac-not-cooling',
  label: 'HVAC Not Cooling',
  service_line: 'HVAC',
  urgency: 'emergency' as const,
  site_profile: 'National Pharmacy',

  input: {
    property: 'National Pharmacy – Austin, TX',
    description: 'AC not cooling. Store is hot. Customers complaining.',
    service_line_input: null,
    urgency: 'emergency' as const,
    customer: 'Walgreens',
  },

  qualify_request: {
    ticket_scope: 'AC not cooling. Store is hot. Customers complaining.',
    image_attachment_ids: [],
    service_line_id: null,
  },

  match_request_template: {
    property_id: 'DEMO_WALGREENS_AUSTIN_TX',
    is_emergency: true,
    minimum_matching_score: 60,
    minimum_providers_required: 3,
  },

  wv_demo_work_id: 'DEMO_WV_HVAC_NOT_COOLING_01',
  map_center: [-97.7431, 30.2672] as [number, number],
};

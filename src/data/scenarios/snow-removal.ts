export const snowRemovalScenario = {
  scenario_id: 'snow-removal',
  label: 'Snow Removal',
  service_line: 'Snow & Ice',
  urgency: 'routine' as const,
  site_profile: 'Grocery Store',
  is_csa: true as const,

  input: {
    property: 'National Grocery Store – Minneapolis, MN',
    description: 'Overnight snowfall of 4–6 inches. Parking lot, sidewalks, and fire lane need plowing and salt treatment before 7 AM store open.',
    service_line_input: 'snow-removal',
    urgency: 'routine' as const,
    customer: '',
  },

  qualify_request: {
    ticket_scope: 'Parking lot, sidewalks, and fire lane plowing and salt treatment after 4–6 inch snowfall.',
    image_attachment_ids: [],
    service_line_id: 'snow-removal',
  },

  match_request_template: {
    property_id: 'DEMO_GROCERY_MINNEAPOLIS_MN',
    is_emergency: false,
    minimum_matching_score: 55,
    minimum_providers_required: 3,
  },

  wv_demo_work_id: 'DEMO_WV_SNOW_REMOVAL_01',
  map_center: [-93.2650, 44.9778] as [number, number],
};

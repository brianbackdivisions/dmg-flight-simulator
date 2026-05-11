export const hotWaterHeaterScenario = {
  scenario_id: 'hot-water-heater',
  label: 'Hot Water Heater Repair',
  service_line: 'Plumbing',
  urgency: 'emergency' as const,

  input: {
    property: 'Heartland Dental – Bloomington, IL',
    description: "No hot water. Tried pilot. Doesn't seem to be running.",
    service_line_input: null,
    urgency: 'emergency' as const,
    customer: 'Heartland Dental',
  },

  qualify_request: {
    ticket_scope: "No hot water. Tried pilot. Doesn't seem to be running.",
    image_attachment_ids: [],
    service_line_id: null,
  },

  match_request_template: {
    property_id: 'DEMO_HEARTLAND_BLOOMINGTON_IL',
    is_emergency: true,
    minimum_matching_score: 60,
    minimum_providers_required: 3,
  },

  wv_demo_work_id: 'DEMO_WV_PLUMBING_WATER_HEATER_01',

  // Map center for Module 2
  map_center: [-88.9937, 40.4842] as [number, number],
};

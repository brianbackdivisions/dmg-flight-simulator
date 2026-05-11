export const ceilingTileScenario = {
  scenario_id: 'ceiling-tile-damage',
  label: 'Ceiling Tile Damage',
  service_line: 'General Maintenance',
  urgency: 'routine' as const,
  site_profile: 'Hardware Store',

  input: {
    property: 'National Hardware Store – Memphis, TN',
    description: 'Several ceiling tiles damaged and sagging near the back stockroom. Possible water damage.',
    service_line_input: null,
    urgency: 'routine' as const,
    customer: 'Dollar General',
  },

  qualify_request: {
    ticket_scope: 'Several ceiling tiles damaged and sagging near the back stockroom. Possible water damage.',
    image_attachment_ids: [],
    service_line_id: null,
  },

  match_request_template: {
    property_id: 'DEMO_DOLLAR_GENERAL_MEMPHIS_TN',
    is_emergency: false,
    minimum_matching_score: 60,
    minimum_providers_required: 3,
  },

  wv_demo_work_id: 'DEMO_WV_CEILING_TILE_01',
  map_center: [-90.048, 35.1495] as [number, number],
};

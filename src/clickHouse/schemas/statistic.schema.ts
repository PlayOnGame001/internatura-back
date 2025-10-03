// add this file
export const getEventsSchema = {
  tags: ['Statistics'],
  summary: 'Get paginated events with filters',
  description: 'Retrieves events from ClickHouse with filtering and pagination support',
  querystring: {
    type: 'object',
    properties: {
      page: { 
        type: 'number', 
        default: 1,
        minimum: 1,
        description: 'Page number (starts from 1)' 
      },
      limit: { 
        type: 'number', 
        default: 20,
        minimum: 1,
        maximum: 1000,
        description: 'Number of events per page (max 1000)' 
      },
      eventType: { 
        type: 'string',
        description: 'Filter by exact event type'
      },
      adUnit: { 
        type: 'string',
        description: 'Filter by exact ad unit'
      },
      creativeId: { 
        type: 'string',
        description: 'Filter by creative ID (partial match)'
      },
      cpmMin: { 
        type: 'number',
        description: 'Minimum CPM value'
      },
      cpmMax: { 
        type: 'number',
        description: 'Maximum CPM value'
      },
      date_from: { 
        type: 'string',
        format: 'date-time',
        description: 'Start date filter (ISO format)'
      },
      date_to: { 
        type: 'string',
        format: 'date-time',
        description: 'End date filter (ISO format)'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        total: { 
          type: 'number',
          description: 'Total number of events matching filters'
        },
        page: { 
          type: 'number',
          description: 'Current page number'
        },
        limit: { 
          type: 'number',
          description: 'Events per page'
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              eventType: { type: 'string' },
              ts: { type: 'string', format: 'date-time' },
              ts_ms: { type: 'number' },
              pageUrl: { type: 'string' },
              adUnit: { type: 'string' },
              creativeId: { type: 'string' },
              cpm: { type: 'number', nullable: true },
              adapter: { type: 'string' }
            },
            required: ['id', 'eventType', 'ts', 'ts_ms']
          }
        }
      },
      required: ['total', 'page', 'limit', 'data']
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      },
      required: ['error']
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      },
      required: ['error']
    }
  }
} as const;
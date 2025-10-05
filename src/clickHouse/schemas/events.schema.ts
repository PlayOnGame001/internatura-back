// add this file
export const postEventSchema = {
  tags: ['Statistics'],
  summary: 'Create statistics event(s)',
  description: 'Records one or multiple statistics events. Events are cached and periodically flushed to ClickHouse',
  body: {
    oneOf: [
      {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique event ID' },
          type: { type: 'string', description: 'Event type (alias for eventType)' },
          eventType: { type: 'string', description: 'Event type' },
          ts: { type: 'string', format: 'date-time', description: 'Timestamp ISO string' },
          ts_ms: { type: 'number', description: 'Timestamp in milliseconds' },
          pageUrl: { type: 'string', description: 'Page URL where event occurred' },
          referrer: { type: 'string', description: 'Referrer URL' },
          userAgent: { type: 'string', description: 'User agent string' },
          sessionId: { type: 'string', description: 'Session identifier' },
          pageViewId: { type: 'string', description: 'Page view identifier' },
          adUnit: { type: 'string', description: 'Ad unit identifier' },
          ad_unit: { type: 'string', description: 'Ad unit identifier (alias)' },
          adapter: { type: 'string', description: 'Adapter name' },
          creativeId: { type: 'string', description: 'Creative identifier' },
          creative_id: { type: 'string', description: 'Creative identifier (alias)' },
          cpm: { type: 'number', nullable: true, description: 'Cost per mille' },
          auctionId: { type: 'string', description: 'Auction identifier' },
          bidId: { type: 'string', description: 'Bid identifier' },
          latencyMs: { type: 'number', description: 'Latency in milliseconds' },
          extra: { type: 'object', additionalProperties: true, description: 'Additional metadata' }
        }
      },
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            eventType: { type: 'string' },
            ts: { type: 'string', format: 'date-time' },
            ts_ms: { type: 'number' },
            pageUrl: { type: 'string' },
            referrer: { type: 'string' },
            userAgent: { type: 'string' },
            sessionId: { type: 'string' },
            pageViewId: { type: 'string' },
            adUnit: { type: 'string' },
            ad_unit: { type: 'string' },
            adapter: { type: 'string' },
            creativeId: { type: 'string' },
            creative_id: { type: 'string' },
            cpm: { type: 'number', nullable: true },
            auctionId: { type: 'string' },
            bidId: { type: 'string' },
            latencyMs: { type: 'number' },
            extra: { type: 'object', additionalProperties: true }
          }
        }
      }
    ]
  },
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        inserted: { type: 'number' }
      },
      required: ['status', 'inserted']
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
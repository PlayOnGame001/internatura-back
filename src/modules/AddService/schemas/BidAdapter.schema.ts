export const bidRequestSchema = {
  body: {
    type: "object",
    required: ["size", "geo", "cpm"],
    properties: {
      size: { 
        type: "string",
        description: "Размер рекламного блока (например: 300x250, 728x90)",
        examples: ["300x250", "728x90", "160x600"]
      },
      geo: { 
        type: "string",
        description: "Геолокация (код страны)",
        examples: ["UA", "US", "PL"]
      },
      cpm: { 
        type: "number",
        minimum: 0,
        description: "Cost per mille (стоимость за 1000 показов)"
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "string" },
        size: { type: "string" },
        adType: { type: "string" },
        creativeUrl: { type: "string", format: "uri" },
      },
      required: ["id", "size", "adType", "creativeUrl"],
    },
    204: {
      type: "null",
      description: "Нет подходящих объявлений",
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
      required: ["error"],
    },
  },
} as const;

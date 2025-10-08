export const lineItemFormSchema = {
  consumes: ['multipart/form-data'],
  body: {
    type: "object",
    required: ["size", "minCpm", "maxCpm", "adType", "frequency", "creative"],
    properties: {
      size: { 
        type: "string",
        description: "Размер рекламного блока",
        examples: ["300x250", "728x90", "160x600"]
      },
      minCpm: { 
        type: "number",
        minimum: 0,
        description: "Минимальная ставка CPM"
      },
      maxCpm: { 
        type: "number",
        minimum: 0,
        description: "Максимальная ставка CPM"
      },
      geo: { 
        type: "string",
        description: "Геолокация (код страны)",
        examples: ["UA", "US", "PL"],
        nullable: true
      },
      adType: { 
        type: "string",
        enum: ["banner", "video"],
        description: "Тип рекламы"
      },
      frequency: { 
        type: "integer",
        minimum: 1,
        default: 1,
        description: "Частота показа"
      },
      creative: {
        type: "string",
        format: "binary",
        description: "Файл креатива (изображение или видео)"
      }
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        ok: { type: "boolean" },
        lineItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            size: { type: "string" },
            minCpm: { type: "number" },
            maxCpm: { type: "number" },
            geo: { type: "string", nullable: true },
            adType: { type: "string" },
            frequency: { type: "integer" },
            creativeUrl: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
      required: ["ok", "lineItem"],
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
      required: ["error"],
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

export const getAllLineItemsSchema = {
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          size: { type: "string" },
          minCpm: { type: "number" },
          maxCpm: { type: "number" },
          geo: { type: "string", nullable: true },
          adType: { type: "string" },
          frequency: { type: "integer" },
          creativeUrl: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["id", "size", "minCpm", "maxCpm", "adType", "frequency", "creativeUrl", "createdAt"],
      },
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

export const renderFormSchema = {
  hide: true,
} as const;
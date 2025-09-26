export const parseArticleSchema = {
  querystring: {
    type: "object",
    required: ["url"],
    properties: {
      url: { type: "string", format: "uri" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        url: { type: "string" },
        title: { type: "string" },
        content: { type: "string" },
      },
      required: ["url", "title", "content"],
    },
    400: {
      type: "object",
      properties: { error: { type: "string" } },
      required: ["error"],
    },
    500: {
      type: "object",
      properties: { error: { type: "string" } },
      required: ["error"],
    },
  },
} as const;

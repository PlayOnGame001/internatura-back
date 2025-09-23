export const parseFeedSchema = {
  querystring: {
    type: "object",
    required: ["url"],
    properties: {
      url: { type: "string", format: "uri" },
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          link: { type: "string" },
          pubDate: { type: "string" },
          content: { type: "string" },
        },
        required: ["title", "link"],
      },
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

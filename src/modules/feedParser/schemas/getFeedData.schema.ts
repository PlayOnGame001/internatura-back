export const schema = {
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string", nullable: true },
          url: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["id", "url", "createdAt"],
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

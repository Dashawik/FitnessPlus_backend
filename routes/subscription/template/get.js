module.exports = (fastify, opts, next) => {
  fastify.get(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: {
              type: "number",
              minimum: 1,
              errorMessage: {
                type: "ID must be a number",
                minimum: "ID must be greater than 0",
              },
            },
          },
          required: ["id"],
        },
      },
    },
    handler
  );

  next();
};

async function handler(request, reply) {
  const { getSubscriptionTemplateById } = require("@db/subscriptionTemplate");
  const { id } = request.params;

  const template = await getSubscriptionTemplateById(id);

  if (!template) {
    return reply
      .status(404)
      .send({ details: ["Subscription template not found"] });
  }

  return reply.status(200).send(template);
}

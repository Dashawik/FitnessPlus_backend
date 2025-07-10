module.exports = (fastify, opts, next) => {
  fastify.put(
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
        body: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 32,
              errorMessage: {
                type: "Name must be a string",
                minLength: "Name must be at least 2 characters long",
                maxLength: "Name must be no more than 32 characters long",
              },
            },
            price: {
              type: "number",
              minimum: 0,
              errorMessage: {
                type: "Price must be a number",
                minimum: "Price must be a non-negative number",
              },
            },
            sessionLimit: {
              type: "number",
              minimum: 0,
              errorMessage: {
                type: "Session limit must be a number",
                minimum: "Session limit must be a non-negative number",
              },
            },
          },
          required: ["name", "price"],
        },
      },
    },
    handler
  );

  next();
};

async function handler(request, reply) {
  const {
    updateSubscriptionTemplate,
    getSubscriptionTemplateById,
    findByName,
  } = require("@db/subscriptionTemplate");

  const { id } = request.params;
  const { name, price, sessionLimit } = request.body;

  const existing = await getSubscriptionTemplateById(id);
  if (!existing) {
    return reply
      .status(404)
      .send({ details: ["Subscription template not found"] });
  }

  const duplicate = await findByName(name);
  if (duplicate && duplicate.id !== id) {
    return reply.status(400).send({
      details: ["Subscription template with this name already exists"],
    });
  }

  const updated = await updateSubscriptionTemplate(id, {
    name,
    price,
    sessionLimit,
  });

  if (!updated) {
    return reply
      .status(400)
      .send({ details: ["Failed to update subscription template"] });
  }

  return reply.status(200).send({
    details: ["Subscription template updated successfully"],
  });
}

module.exports = (fastify, opts, next) => {
  fastify.post(
    "/",
    {
      schema: {
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
    createSubscriptionTemplate,
    findByName,
  } = require("@db/subscriptionTemplate");

  const { name, price, sessionLimit } = request.body;
  const existingType = await findByName(name);
  if (existingType) {
    return reply
      .status(400)
      .send({
        details: ["Subscription template with this name already exists"],
      });
  }
  await createSubscriptionTemplate({ name, price, sessionLimit });
  return reply
    .status(201)
    .send({ details: ["Subscription template created successfully"] });
}

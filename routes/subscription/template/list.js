module.exports = (fastify, opts, next) => {
  fastify.get("/", {}, handler);

  next();
};
async function handler(request, reply) {
  const { getAllSubscriptionTemplates } = require("@db/subscriptionTemplate");

  const templates = await getAllSubscriptionTemplates();

  return reply.status(200).send(templates);
}

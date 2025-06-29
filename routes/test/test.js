

module.exports = (fastify, opts, next) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authorize(["ADMIN", "MODERATOR"]),
      ],
    },
    handler.bind(null, fastify)
  );

  next();
};

async function handler(fastify, request, reply) {
  reply.send("hello world");
}

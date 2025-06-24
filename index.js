
require("dotenv").config();
require("module-alias/register");
const path = require('path')
const fastify = require("fastify")({
  logger: true,
  ajv: {
    customOptions: { allErrors: true },
    plugins: [[require("ajv-errors")]],
  },
});
require("@plugins/auth")(fastify);
require("@utils/jwt")(fastify);
fastify.register(require('@fastify/autoload'), {
  dir: path.join(__dirname, "routes"),
});

fastify.register(require("@fastify/cors"), {
  hook: "preValidation",
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

fastify.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    const formattedErrors = error.validation.map((err) => err.message);
    reply.status(400).send({
      error: "Validation Error",
      details: formattedErrors,
    });
  } else {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

const start = async () => {
  try {
    const address = await fastify.listen({ port: 3001, host: "0.0.0.0" });

    console.log(`Server running on ${address}`);
    console.log(fastify.printRoutes());
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();


module.exports = (fastify) => {
  const jwt = require("jsonwebtoken");

  fastify.decorate("authorize", (requiredRole) => {
    return async (request, reply) => {
      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        reply.status(401).send({ error: "No token provided" });
        return;
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
        request.user = decoded;
      } catch (err) {
        reply.status(401).send({ error: "Unauthorized" });
        return;
      }

      const user = request.user;
      if (!user || !user.role) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      const hasPermission = requiredRole.indexOf(user.role);

      if (hasPermission === -1) {
        return reply.code(403).send({ message: "Forbidden" });
      }
    };
  });

  fastify.decorate("authenticateRefresh", async (request, reply) => {
    try {
      const token = request.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
      request.token = token;
      request.user = decoded;
    } catch (err) {
      reply.code(401).send({ message: "Unauthorized" });
    }
  });
};

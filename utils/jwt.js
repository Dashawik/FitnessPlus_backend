module.exports = (fastify) => {
  const jwt = require("jsonwebtoken");

  fastify.decorate("generateAccess", async (userId) => {

    const { getDataForAccess } = require("@db/user");
    const data = await getDataForAccess(userId);

    const accessToken = jwt.sign(
      data, process.env.JWT_SECRET_ACCESS, {
      expiresIn: "5m"
    }
    )
    return { accessToken, data };
  })

  fastify.decorate("generateRefresh", async (userId) => {

    const refreshToken = jwt.sign(
      { id: userId }, process.env.JWT_SECRET_REFRESH, {
      expiresIn: "30d"
    }
    )
    return refreshToken;
  })
}
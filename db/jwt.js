const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
  async upsertJWT(userId, token) {
    return await prisma.JWT.upsert({
      where: { userId },
      update: { token },
      create: { userId, token }
    })
  },

  async getJWTByUserId(userId) {
    return await prisma.JWT.findUnique({
      where: { userId }
    });
  },

  async deleteJWTByUserId(userId) {
    return await prisma.JWT.delete({
      where: { userId }
    });
  },

  async updateUsage(userId) {
    return await prisma.JWT.update({
      where: { userId },
      data: { lastUsedAt: new Date() }
    });
  }
};


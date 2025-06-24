const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
  async upsertToken(userId, type, token) {
    return await prisma.token.upsert({
      where: { userId_type: { userId, type } },
      update: { token },
      create: { userId, type, token }
    });
  },
  async getByUserIdAndType(userId, type) {
    return await prisma.token.findUnique({
      where: { userId_type: { userId, type } }
    });
  },

  async deleteByUserIdAndType(userId, type) {
    return await prisma.token.delete({
      where: { userId_type: { userId, type } }
    });
  },

  async getTokenInfo(token) {
    return await prisma.token.findUnique({
      where: { token }
    });
  }
};


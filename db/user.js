const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
module.exports = {
  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  async createUser(email, firstName, lastName, password) {
    return await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password
      }
    });
  },

  async getDataForAccess(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    });
  },

  async updateVerification(userId, verified) {
    return await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: verified }
    });
  },

  async updatePassword(userId, password) {
    return await prisma.user.update({
      where: { id: userId },
      data: { password }
    });
  }
};


const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

module.exports = {
  async getTrainingTypeById(id) {
    return await prisma.trainingType.findUnique({
      where: { id },
    });
  },

  async createTrainingType(name) {
    return await prisma.trainingType.create({
      data: {
        name,
      },
    });
  },

  async updateTrainingType(id, name) {
    return await prisma.trainingType.update({
      where: { id },
      data: { name },
    });
  },

  async deleteTrainingType(id) {
    return await prisma.trainingType.delete({
      where: { id },
    });
  },

  async getAllTrainingTypes() {
    return await prisma.trainingType.findMany();
  },

  async findbyName(name) {
    return await prisma.trainingType.findFirst({
      where: { name },
    });
  }
};

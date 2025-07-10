const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {

  async createSubscriptionTemplate({ name, price, sessionLimit }) {
    return await prisma.subscriptionTemplate.create({
      data: {
        name,
        price,
        sessionLimit
      },
    });
  },

  async updateSubscriptionTemplate(id, data) {
    return await prisma.subscriptionTemplate.update({
      where: { id },
      data,
    });
  },

  async deleteSubscriptionTemplate(id) {
    return await prisma.subscriptionTemplate.delete({
      where: { id }
    });
  },

  async getSubscriptionTemplateById(id) {
    return await prisma.subscriptionTemplate.findUnique({
      where: { id }
    });
  },

  async getAllSubscriptionTemplates() {
    return await prisma.subscriptionTemplate.findMany();
  },

  async findByName(name) {
    return await prisma.subscriptionTemplate.findUnique({
      where: { name }
    });

  },
};

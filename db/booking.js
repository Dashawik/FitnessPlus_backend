const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
    async createBooking(userId, trainingId) {
        return await prisma.booking.create({
            data: {
                userId,
                trainingId,
            },
        });
    },

    async findByUserIdAndTrainingId(userId, trainingId) {
        return await prisma.booking.findFirst({
            where: {
                userId,
                trainingId,
            },
        });
    },

    async getBookedSpots(trainingId) {
        return await prisma.booking.count({
            where: {
                trainingId,
                status: 'ACTIVE',
            },
        });
    }
};


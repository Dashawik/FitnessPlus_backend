const { PrismaClient } = require('../generated/prisma');
const update = require('../routes/training/update');
const prisma = new PrismaClient();


module.exports = {
    async createTraining(startTime, endTime, typeId, trainerId, availableSpots) {
        return await prisma.training.create({
            data: {
                startTime,
                endTime,
                typeId,
                trainerId,
                availableSpots
            },
        });
    },


    async hasConflict(trainerId, endTime, startTime) {
        return await prisma.training.findFirst({
            where: {
                trainerId,
                OR: [
                    {
                        startTime: {
                            lt: endTime,
                        },
                        endTime: {
                            gt: startTime
                        },
                    },
                ],
            },

        });
    },

    async getTrainingById(id) {
        return await prisma.training.findUnique({
            where: { id },
            select: {
                id: true,
                startTime: true,
                endTime: true,
                typeId: true,
                type: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                trainerId: true,
                trainer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                availableSpots: true,
            },
        });
    },

    async getByDate(startTime, endTime, trainerId = undefined) {
        return await prisma.training.findMany({
            where: {
                trainerId,
                startTime: {
                    gte: startTime,
                },
                endTime: {
                    lte: endTime,
                },
            },
            orderBy: {
                startTime: 'asc',
            },

            select: {
                id: true,
                startTime: true,
                endTime: true,
                typeId: true,
                type: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                trainerId: true,
                trainer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                availableSpots: true,
            },
        });
    },

    async updateTraining(id, startTime, endTime, typeId, trainerId, availableSpots) {
        return await prisma.training.update({
            where: { id },
            data: {
                startTime,
                endTime,
                typeId,
                trainerId,
                availableSpots
            },
        });
    },

    async deleteTraining(id) {
        return await prisma.training.delete({
            where: { id },
        });
    },

    async getavailableSpots(id) {
        return await prisma.training.findUnique({
            where: { id },
            select: {
                availableSpots: true,
            },
        });
    }
}
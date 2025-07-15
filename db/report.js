const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

module.exports = {
    async getPopularTrainingTypes() {
        return await prisma.$queryRaw`
  SELECT 
    tt.name AS training_type,
    COUNT(b.id) AS booking_count,
    (COUNT(b.id) * 100.0 / (SELECT COUNT(*) FROM Booking)) AS percentage
  FROM Training t
  JOIN TrainingType tt ON t.typeId = tt.id
  LEFT JOIN Booking b ON t.id = b.trainingId
  GROUP BY tt.id, tt.name
  ORDER BY percentage DESC;
`;
    },

    async getTrainingActivityByDay() {
        return await prisma.$queryRaw`
      SELECT 
        day_of_week,
        training_count
      FROM (
        SELECT 
          DAYNAME(t.startTime) AS day_of_week,
          COUNT(t.id) AS training_count
        FROM Training t
        GROUP BY DAYNAME(t.startTime)
      ) AS subquery
      ORDER BY 
        FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
    `;
    },

    async getBookingsPerTrainer() {
        return await prisma.$queryRaw`
      SELECT 
        u.firstName,
        u.lastName,
        COUNT(b.id) AS booking_count
      FROM User u
      JOIN Training t ON u.id = t.trainerId
      LEFT JOIN Booking b ON t.id = b.trainingId
      WHERE u.role = 'TRAINER'
      GROUP BY u.id, u.firstName, u.lastName
      ORDER BY booking_count DESC;
    `;
    },
};

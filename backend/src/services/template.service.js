const prisma = require("../lib/prisma");

const getAllTemplates = async () => {
  return await prisma.template.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getTemplateById = async (id) => {
  return await prisma.template.findUnique({
    where: {
      id,
    },
    include: {
      pages: {
        orderBy: {
          order: "asc",
        },
        include: {
          sections: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });
};

module.exports = {
  getAllTemplates,
  getTemplateById,
};
const { sequelize } = require('./db/models');

sequelize.showAllSchemas({ logging: false }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    try{
      await sequelize.createSchema(process.env.SCHEMA);
    } catch {
      throw new Error('Create schema failed.')
    }
  }
});

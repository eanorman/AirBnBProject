const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    use_env_variable: "postgres://app_academy_projects_6yg2_user:CvcSYIg1ZZ0PodNMZ684NYoQyIv6rhcS@dpg-chrt8ngrddl7atfa6ne0-a/app_academy_projects_6yg2",
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA
    }
  }
};

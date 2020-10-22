const Sequelize = require('sequelize');
const config = require('./config');
const { isInTestMode } = require('../utility');

let db = null;
const models = new Map();

module.exports.getDatabase = () => {
  const makeDb = async () => {
    const sequelize = isInTestMode()
      ? new Sequelize('sqlite::memory:')
      : new Sequelize(config.database, config.user, config.password, {
          host: config.host,
          port: config.port,
          dialect: 'mysql',
          pool: {
            max: 5,
            min: 0,
            idle: 10000,
          },
        });

    try {
      await sequelize.authenticate();
      console.log('Connection established successfully.');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
      sequelize.close();
    }
    return sequelize;
  };

  return {
    getSequelize: async () => {
      if (!db) {
        db = await makeDb();
      }
      return db;
    },
    cacheModel: (key, model) => {
      models.set(key, model);
    },
    loadModel: (key) => {
      return models.get(key);
    },
  };
};

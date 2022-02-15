const { Sequelize } = require('sequelize');


const db = new Sequelize('uptasknade', 'root', 'rute', {
  host: '127.0.0.1',
  port: '3306',
  dialect: 'mysql',
  define:{
      timestamps: false
  },

});

module.exports= db;
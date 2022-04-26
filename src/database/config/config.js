require('dotenv').config();

module.exports = {
  "development": {
    "username": "bertedeco",
    "password": "_kf54kJp*j2RJKe",
    "database": "bertedeco_mario_zabala",
    "host": "mysql-bertedeco.alwaysdata.net",
    "dialect": "mysql",
    "port": 3306
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "port": process.env.DB_PORT
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

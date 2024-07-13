// config.js
const config = {
    user: 'sa',
    password: 'sg@2301519',
    server: 'localhost',
    database: 'DB-Lab',
    options: {
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

const url = `jbdc://192.168.241.7:3389;databaseName=DB-Lab`

module.exports = config;
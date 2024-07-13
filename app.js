const fastify = require('fastify')({ logger: true });
const sql = require('mssql');
const routes = require('./routes');
const config = require('./db/config');
const { createTables } = require('./db/table');

// Connect to the database
const startDatabase = async () => {
    try {
        await sql.connect(config);
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};

// Register routes
fastify.register(routes);

// Start the server
const startServer = async () => {
    try {
        await startDatabase();
        // await createTables();
        await fastify.listen(3000, '0.0.0.0');
        console.log('Server running at http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

startServer();

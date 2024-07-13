const { createFlight, createAirline, createAirplane, bookFlight, receiveService } = require('./controllers/createController');
const { getFlights, getFlightsByAccountId, getAccountsByFlightId } = require('./controllers/listController');
const { register, login } = require('./controllers/userController');

const routes = async (fastify, options) => {
    fastify.post('/flights', createFlight);
    fastify.post('/airlines', createAirline);
    fastify.post('/airplanes', createAirplane);
    fastify.get('/flights', getFlights);
    fastify.post('/book-flight', bookFlight);
    fastify.post('/receive-service', receiveService);
    fastify.post("/login", login);
    fastify.post("/register", register);
    fastify.get('/flights-acc', getFlightsByAccountId);
    fastify.get('/users-flight', getAccountsByFlightId);

}

module.exports = routes
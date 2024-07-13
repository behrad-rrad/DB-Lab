const sql = require('mssql');
const config = require('../db/config');

const getFlights = async (request, reply) => {
    try {
        const { destination } = request.query;
        // Connect to the database
        const pool = await sql.connect(config);

        // Build the SQL query with optional destination filtering
        let query = `
            SELECT 
                Flight.ID AS FlightID, Flight.Origin, Flight.Destination, Flight.Price, 
                Flight.FlightDuration, Flight.LandTime, Flight.TakeOffTime,
                Airplane.AirplaneNumber, Airplane.Capacity,
                Airline.ID AS AirlineID, Airline.Name AS AirlineName, Airline.Country AS AirlineCountry
            FROM Flight
            JOIN Airplane ON Flight.AirplaneNumber = Airplane.AirplaneNumber
            JOIN Airline ON Flight.AirlineNumber = Airline.ID
        `;

        if (destination) {
            query += ' WHERE Flight.Destination = @destination';
        }

        // Execute the query
        const requestQuery = pool.request();
        if (destination) {
            requestQuery.input('destination', sql.NVarChar, destination);
        }

        const result = await requestQuery.query(query);

        // Respond with the flights information
        reply.code(200).send(result.recordset);
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Server error' });
    }
};

const getFlightsByAccountId = async (request, reply) => {
    try {
        const { AccountId } = request.query;
        // Connect to the database
        const pool = await sql.connect(config);

        // Build the SQL query to get flights by AccountId
        const query = `
            SELECT Flight.ID, Flight.Origin, Flight.Destination, Flight.Price, 
                Flight.FlightDuration, Flight.LandTime, Flight.TakeOffTime
            FROM Flight
            JOIN Booked_Flights ON Flight.ID = Booked_Flights.FlightId
            WHERE Booked_Flights.AccountId = @AccountId
        `;

        // Execute the query
        const result = await pool.request()
            .input('AccountId', sql.Int, AccountId)
            .query(query);

        // Respond with the flights information
        reply.code(200).send(result.recordset);
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Server error' });
    }
};

const getAccountsByFlightId = async (request, reply) => {
    try {
        const { flightId } = request.query;
        // Connect to the database
        const pool = await sql.connect(config);

        // Build the SQL query to get Accounts by flightId
        const query = `
            SELECT Account.ID, Account.FirstName, Account.LastName, Account.MobileNumber, Account.NationalCode
            FROM Account
            JOIN Booked_Flights ON Account.ID = Booked_Flights.AccountId
            WHERE Booked_Flights.FlightId = @flightId
        `;

        // Execute the query
        const result = await pool.request()
            .input('flightId', sql.Int, flightId)
            .query(query);

        // Respond with the Accounts information
        reply.code(200).send(result.recordset);
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Server error' });
    }
};


module.exports = { getFlights,getAccountsByFlightId,getFlightsByAccountId }
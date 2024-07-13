const sql = require('mssql');
const config = require('../db/config');

const createFlight = async (request, reply) => {
    try {
        const { Origin, Destination,
            Price, AirplaneNumber,
            AirlineNumber, FlightDuration,
            LandTime, TakeOffTime } = request.body

        const pool = await sql.connect(config)

        // Insert the new flight into the Flight table
        const result = await pool.request()
            .input('Origin', sql.NVarChar, Origin)
            .input('Destination', sql.NVarChar, Destination)
            .input('Price', sql.Decimal(18, 2), Price)
            .input('AirplaneNumber', sql.Int, AirplaneNumber)
            .input('AirlineNumber', sql.Int, AirlineNumber)
            .input('FlightDuration', sql.NVarChar, FlightDuration)
            .input('LandTime', sql.DateTime, new Date(LandTime))
            .input('TakeOffTime', sql.DateTime, new Date(TakeOffTime))
            .query(`
                INSERT INTO Flight (Origin, Destination, Price, AirplaneNumber, AirlineNumber, FlightDuration, LandTime, TakeOffTime)
                VALUES (@Origin, @Destination, @Price, @AirplaneNumber, @AirlineNumber, @FlightDuration, @LandTime, @TakeOffTime)
            `);

        reply.code(201).send({ result});
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Server error' });
    }
}

const createAirline = async (request, reply) => {
    try {
        const { Name, Country } = request.body;

        // Validate required fields
        if (!Name || !Country) {
            return reply.code(400).send({ error: 'Missing required fields' });
        }

        // Connect to the database
        const pool = await sql.connect(config);

        // Insert the new airline into the Airline table
        const result = await pool.request()
            .input('Name', sql.NVarChar, Name)
            .input('Country', sql.NVarChar, Country)
            .query(`
                INSERT INTO Airline (Name, Country)
                VALUES (@Name, @Country)
            `);

        // Respond with the newly created airline ID
        reply.code(201).send({ result });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Server error' });
    }
};

const createAirplane = async (request, reply) => {
    try {
        const { AirplaneNumber, AirlineNumber, Capacity } = request.body;

        // Validate required fields
        if (!AirplaneNumber || !AirlineNumber || !Capacity) {
            return reply.code(400).send({ error: 'Missing required fields' });
        }

        // Connect to the database
        const pool = await sql.connect(config);

        // Insert the new airplane into the Airplane table
        const result = await pool.request()
            .input('AirplaneNumber', sql.Int, AirplaneNumber)
            .input('AirlineNumber', sql.Int, AirlineNumber)
            .input('Capacity', sql.Int, Capacity)
            .query(`
                INSERT INTO Airplane (AirplaneNumber, AirlineNumber, Capacity)
                VALUES (@AirplaneNumber, @AirlineNumber, @Capacity)
            `);

        // Respond with the newly created airplane number
        reply.code(201).send({ result});
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Server error' });
    }
};

const bookFlight = async (request, reply) => {
    try {
        const { AccountId, FlightId } = request.body;

        // Validate required fields
        if (!AccountId || !FlightId) {
            return reply.code(400).send({ error: 'Missing required fields' });
        }

        // Connect to the database
        const pool = await sql.connect(config);

        // Insert the new booking into the Booked_Flights table
        await pool.request()
            .input('AccountId', sql.Int, AccountId)
            .input('FlightId', sql.Int, FlightId)
            .query(`
                INSERT INTO Booked_Flights (AccountId, FlightId)
                VALUES (@AccountId, @FlightId)
            `);

        // Respond with success message
        reply.code(201).send({ message: 'Flight booked successfully' });
    } catch (error) {
        if (error.code === 'EREQUEST' && error.originalError.info.number === 2627) {
            // Handle unique constraint violation
            reply.code(409).send({ error: 'This flight is already booked by the Account' });
        } else {
            console.error(error);
            reply.code(500).send({ error: 'Server error' });
        }
    }
};

const receiveService = async (request, reply) => {
    try {
        const { AccountID, WheelchairService, Attendant, AirlineNumber } = request.body;

        // Validate required fields
        if (!AccountID || !AirlineNumber) {
            return reply.code(400).send({ error: 'Missing required fields' });
        }

        // Connect to the database
        const pool = await sql.connect(config);

        // Insert the new received service into the ReceivedServices table
        const result = await pool.request()
            .input('AccountID', sql.Int, AccountID)
            .input('WheelchairService', sql.NVarChar, WheelchairService)
            .input('Attendant', sql.NVarChar, Attendant)
            .input('AirlineNumber', sql.Int, AirlineNumber)
            .query(`
                INSERT INTO ReceivedServices (AccountID, WheelchairService, Attendant, AirlineNumber)
                VALUES (@AccountID, @WheelchairService, @Attendant, @AirlineNumber)
            `);

        // Respond with the ID of the newly created service record
        reply.code(201).send({ result });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Server error' });
    }
};

module.exports = { createAirline, createAirplane, createFlight, bookFlight, receiveService }
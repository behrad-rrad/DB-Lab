const sql = require('mssql');
const config = require('./config');
async function createTables() {
    try {
        // Connect to the database
        let pool = await sql.connect(config);

        // Create Account table
        await pool.request().query(`
            CREATE TABLE Account (
                ID INT PRIMARY KEY IDENTITY(1,1),
                FirstName NVARCHAR(100),
                LastName NVARCHAR(100),
                Password VARCHAR(256),
                MobileNumber NVARCHAR(20),
                NationalCode NVARCHAR(10)
            )
        `);
        console.log(`Account`);

        await pool.request().query(`
                CREATE TABLE Airline (
                    ID INT PRIMARY KEY IDENTITY(1,1),
                    Name NVARCHAR(100),
                    Country NVARCHAR(100)
                )
            `);
            console.log("airline");

        // Create Airplane table
        await pool.request().query(`
            CREATE TABLE Airplane (
                AirplaneNumber INT PRIMARY KEY,
                AirlineNumber INT FOREIGN KEY REFERENCES Airline(ID),
                Capacity INT,
            )
        `);
console.log("airplace");

        // Create Flight table
        await pool.request().query(`
            CREATE TABLE Flight (
                ID INT PRIMARY KEY IDENTITY(1,1),
                Origin NVARCHAR(100),
                Destination NVARCHAR(100),
                Price DECIMAL(18, 2),
                AirplaneNumber INT FOREIGN KEY REFERENCES Airplane(AirplaneNumber),
                AirlineNumber INT FOREIGN KEY REFERENCES Airline(ID),
                FlightDuration NVARCHAR(50),
                LandTime DATETIME,
                TakeOffTime DATETIME,
            )
        `);
console.log("Flight");
        await pool.request().query(`
                CREATE TABLE Booked_Flights (
                    AccountId INT FOREIGN KEY REFERENCES Account(ID),
                    FlightId INT FOREIGN KEY REFERENCES Flight(ID),
                    CONSTRAINT UC_AccountFlight UNIQUE (AccountId, FlightId)
                )
            `)
console.log("bookd");
        // Create ReceivedServices table
        await pool.request().query(`
            CREATE TABLE ReceivedServices (
                ID INT PRIMARY KEY IDENTITY(1,1),
                AccountID INT FOREIGN KEY REFERENCES Account(ID),
                WheelchairService NVARCHAR(100),
                Attendant NVARCHAR(100),
                AirlineNumber INT FOREIGN KEY REFERENCES Airline(ID),
            )
        `);
console.log("services");
        console.log('Tables created successfully!');
        pool.close();
    } catch (err) {
        console.error('Error creating tables:', err);
    }
}

module.exports = { createTables }
const sql = require('mssql');
const config = require('../db/config');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (request, reply) => {
    try {
        const { firstName, lastName, mobileNumber, nationalCode, password } = request.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MobileNumber', mobileNumber)
            .query('SELECT * FROM [Account] WHERE MobileNumber = @MobileNumber')

        if (result.recordset.length > 0) {
            return reply.code(400).send({ error: 'Account already exists' });
        }

        // const hashedPassword = await bcrypt.hash(password, config.saltRounds);
        await pool.request()
            .input('FirstName', firstName)
            .input('LastName', lastName)
            .input('MobileNumber', mobileNumber)
            .input('NationalCode', nationalCode)
            .input('Password', password)
            .query(`
            INSERT INTO [Account] (FirstName, LastName, MobileNumber, NationalCode, Password)
            VALUES (@FirstName, @LastName, @MobileNumber, @NationalCode, @Password)
          `);

        reply.code(201).send({ message: 'Account registered successfully' });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Server error' });
    }
}

const login = async (request, reply) => {
    try {
        const { mobileNumber, password } = request.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MobileNumber', mobileNumber)
            .query('SELECT * FROM [Account] WHERE MobileNumber = @MobileNumber');

        const Account = result.recordset[0];
        if (!Account) {
            return reply.code(400).send({ error: 'Invalid mobile number or password' });
        }

        // const isValidPassword = await bcrypt.compare(password, Account.Password);
        // if (!isValidPassword) {
        //     return reply.code(400).send({ error: 'Invalid mobile number or password' });
        // }

        const token = jwt.sign({
            mobileNumber
        },
            "behradddddddd"
            , {
                expiresIn: '1h'
            })
            
        reply.send({ token });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Server error' });
    }
}

module.exports = { register, login }
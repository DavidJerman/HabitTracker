const request = require('supertest');
const app = 'http://localhost:3000'; // The URL of your API

// Function to generate a random string
const generateRandomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

describe('Auth API', () => {
    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const username = `testuser_${generateRandomString(5)}`;
            const email = `${generateRandomString(8)}@mail.com`;

            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: username,
                    password: 'password',
                    email: email
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered');
        });

        it('should return an error for missing username', async () => {
            const email = `${generateRandomString(8)}@mail.com`;

            const response = await request(app)
                .post('/auth/register')
                .send({
                    password: 'password',
                    email: email
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Missing required user information');
        });

        it('should return an error for missing password', async () => {
            const username = `testuser_${generateRandomString(5)}`;
            const email = `${generateRandomString(8)}@mail.com`;

            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: username,
                    email: email
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Missing required user information');
        });

        it('should return an error for missing email', async () => {
            const username = `testuser_'${generateRandomString(5)}`;
            const email = ``;

            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: username,
                    password: 'password'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Missing required user information');
        });

        it('should not return an error for extra fields', async () => {
            const username = `testuser_${generateRandomString(5)}`;
            const email = `${generateRandomString(8)}@mail.com`;

            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: username,
                    password: 'password',
                    email: email,
                    extraField: 'extraValue' // This is an extra field
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered');
        });

        it('should return an error for user existing', async () => {
            const username = `testuser_${generateRandomString(5)}`;
            const email = `${generateRandomString(8)}@mail.com`;

            let response = await request(app)
                .post('/auth/register')
                .send({
                    username: username,
                    password: 'password',
                    email: email
                });

            response = await request(app)
                .post('/auth/register')
                .send({
                    username: username,
                    password: 'password',
                    email: email
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'User already exists');
        });

        it('should return an error for email existing', async () => {
            let username = `testuser_${generateRandomString(5)}`;
            const email = `${generateRandomString(8)}@mail.com`;

            let response = await request(app)
                .post('/auth/register')
                .send({
                    username: username,
                    password: 'password',
                    email: email
                });

            username = `testuser_${generateRandomString(5)}`;

            response = await request(app)
                .post('/auth/register')
                .send({
                    username: username,
                    password: 'password',
                    email: email
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Email already exists');
        });
    });

    describe('POST /auth/login', () => {
        const globalUsername = `testuser_${generateRandomString(5)}`;
        const globalEmail = `${generateRandomString(8)}@mail.com`;
        const globalPassword = 'password';

        it('should register and login a user', async () => {
            const responseRegister = await request(app)
                .post('/auth/register')
                .send({
                    username: globalUsername,
                    password: globalPassword,
                    email: globalEmail
                });

            expect(responseRegister.status).toBe(201);
            expect(responseRegister.body).toHaveProperty('message', 'User registered');

            const responseLogin = await request(app)
                .post('/auth/login')
                .send({
                    username: globalUsername,
                    password: globalPassword
                });

            expect(responseLogin.status).toBe(200);
            expect(responseLogin.body).toHaveProperty('token');
        });

        it('should login a user', async () => {
            const responseLogin = await request(app)
                .post('/auth/login')
                .send({
                    username: globalUsername,
                    password: globalPassword
                });

            expect(responseLogin.status).toBe(200);
            expect(responseLogin.body).toHaveProperty('token');
        })
    })
});

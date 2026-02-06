const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

describe('Auth & Protected Routes', () => {
    let token;

    beforeAll(() => {
        token = jwt.sign({ username: 'testadmin', role: 'admin' }, process.env.JWT_SECRET);
    });

    describe('GET /api/requests', () => {
        it('should return 401 if no token provided', async () => {
            const res = await request(app).get('/api/requests');
            expect(res.statusCode).toEqual(401);
        });

        it('should return 200 with valid token', async () => {
            const res = await request(app).get('/api/requests').set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    describe('POST /api/login', () => {
        // Since we rely on a physical file for users, testing login might be flaky if we don't mock fs.
        // However, we can test the failure case easily.
        it('should fail with wrong credentials', async () => {
            const res = await request(app).post('/api/login').send({ username: 'wrong', password: 'wrong' });
            expect(res.statusCode).toEqual(401);
        });
    });
});

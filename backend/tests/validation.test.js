const request = require('supertest');
const app = require('../server');

describe('API Validation', () => {
    describe('POST /api/login', () => {
        it('should return 400 if username is missing', async () => {
            const res = await request(app).post('/api/login').send({ password: '123' });
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('POST /api/request', () => {
        it('should return 400 if plan is missing', async () => {
            const res = await request(app).post('/api/request').send({
                contact: { name: 'Test', email: 'test@test.com', termsAccepted: true }
            });
            expect(res.statusCode).toEqual(400);
        });

        it('should return 400 if email is invalid', async () => {
            const res = await request(app).post('/api/request').send({
                plan: 'Basic',
                contact: { name: 'Test', email: 'invalid-email', termsAccepted: true }
            });
            expect(res.statusCode).toEqual(400);
        });
    });
});

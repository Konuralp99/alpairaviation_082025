const request = require('supertest');
const app = require('../server'); // Adjust path as needed
const db = require('../db'); // To potentially mock or access db

describe('GET /api/airports', () => {
    it('should return a list of airports', async () => {
        const res = await request(app).get('/api/airports');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});

describe('GET /api/fleet', () => {
    it('should return fleet data', async () => {
        const res = await request(app).get('/api/fleet');
        expect(res.statusCode).toEqual(200);
        // Add specific checks if we know the structure
    });
});

// Since the DB is real (SQLite file), we should be careful about modification tests.
// For now, let's just stick to GET requests to "read" data without side effects.
// If we want to test POST, we should probably mock the DB or use a test DB.

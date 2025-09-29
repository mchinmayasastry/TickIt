import request from 'supertest';
import app from '../server';

describe('GET /api/health', () => {
  it('should return 200 and a success message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message');
  });
});

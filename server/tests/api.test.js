import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

describe('DevPulse API Test Suite', () => {
  let server;
  let baseUrl;

  before(async () => {
    const app = createApp();
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('GET /api/health returns UP status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'UP');
  });

  test('GET /api/services returns list of monitored services', async () => {
    const res = await fetch(`${baseUrl}/api/services`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length > 0);
  });

  test('GET /api/metrics/summary aggregates system metrics correctly', async () => {
    const res = await fetch(`${baseUrl}/api/metrics/summary`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(typeof body.data.totalServices === 'number');
    assert.ok(typeof body.data.avgLatencyMs === 'number');
    assert.ok(typeof body.data.systemUptimePercent === 'number');
  });

  test('POST /api/services creates a new service successfully', async () => {
    const payload = {
      name: 'User Profile Cache',
      url: 'https://cache.internal.devpulse.io/ping',
      region: 'us-east-1',
      tier: 'standard'
    };

    const res = await fetch(`${baseUrl}/api/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.name, 'User Profile Cache');
    assert.ok(body.data.id.startsWith('srv-'));
  });

  test('POST /api/services rejects missing name or url with 400', async () => {
    const res = await fetch(`${baseUrl}/api/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'standard' })
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  test('POST /api/services/:id/ping triggers latency check', async () => {
    const res = await fetch(`${baseUrl}/api/services/srv-auth/ping`, {
      method: 'POST'
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(typeof body.data.latencyMs === 'number');
  });

  test('POST /api/incidents creates and resolves an incident', async () => {
    const incidentPayload = {
      serviceId: 'srv-search',
      serviceName: 'Search Index & Vector Database',
      title: 'Memory saturation threshold warning',
      severity: 'warning'
    };

    const createRes = await fetch(`${baseUrl}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentPayload)
    });

    assert.equal(createRes.status, 201);
    const createBody = await createRes.json();
    const incidentId = createBody.data.id;

    // Resolve incident
    const resolveRes = await fetch(`${baseUrl}/api/incidents/${incidentId}/resolve`, {
      method: 'PATCH'
    });
    assert.equal(resolveRes.status, 200);
    const resolveBody = await resolveRes.json();
    assert.equal(resolveBody.data.resolved, true);
  });
});

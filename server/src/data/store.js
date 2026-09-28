// In-memory data store for microservices, metrics, and incident telemetry

export const services = [
  {
    id: "srv-auth",
    name: "Authentication & OAuth Service",
    url: "https://auth.internal.devpulse.io/health",
    status: "operational", // operational, degraded, outage
    latencyMs: 42,
    uptimePercent: 99.98,
    lastChecked: new Date().toISOString(),
    region: "us-east-1",
    tier: "critical"
  },
  {
    id: "srv-billing",
    name: "Stripe Payment Gateway Bridge",
    url: "https://billing.internal.devpulse.io/v1/ping",
    status: "operational",
    latencyMs: 118,
    uptimePercent: 99.94,
    lastChecked: new Date().toISOString(),
    region: "us-east-1",
    tier: "critical"
  },
  {
    id: "srv-notification",
    name: "Push Notification & Email Worker",
    url: "https://notify.internal.devpulse.io/status",
    status: "degraded",
    latencyMs: 485,
    uptimePercent: 98.72,
    lastChecked: new Date().toISOString(),
    region: "eu-central-1",
    tier: "standard"
  },
  {
    id: "srv-search",
    name: "Search Index & Vector Database",
    url: "https://search.internal.devpulse.io/healthz",
    status: "operational",
    latencyMs: 65,
    uptimePercent: 99.99,
    lastChecked: new Date().toISOString(),
    region: "us-west-2",
    tier: "high"
  },
  {
    id: "srv-analytics",
    name: "Real-time Telemetry Ingestion API",
    url: "https://telemetry.internal.devpulse.io/alive",
    status: "operational",
    latencyMs: 28,
    uptimePercent: 100.0,
    lastChecked: new Date().toISOString(),
    region: "ap-southeast-1",
    tier: "high"
  }
];

export const incidents = [
  {
    id: "inc-101",
    serviceId: "srv-notification",
    serviceName: "Push Notification & Email Worker",
    severity: "warning", // warning, critical, resolved
    title: "High dispatch queue latency detected in eu-central-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    resolved: false
  },
  {
    id: "inc-100",
    serviceId: "srv-billing",
    serviceName: "Stripe Payment Gateway Bridge",
    severity: "resolved",
    title: "Upstream webhook timeout mitigation completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    resolved: true
  }
];

export const metricHistory = [
  { timestamp: "12:00", avgLatency: 48, requestsPerSec: 1420, errorRate: 0.04 },
  { timestamp: "12:30", avgLatency: 52, requestsPerSec: 1560, errorRate: 0.02 },
  { timestamp: "13:00", avgLatency: 84, requestsPerSec: 2100, errorRate: 0.12 },
  { timestamp: "13:30", avgLatency: 110, requestsPerSec: 2450, errorRate: 0.35 },
  { timestamp: "14:00", avgLatency: 64, requestsPerSec: 1890, errorRate: 0.08 },
  { timestamp: "14:30", avgLatency: 56, requestsPerSec: 1680, errorRate: 0.05 },
  { timestamp: "15:00", avgLatency: 50, requestsPerSec: 1720, errorRate: 0.03 }
];

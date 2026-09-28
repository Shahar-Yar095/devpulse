import { services, metricHistory } from '../data/store.js';

export const getSystemSummary = (req, res) => {
  const total = services.length;
  const operational = services.filter(s => s.status === 'operational').length;
  const degraded = services.filter(s => s.status === 'degraded').length;
  const outage = services.filter(s => s.status === 'outage').length;

  const totalLatency = services.reduce((acc, s) => acc + s.latencyMs, 0);
  const avgLatency = total > 0 ? Math.round(totalLatency / total) : 0;

  const totalUptime = services.reduce((acc, s) => acc + s.uptimePercent, 0);
  const systemUptime = total > 0 ? +(totalUptime / total).toFixed(2) : 100.0;

  res.json({
    success: true,
    data: {
      totalServices: total,
      operational,
      degraded,
      outage,
      systemHealth: outage > 0 ? 'CRITICAL' : degraded > 0 ? 'DEGRADED' : 'HEALTHY',
      avgLatencyMs: avgLatency,
      systemUptimePercent: systemUptime,
      lastUpdated: new Date().toISOString()
    }
  });
};

export const getMetricHistory = (req, res) => {
  res.json({
    success: true,
    data: metricHistory
  });
};

import React from 'react';

export const StatsOverview = ({ summary, incidentCount }) => {
  const avgLatency = summary?.avgLatencyMs ?? 0;
  const uptime = summary?.systemUptimePercent ?? 100.0;
  const total = summary?.totalServices ?? 0;
  const operational = summary?.operational ?? 0;

  return (
    <section className="stats-grid" aria-label="System Summary Metrics">
      <div className="stat-card">
        <span className="stat-card-title">Monitored Services</span>
        <div className="stat-card-value mono-val">{operational}/{total}</div>
        <span className="stat-card-sub" style={{ color: '#10b981' }}>
          {total > 0 ? Math.round((operational / total) * 100) : 100}% operational rate
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-card-title">Avg Network Latency</span>
        <div className="stat-card-value mono-val">
          {avgLatency} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>ms</span>
        </div>
        <span className="stat-card-sub">Global edge synthetic ping</span>
      </div>

      <div className="stat-card">
        <span className="stat-card-title">30-Day System Uptime</span>
        <div className="stat-card-value mono-val">{uptime}%</div>
        <span className="stat-card-sub" style={{ color: '#38bdf8' }}>SLA target: 99.9%</span>
      </div>

      <div className="stat-card">
        <span className="stat-card-title">Active Incidents</span>
        <div className="stat-card-value mono-val" style={{ color: incidentCount > 0 ? '#f59e0b' : '#10b981' }}>
          {incidentCount}
        </div>
        <span className="stat-card-sub">
          {incidentCount === 0 ? 'No active incident alerts' : 'Requires engineering triage'}
        </span>
      </div>
    </section>
  );
};

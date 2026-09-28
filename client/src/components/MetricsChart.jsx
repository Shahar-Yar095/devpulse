import React from 'react';

export const MetricsChart = ({ history }) => {
  if (!history || history.length === 0) return null;

  const maxLatency = Math.max(...history.map((h) => h.avgLatency), 120);

  return (
    <div className="section-panel">
      <div className="section-header">
        <div>
          <h2 className="section-title">Network Latency & Request History</h2>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
            Aggregated response times over rolling 30-minute intervals
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 10, height: 10, background: '#38bdf8', borderRadius: 2 }}></span>
            Avg Latency (ms)
          </span>
        </div>
      </div>

      <div className="chart-container">
        {history.map((item, idx) => {
          const heightPercent = Math.max(15, Math.round((item.avgLatency / maxLatency) * 100));

          return (
            <div key={idx} className="chart-bar-col">
              <span className="mono-val" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {item.avgLatency}ms
              </span>
              <div
                className="chart-bar"
                style={{ height: `${heightPercent}%` }}
                title={`Time: ${item.timestamp} | Latency: ${item.avgLatency}ms | Req/s: ${item.requestsPerSec}`}
              />
              <span className="chart-label">{item.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

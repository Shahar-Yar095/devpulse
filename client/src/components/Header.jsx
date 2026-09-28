import React from 'react';
import { IconPulse, IconRefresh, IconPlus } from './Icons';

export const Header = ({ summary, onRefresh, onOpenAddModal, loading }) => {
  const isHealthy = summary?.systemHealth === 'HEALTHY';
  const isDegraded = summary?.systemHealth === 'DEGRADED';
  const statusClass = isHealthy ? 'operational' : isDegraded ? 'degraded' : 'outage';
  const statusLabel = isHealthy ? 'All Systems Operational' : isDegraded ? 'Performance Degraded' : 'Major Outage';

  return (
    <header className="header-bar">
      <div className="brand-section">
        <div className="brand-icon">
          <IconPulse size={24} className="text-white" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="brand-title">DevPulse</h1>
            <span className={`status-pill ${statusClass}`}>
              <span className="status-dot"></span>
              {statusLabel}
            </span>
          </div>
          <p className="brand-subtitle">Real-time microservice latency telemetry & health observability</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={loading}
          title="Fetch latest system telemetry"
        >
          <IconRefresh size={16} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
        <button
          className="btn btn-primary"
          onClick={onOpenAddModal}
        >
          <IconPlus size={16} />
          Add Service
        </button>
      </div>
    </header>
  );
};

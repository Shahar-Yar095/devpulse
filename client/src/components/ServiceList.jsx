import React, { useState } from 'react';
import { IconZap } from './Icons';

export const ServiceList = ({ services, onPing, pingingId }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredServices = services.filter((srv) => {
    const matchesFilter = filter === 'all' || srv.status === filter;
    const matchesSearch =
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      srv.region.toLowerCase().includes(search.toLowerCase()) ||
      srv.tier.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="section-panel">
      <div className="section-header">
        <h2 className="section-title">Microservices Telemetry</h2>
        <div className="controls-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search service, region, tier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-btn-group">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({services.length})
            </button>
            <button
              className={`filter-btn ${filter === 'operational' ? 'active' : ''}`}
              onClick={() => setFilter('operational')}
            >
              Operational
            </button>
            <button
              className={`filter-btn ${filter === 'degraded' ? 'active' : ''}`}
              onClick={() => setFilter('degraded')}
            >
              Degraded
            </button>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="services-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Service Name</th>
              <th>Region</th>
              <th>Tier</th>
              <th>Latency</th>
              <th>Uptime</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No services matching current filter.
                </td>
              </tr>
            ) : (
              filteredServices.map((srv) => {
                const isPingLoading = pingingId === srv.id;
                const statusColor = srv.status === 'operational' ? '#10b981' : '#f59e0b';

                return (
                  <tr key={srv.id}>
                    <td>
                      <span className={`status-pill ${srv.status}`}>
                        <span className="status-dot"></span>
                        {srv.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{srv.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }} className="mono-val">
                        {srv.url}
                      </div>
                    </td>
                    <td>
                      <span className="badge-tag mono-val">{srv.region}</span>
                    </td>
                    <td>
                      <span className="badge-tag" style={{ textTransform: 'capitalize' }}>
                        {srv.tier}
                      </span>
                    </td>
                    <td className="mono-val" style={{ fontWeight: 600 }}>
                      <span style={{ color: srv.latencyMs > 250 ? '#f59e0b' : '#38bdf8' }}>
                        {srv.latencyMs}ms
                      </span>
                    </td>
                    <td className="mono-val" style={{ color: '#10b981', fontWeight: 600 }}>
                      {srv.uptimePercent}%
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onPing(srv.id)}
                        disabled={isPingLoading}
                        title="Execute instant health ping"
                      >
                        <IconZap size={14} />
                        {isPingLoading ? 'Pinging...' : 'Ping'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

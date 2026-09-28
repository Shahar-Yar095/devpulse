import React from 'react';
import { IconAlert, IconCheck } from './Icons';

export const IncidentLog = ({ incidents, onResolveIncident }) => {
  return (
    <div className="section-panel">
      <div className="section-header">
        <div>
          <h2 className="section-title">Incident Log & Audit Trail</h2>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
            Historical alerts, automated anomaly triggers, and remediation timeline
          </p>
        </div>
      </div>

      {incidents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          No incidents recorded in the system.
        </div>
      ) : (
        incidents.map((inc) => {
          const isResolved = inc.resolved;
          const formattedDate = new Date(inc.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric'
          });

          return (
            <div
              key={inc.id}
              className={`incident-item ${isResolved ? 'incident-resolved' : ''}`}
            >
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{ color: isResolved ? '#10b981' : '#f59e0b', marginTop: '2px' }}>
                  {isResolved ? <IconCheck size={20} /> : <IconAlert size={20} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{inc.title}</span>
                    <span className="badge-tag mono-val">{inc.serviceName}</span>
                    <span
                      className={`status-pill ${isResolved ? 'operational' : 'degraded'}`}
                      style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}
                    >
                      {isResolved ? 'RESOLVED' : inc.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Logged: {formattedDate}
                  </div>
                </div>
              </div>

              {!isResolved && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onResolveIncident(inc.id)}
                  title="Mark incident as resolved"
                >
                  <IconCheck size={14} />
                  Mark Resolved
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

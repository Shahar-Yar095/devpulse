import React, { useState } from 'react';
import { IconClose } from './Icons';

export const AddServiceModal = ({ isOpen, onClose, onAddService }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [region, setRegion] = useState('us-east-1');
  const [tier, setTier] = useState('standard');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError('Please provide both a service name and a valid URL.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onAddService({ name, url, region, tier });
      setName('');
      setUrl('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to register service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
            Register New Microservice
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
          >
            <IconClose size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: 6, backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Invoicing Dispatch Worker"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Health Check Endpoint URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://api.example.com/health"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Cloud Region</label>
              <select
                className="form-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="us-east-1">us-east-1 (N. Virginia)</option>
                <option value="us-west-2">us-west-2 (Oregon)</option>
                <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
                <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Service SLA Tier</label>
              <select
                className="form-select"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
              >
                <option value="critical">Critical (Tier 1)</option>
                <option value="high">High (Tier 2)</option>
                <option value="standard">Standard (Tier 3)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering...' : 'Register Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

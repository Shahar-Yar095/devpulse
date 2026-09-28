import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { ServiceList } from './components/ServiceList';
import { MetricsChart } from './components/MetricsChart';
import { IncidentLog } from './components/IncidentLog';
import { AddServiceModal } from './components/AddServiceModal';

const API_BASE = '/api';

export default function App() {
  const [summary, setSummary] = useState(null);
  const [services, setServices] = useState([]);
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pingingId, setPingingId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, srvRes, histRes, incRes] = await Promise.allSettled([
        fetch(`${API_BASE}/metrics/summary`).then((r) => r.json()),
        fetch(`${API_BASE}/services`).then((r) => r.json()),
        fetch(`${API_BASE}/metrics/history`).then((r) => r.json()),
        fetch(`${API_BASE}/incidents`).then((r) => r.json()),
      ]);

      if (sumRes.status === 'fulfilled' && sumRes.value.success) {
        setSummary(sumRes.value.data);
      }
      if (srvRes.status === 'fulfilled' && srvRes.value.success) {
        setServices(srvRes.value.data);
      }
      if (histRes.status === 'fulfilled' && histRes.value.success) {
        setMetricsHistory(histRes.value.data);
      }
      if (incRes.status === 'fulfilled' && incRes.value.success) {
        setIncidents(incRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Ping a specific service
  const handlePingService = async (serviceId) => {
    setPingingId(serviceId);
    try {
      const res = await fetch(`${API_BASE}/services/${serviceId}/ping`, {
        method: 'POST',
      });
      if (res.ok) {
        const result = await res.json();
        setServices((prev) =>
          prev.map((s) => (s.id === serviceId ? { ...s, latencyMs: result.data.latencyMs } : s))
        );
      }
    } catch (err) {
      console.error('Ping failed:', err);
    } finally {
      setPingingId(null);
    }
  };

  // Add new service
  const handleAddService = async (serviceData) => {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create service');
    }

    const created = await res.json();
    setServices((prev) => [created.data, ...prev]);
    fetchDashboardData();
  };

  // Resolve incident
  const handleResolveIncident = async (incidentId) => {
    try {
      const res = await fetch(`${API_BASE}/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setIncidents((prev) =>
          prev.map((inc) => (inc.id === incidentId ? { ...inc, resolved: true } : inc))
        );
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Resolve incident failed:', err);
    }
  };

  const activeIncidentsCount = incidents.filter((i) => !i.resolved).length;

  return (
    <div className="app-container">
      <Header
        summary={summary}
        onRefresh={fetchDashboardData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        loading={loading}
      />

      <StatsOverview
        summary={summary}
        incidentCount={activeIncidentsCount}
      />

      <MetricsChart history={metricsHistory} />

      <ServiceList
        services={services}
        onPing={handlePingService}
        pingingId={pingingId}
      />

      <IncidentLog
        incidents={incidents}
        onResolveIncident={handleResolveIncident}
      />

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddService={handleAddService}
      />
    </div>
  );
}

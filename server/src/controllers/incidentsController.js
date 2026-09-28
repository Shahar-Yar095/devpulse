import { incidents } from '../data/store.js';

export const getAllIncidents = (req, res) => {
  const { resolved } = req.query;
  let filtered = [...incidents];

  if (resolved !== undefined) {
    const isResolved = resolved === 'true';
    filtered = filtered.filter(i => i.resolved === isResolved);
  }

  res.json({
    success: true,
    total: filtered.length,
    data: filtered
  });
};

export const reportIncident = (req, res) => {
  const { serviceId, serviceName, title, severity } = req.body;

  if (!title || !serviceName) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: 'title' and 'serviceName' are required."
    });
  }

  const newIncident = {
    id: `inc-${Date.now().toString(36)}`,
    serviceId: serviceId || "srv-general",
    serviceName: serviceName.trim(),
    severity: severity || "warning",
    title: title.trim(),
    timestamp: new Date().toISOString(),
    resolved: false
  };

  incidents.unshift(newIncident);

  res.status(201).json({
    success: true,
    message: "Incident logged successfully",
    data: newIncident
  });
};

export const resolveIncident = (req, res) => {
  const { id } = req.params;
  const incident = incidents.find(i => i.id === id);

  if (!incident) {
    return res.status(404).json({
      success: false,
      error: `Incident with ID '${id}' was not found.`
    });
  }

  incident.resolved = true;
  incident.resolvedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Incident marked as resolved",
    data: incident
  });
};

import { services } from '../data/store.js';

export const getAllServices = (req, res) => {
  const { status, region } = req.query;
  let filtered = [...services];

  if (status) {
    filtered = filtered.filter(s => s.status.toLowerCase() === status.toLowerCase());
  }

  if (region) {
    filtered = filtered.filter(s => s.region.toLowerCase() === region.toLowerCase());
  }

  res.json({
    success: true,
    total: filtered.length,
    data: filtered
  });
};

export const getServiceById = (req, res) => {
  const { id } = req.params;
  const service = services.find(s => s.id === id);

  if (!service) {
    return res.status(404).json({
      success: false,
      error: `Service with ID '${id}' was not found.`
    });
  }

  res.json({ success: true, data: service });
};

export const createService = (req, res) => {
  const { name, url, region, tier } = req.body;

  if (!name || !url) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: 'name' and 'url' must be provided."
    });
  }

  const newService = {
    id: `srv-${Date.now().toString(36)}`,
    name: name.trim(),
    url: url.trim(),
    status: "operational",
    latencyMs: Math.floor(Math.random() * 60) + 20,
    uptimePercent: 100.0,
    lastChecked: new Date().toISOString(),
    region: region || "us-east-1",
    tier: tier || "standard"
  };

  services.unshift(newService);

  res.status(201).json({
    success: true,
    message: "Service registered successfully",
    data: newService
  });
};

export const pingService = (req, res) => {
  const { id } = req.params;
  const service = services.find(s => s.id === id);

  if (!service) {
    return res.status(404).json({
      success: false,
      error: `Service with ID '${id}' was not found.`
    });
  }

  // Simulate a live network ping with jitter
  const simulatedLatency = Math.max(12, Math.floor(service.latencyMs + (Math.random() * 30 - 15)));
  service.latencyMs = simulatedLatency;
  service.lastChecked = new Date().toISOString();

  res.json({
    success: true,
    data: {
      id: service.id,
      name: service.name,
      status: service.status,
      latencyMs: service.latencyMs,
      checkedAt: service.lastChecked
    }
  });
};

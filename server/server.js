import { createApp } from './src/app.js';

const app = createApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`⚡ DevPulse Telemetry API running on http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Services: http://localhost:${PORT}/api/services`);
});

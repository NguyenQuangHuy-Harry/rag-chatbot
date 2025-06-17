// This file should be imported as early as possible in the application
// to ensure telemetry is initialized before any other modules
import { initializeTelemetry } from './services/telemetry';

// Initialize telemetry
initializeTelemetry();

console.log('Telemetry initialization completed');
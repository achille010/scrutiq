import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
import axios from "axios";
import emailService from "./services/email.service";

// Load environment variables
dotenv.config();

// Initialize Database Connection
connectDB();

const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || "development";

// Hardened Cloud Keep-Alive: Standing Autonomous Heartbeat with Emergency Alerts
const initiateHeartbeat = () => {
  const selfUrl = environment === "development" 
    ? `http://localhost:${port}/health`
    : `https://${process.env.RENDER_EXTERNAL_HOSTNAME}/health`;

  let alertSent = false;

  const dispatch = async () => {
    try {
      console.log(`[System-Heartbeat] Probing: ${selfUrl}`);
      const response = await axios.get(selfUrl);
      console.log(`[System-Heartbeat] Status: ${response.data.status}`);
      
      // System recovered
      if (alertSent && response.data.status === "online") {
        await emailService.sendCustomEmail(
          "ishyarugemachille4@gmail.com",
          "System Recovery Alert",
          `The Scrutiq Technical Portal (${environment}) has successfully recovered and is now online.\n\nProbe success at: ${new Date().toISOString()}`
        );
        alertSent = false;
      }
    } catch (error: any) {
      console.warn(`[System-Heartbeat] Probe Fault: ${error.message}`);
      
      if (!alertSent) {
        try {
          console.log("[Emergency-Alert] Dispatching warning email to administrator...");
          await emailService.sendCustomEmail(
            "ishyarugemachille4@gmail.com",
            "System Outage Warning",
            `WARNING: The Scrutiq Technical Portal (${environment}) is currently unresponsive to internal health probes.\n\nError: ${error.message}\nTimestamp: ${new Date().toISOString()}\n\nPlease investigate the server logs for potential logic faults or infrastructure blocks.`
          );
          alertSent = true;
        } catch (emailErr: any) {
          console.error("[Emergency-Alert] Failed to dispatch warning email:", emailErr.message);
        }
      }
    }
  };

  // Immediate confirmation probe
  dispatch();
  
  // Permanent 2-minute interval
  setInterval(dispatch, 2 * 60 * 1000);
};

const server = app.listen(port, () => {
  console.log(`
  🚀 TECHNICAL PORTAL API INITIALIZED
  🚀 PORT: ${port}
  🚀 ENVIRONMENT: ${environment}
  🚀 CLOUD READINESS: OK
  `);
  
  initiateHeartbeat();
});

// System Termination Protocol
const shutdown = async (signal: string) => {
  console.log(`Cleanup Protocol Initiated (${signal}). Closing system resources...`);
  
  try {
    console.log("[Emergency-Alert] Dispatching shutdown notification...");
    await emailService.sendCustomEmail(
      "ishyarugemachille4@gmail.com",
      "System Shutdown Alert",
      `The Scrutiq Technical Portal (${environment}) has received a ${signal} signal and is gracefully shutting down.\n\nTime: ${new Date().toISOString()}\n\nNote: If this was not a manual restart, please examine the deployment logs.`
    );
  } catch (err: any) {
    console.error("Shutdown notification failed:", err.message);
  }

  server.close(() => {
    console.log("System Process Finalized.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));


process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Technical Rejection:", err);
  process.exit(1);
});

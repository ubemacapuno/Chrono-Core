import express, { Request, Response } from "express";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();

const PORT: number = parseInt(process.env.PORT || "3000", 10);
const WS_HOST: string = process.env.WS_HOST || "localhost";
const app = express();

type GPUData = {
  name: string;
  load: number;
  free_memory: number;
  used_memory: number;
  total_memory: number;
  temperature: number;
};

// Type for CPU data
type CPUData = {
  total_usage: number;
  core_usage: number[];
  current_frequency: number;
  cpu_percent?: number;
  total_cores?: number;
  processor_model: string;
};

// Updated type for ResourceData
type ResourceData = {
  cpu?: CPUData;
  gpu?: GPUData[];
  ram?: {
    total: number;
    used: number;
    free: number;
    percent: number;
    speeds: number[];
  };
};

let resourceData: ResourceData = {};

app.use(express.json());

// Set up a WebSocket server
const server = app.listen(PORT, WS_HOST, () => {
  console.log(`Server is running at http://${WS_HOST}:${PORT}`);
});

const wss = new WebSocketServer({ server });

// Function to broadcast data to connected clients
function broadcastData(data: ResourceData) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("Parsed data:", data);
      resourceData = data; // Store the parsed data

      // Broadcast updated data to all clients
      broadcastData(resourceData);

      // Check for a specific request message and send the latest data
      if (data.request && data.request === "requestData") {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(resourceData));
        }
      } else {
        console.log("Parsed data:", data);
        resourceData = data; // Store the parsed data
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });
});

app.post("/api/resource-data", (req: Request, res: Response) => {
  resourceData = req.body;
  console.log("Data received:", resourceData);
  res.send({ message: "Data received successfully" });
});

app.get("/api/resource-data", (req: Request, res: Response) => {
  res.json(resourceData);
});

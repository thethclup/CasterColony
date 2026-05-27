import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add CORS globally for API routes
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());

  // API Route: Agent Info
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Caster Colony Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Caster Colony",
      version: "1.0.0"
    });
  });

  // API Route: MCP GET
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Caster Colony MCP Endpoint",
      status: "active",
      description: "Active MCP server for Caster Colony Orchestrator Agent",
      capabilities: {
        tools: { listChanged: true },
        prompts: {},
        resources: {}
      },
      timestamp: new Date().toISOString()
    });
  });

  // API Route: MCP POST
  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const { jsonrpc, id, method, action, command, params } = body;

      const rpcMethod = method || action || command;
      let result: any = {};

      switch (rpcMethod) {
        case "tools/list":
          result = {
            tools: [
              {
                name: "get_race_status",
                description: "Get the current status of the active race",
                inputSchema: { type: "object", properties: { raceId: { type: "string" } }, required: ["raceId"] }
              },
              {
                name: "start_race",
                description: "Start a new race on a specific track",
                inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
              },
              {
                name: "get_leaderboard",
                description: "Retrieve the racing leaderboard",
                inputSchema: { type: "object", properties: {}, required: [] }
              },
              {
                name: "optimize_speed",
                description: "Analyze and optimize speed parameters",
                inputSchema: { type: "object", properties: { parameters: { type: "object" } }, required: ["parameters"] }
              },
              {
                name: "get_track_info",
                description: "Get detailed information about a track",
                inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
              }
            ]
          };
          break;

        case "prompts/list":
          result = { prompts: [] };
          break;

        case "resources/list":
          result = { resources: [] };
          break;

        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Caster Colony Orchestrator",
            message: "Colony is thriving - Ready to cast" 
          };
          break;

        case "execute":
        case "tools/call":
          result = {
            content: [{ type: "text", text: `Casting command executed successfully: ${params?.name || command || 'unknown'}` }],
            isError: false
          };
          break;

        case "get_info":
          result = {
            name: "Caster Colony Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Command received",
            data: body
          };
      }

      if (jsonrpc === "2.0") {
        return res.json({
          jsonrpc: "2.0",
          id: id,
          result: result
        });
      }

      res.json({
        status: "success",
        agent: "Caster Colony Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

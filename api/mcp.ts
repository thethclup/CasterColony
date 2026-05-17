import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
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
  }

  if (req.method === 'POST') {
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
                name: "harvest_mana",
                description: "Command the casters to gather mana",
                inputSchema: {
                  type: "object",
                  properties: { amount: { type: "number" } },
                  required: ["amount"]
                }
              },
              {
                name: "build_structure",
                description: "Construct a new magical building",
                inputSchema: {
                  type: "object",
                  properties: { buildingType: { type: "string" } },
                  required: ["buildingType"]
                }
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
          result = { status: "online", agent: "Caster Colony Orchestrator", message: "Colony is thriving - Ready to cast" };
          break;
        case "execute":
        case "tools/call":
          result = { content: [{ type: "text", text: `Casting command executed successfully: ${params?.name || command || 'unknown'}` }], isError: false };
          break;
        case "get_info":
          result = { name: "Caster Colony Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
          break;
        default:
          result = { success: true, message: "Command received", data: body };
      }

      if (jsonrpc === "2.0") {
        return res.status(200).json({ jsonrpc: "2.0", id: id, result: result });
      }

      return res.status(200).json({ status: "success", agent: "Caster Colony Orchestrator", response: result, receivedAt: new Date().toISOString() });
    } catch (e) {
      return res.status(400).json({ status: "error", message: "Failed to process MCP command" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

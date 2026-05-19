import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({
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
  }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
        result = { status: "online", agent: "Caster Colony Orchestrator", message: "Colony is thriving - Ready to cast" };
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
        result = { success: true, message: "Command received", data: body };
    }

    if (jsonrpc === "2.0") {
      return NextResponse.json({ jsonrpc: "2.0", id: id, result: result }, { headers: corsHeaders });
    }

    return NextResponse.json({ 
      status: "success", 
      agent: "Caster Colony Orchestrator", 
      response: result, 
      receivedAt: new Date().toISOString() 
    }, { headers: corsHeaders });

  } catch (e) {
    return NextResponse.json({ 
      status: "error", 
      message: "Failed to process MCP command" 
    }, { status: 400, headers: corsHeaders });
  }
}

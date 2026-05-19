# Caster Colony Orchestrator Agent

Caster Colony is a strategic, Web3-enabled, mobile-first colony-builder idle game. Establish a magical settlement of casters, orchestrate arcane architectures, and etch your colony's legacy permanently on the Base Mainnet!

## Overview
This repository contains the Next.js 14 App Router integration for the Caster Colony Orchestrator. The intelligent AI Agent is fully ERC-8004 compatible and serves as a Model Context Protocol (MCP) server for cross-agent communication.

### Capabilities & Skills
- **Colony Management**: Manage resources, build structures and strategize arcane expansion.
- **Caster Operations**: Assign casters to different roles like Harvesters, Researchers, Architects.
- **Strategic Casting**: Automate spell casting and defense mechanisms against arcane storms.
- **Other Capabilities**: `multi-colony-orchestration`, `resource-automation`, `expansion-management`, `mcp-command-execution`

## Technical Stack
- Next.js 14 (App Router)
- React 19 + TypeScript
- Web3 Integration via Base Mainnet
- Model Context Protocol (MCP) active at `/api/mcp`
- ERC-8004 Agent endpoint at `/api/agent`

## AI Agent & MCP Integration
The Agent is active and registered via the `public/.well-known/agent-card.json` standard.
Services exported:
- **A2A**: Agent-to-Agent registry connection.
- **MCP Endpoint**: `app/api/mcp/route.ts` - Provides the actual context, resources, and tool invocations (get_race_status, start_race, get_leaderboard, optimize_speed, get_track_info).
- **API Endpoint**: `app/api/agent/route.ts` - Standard agent heartbeat and info.

## Running Locally

To run the Next.js server locally:
```bash
npm install
npm run dev
```

Visit the standard `/.well-known/agent-card.json` inside your local/production instance to verify compatibility with ERC-8004 registries.

# Caster Colony

Caster Colony is a strategic, Web3-enabled, mobile-first colony-builder idle game. Establish a magical settlement of casters, orchestrate arcane architectures, and etch your colony's legacy permanently on the Base Mainnet!

## Features
- **Magical Colony Builder**: Tap-to-build satisfying idle progression system. Manage Casters, balance Mana, Crystals, and Runes!
- **On-Chain Ascension**: Push your highest achievements to Base Mainnet using SIWE (Sign In With Ethereum) for ERC-8021 tracking.
- **Trustless Agents Support**: Ready for ERC-8004 automated delegation.
- **AI Agent & MCP Integration**: Includes an active Model Context Protocol (MCP) server API `api/mcp.ts` to power cross-agent communication alongside `.well-known/agent-card.json`.

## Technical Stack
- React 19 + TypeScript + Vite
- Tailwind CSS
- Zustand for Idle simulation & State
- Wagmi + Viem + WalletConnect (Base Mainnet)
- Full-stack context for local dev (`server.ts`)
- Configured for Vercel Serverless deployments containing Express-like endpoints in `/api/` alongside standard SPA (`vercel.json` rewrites built-in).

## Intelligent Orchestrator Agent
The game includes an integrated ERC-8004 compatible AI Agent.
Visit `/.well-known/agent-card.json` after deployment to inspect the Orchestrator details. 
- Capabilities: `colony-management`, `caster-operations`, `multi-colony-orchestration`, `mcp-command-execution`
- API Points:
  - Agent Info: `/api/agent`
  - Active MCP Point: `/api/mcp`

## Running Locally

```bash
npm install
npm run dev
```

## Deployment to Vercel
The provided `/api` folders, `vercel.json` rewrite file, and `.well-known/agent-card.json` file make this repository completely ready to function as a unified interface deploying seamlessly on Vercel. 
*(If running purely on a VPS via Vite, the included `server.ts` handles API routes and SPA fallback natively!)*

> Note: Ensure your environment `.env` files are populated per `.env.example` in production.

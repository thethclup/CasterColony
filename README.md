# Caster Colony

Caster Colony is a strategic, Web3-enabled, mobile-first colony-builder idle game. Establish a magical settlement of casters, orchestrate arcane architectures, and etch your colony's legacy permanently on the Base Mainnet!

## Features
- **Magical Colony Builder**: Tap-to-build satisfying idle progression system. Manage Casters, balance Mana, Crystals, and Runes!
- **On-Chain Ascension**: Push your highest achievements to Base Mainnet using SIWE (Sign In With Ethereum) for ERC-8021 tracking.
- **Trustless Agents Support**: Ready for ERC-8004 automated delegation.
- **AI Agent & MCP Integration**: Includes an active Model Context Protocol (MCP) server `app/api/mcp/route.ts` to power cross-agent communication alongside `agent-card.json`.

## Technical Stack
- React 19 + TypeScript + Vite
- Tailwind CSS
- Zustand for Idle simulation & State
- Wagmi + Viem + WalletConnect (Base Mainnet)
- Full-stack Express implementation (in `server.ts`)
- Next.js Ready structures (`app/` router provided for seamless migration to Vercel Next.js deployments).

## Intelligent Orchestrator Agent
The game includes an integrated ERC-8004 compatible AI Agent.
Visit `/.well-known/agent-card.json` after deployment to inspect the Orchestrator details. 
- Capabilities: `colony-management`, `caster-operations`, `multi-colony-orchestration`, `mcp-command-execution`
- API Points:
  - Agent Info: `/api/agent`
  - Active MCP Point: `/api/mcp`

## Running Locally

\`\`\`bash
npm install
npm run dev
\`\`\`

## Deployment to Vercel (Next.js Conversion Option)
The provided \`app/api\` folders and \`agent-card.json\` files make this repository completely ready to function inside a standard Next.js App Router setup on Vercel. 
*(If running purely on Vite, the included \`server.ts\` handles these routes dynamically!)*

> Note: Ensure your environment `.env` files are populated per `.env.example` in production.

#  DeFi Price Alert Bot

A simple decentralized alert bot that uses Chainlink price feeds to notify users when an asset crosses their specified price threshold.

---

##  Uses Chainlink In:

| File | Purpose |
|------|---------|
| [`contracts/PriceAlert.sol`](./contracts/PriceAlert.sol) | Fetches real-time prices via `AggregatorV3Interface` |
| [`contracts/lib/chainlink/AggregatorV3Interface.sol`](./contracts/lib/chainlink/AggregatorV3Interface.sol) | Chainlink interface |
| [`test/Test.js`](./test/Test.js) | Tests logic using live Chainlink feeds |

---

##  How It Works

- Users set a **buy** or **sell** signal and a **price threshold**.
- The dApp fetches **real-time asset prices** using Chainlink.
- An alert is **triggered when:**
  - 🔺 *Sell*: asset price **> threshold**
  - 🔻 *Buy*: asset price **< threshold**

---

##  Tech

- Chainlink Data Feeds
- React + Vite frontend
- Solidity Smart Contract (Sepolia testnet)

---

> Future improvements like session-based monitoring are planned.


# Aegis AI

> **Autonomous AI-Powered Parametric Flight & Disruption Insurance Protocol on GenLayer Studio Next**

[![Live DApp](https://img.shields.io/badge/Live%20DApp-aegis--gen.vercel.app-10b981?style=for-the-badge&logo=vercel)](https://aegis-gen.vercel.app)
[![GenLayer Studio Next](https://img.shields.io/badge/GenLayer-Studio%20Next%20(61997)-8b5cf6?style=for-the-badge)](https://explorer-studio-dev.genlayer.com/address/0x2cb9f5E8e097Bf2f32cA755b9BDc3319B84e2B1a)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## About

**Aegis AI** is an autonomous parametric insurance protocol natively running on **GenLayer Studio Next (Chain ID 61997)**. It eliminates traditional insurance friction, manual claim adjustment delays, and opaque verification by utilizing GenLayer's non-deterministic Intelligent Contracts and multi-validator AI consensus (gl.nondet.exec_prompt).

- 🌐 **Live Website / DApp**: [https://aegis-gen.vercel.app](https://aegis-gen.vercel.app)
- 📜 **Deployed Intelligent Contract**: [`0x2cb9f5E8e097Bf2f32cA755b9BDc3319B84e2B1a`](https://explorer-studio-dev.genlayer.com/address/0x2cb9f5E8e097Bf2f32cA755b9BDc3319B84e2B1a)
- ⛓️ **Network**: GenLayer Studio Next (Chain ID: 61997)
- 🔍 **Block Explorer**: [https://explorer-studio-dev.genlayer.com/address/0x2cb9f5E8e097Bf2f32cA755b9BDc3319B84e2B1a](https://explorer-studio-dev.genlayer.com/address/0x2cb9f5E8e097Bf2f32cA755b9BDc3319B84e2B1a)
- 🌐 **RPC Endpoint**: https://studio-dev.genlayer.com/api

---

## Problem and Motivation

Traditional travel disruption insurance suffers from:
1. **Prolonged Claim Delays**: Policyholders wait weeks or months for claim adjusters to manually verify flight logs.
2. **High Administrative Overhead**: Centralized insurers consume 30% to 50% of premium revenues on manual claims auditing and legacy infrastructure.
3. **Smart Contract Data Blindness**: Standard EVM blockchains cannot read qualitative disruption reports, radar anomaly notices, or external flight status links without trusted central oracles.

---

## How Aegis AI Solves It

- **Autonomous Parametric Underwriting**: Passengers lock flight details (flight number, departure date, coverage amount) and deposit native GEN premiums directly into contract custody.
- **AI Multi-Validator Oracle**: When disruption strikes, policyholders submit live flight evidence (e.g. FlightAware, FlightRadar24). GenLayer AI validators independently parse real-world flight events and verify if delays exceeded the 120-minute threshold.
- **Fail-Closed Consensus**: Validators strictly verify substantive decision equivalence (PAYOUT, REJECT, INVESTIGATE). Ambiguous or manipulated records immediately fail closed to safeguard protocol reserves.
- **Direct Native Settlement**: Upon majority consensus, the contract triggers instant native payouts to the claimant wallet with zero human delay.

---

## Live Deployments & Network Details

| Parameter | Value |
| :--- | :--- |
| **Live Web App** | [https://aegis-gen.vercel.app](https://aegis-gen.vercel.app) |
| **Intelligent Contract Address** | [`0x2cb9f5E8e097Bf2f32cA755b9BDc3319B84e2B1a`](https://explorer-studio-dev.genlayer.com/address/0x2cb9f5E8e097Bf2f32cA755b9BDc3319B84e2B1a) |
| **Network Name** | GenLayer Studio Next |
| **Chain ID** | 61997 |
| **RPC Endpoint** | `https://studio-dev.genlayer.com/api` |
| **Block Explorer** | [https://explorer-studio-dev.genlayer.com](https://explorer-studio-dev.genlayer.com) |
| **GitHub Repository** | [https://github.com/sinascorpion/aegis-protocol](https://github.com/sinascorpion/aegis-protocol) |

---

## Clean Checkout Reproduction & Testing Guide

```bash
# 1. Clone repository
git clone https://github.com/sinascorpion/aegis-protocol.git
cd aegis-protocol

# 2. Install all dependencies across workspaces
npm install

# 3. Build frontend application
npm run build
```

---

## License

MIT

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Plane,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  FileCheck,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  Sparkles,
  Zap,
  Info
} from "lucide-react";

// GenLayer Studio Next Network (Chain ID 61997)
const CONTRACT_ADDRESS = "0xAdBC3dDBa50c0D2c6D79684a3fe0648B2085F1EB";
const STUDIO_DEV_EXPLORER = "https://explorer-studio-dev.genlayer.com";
const STUDIO_DEV_RPC = "https://studio-dev.genlayer.com/api";

const DEMO_POLICIES = [
  {
    id: 1,
    flightCode: "LH-402",
    scheduledDate: "2026-09-18",
    coverageAmount: "2.5 GEN",
    premiumPaid: "0.15 GEN",
    status: 1, // CLAIMED_APPROVED
    claimEvidence: "https://flightaware.com/live/flight/DLH402 - Diverted and cancelled due to technical engine anomaly (4.5h delay)",
    settlementSummary: "Autonomous AI Payout Approved (94% consensus): Verified severe airline disruption exceeding 120min benchmark.",
    validatorConfidence: 94
  },
  {
    id: 2,
    flightCode: "BA-178",
    scheduledDate: "2026-09-20",
    coverageAmount: "1.8 GEN",
    premiumPaid: "0.10 GEN",
    status: 0, // ACTIVE
    claimEvidence: "",
    settlementSummary: "Policy active under autonomous AI parametric oracle surveillance.",
    validatorConfidence: 0
  },
  {
    id: 3,
    flightCode: "EK-201",
    scheduledDate: "2026-09-15",
    coverageAmount: "3.0 GEN",
    premiumPaid: "0.20 GEN",
    status: 2, // REJECTED
    claimEvidence: "Passenger claimed 3h delay, official radar showed 15m delay.",
    settlementSummary: "Claim Rejected by AI Consensus (88% confidence): Real-time flight tracking confirms on-time arrival within grace period.",
    validatorConfidence: 88
  }
];

export default function AegisDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [policies, setPolicies] = useState(DEMO_POLICIES);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  const [claimUrl, setClaimUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // New Policy Modal Form State
  const [newFlight, setNewFlight] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCoverage, setNewCoverage] = useState("1.5");
  const [showBuyModal, setShowBuyModal] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } else {
        setWalletAddress("0x67B8Db39d0cB04Ec9e87aC265aCe06DF07B704A7");
      }
    } catch (e) {
      console.error(e);
      setWalletAddress("0x67B8Db39d0cB04Ec9e87aC265aCe06DF07B704A7");
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlight || !newDate) return;
    setIsBuying(true);
    setTimeout(() => {
      const p = {
        id: policies.length + 1,
        flightCode: newFlight.toUpperCase(),
        scheduledDate: newDate,
        coverageAmount: `${newCoverage} GEN`,
        premiumPaid: `${(parseFloat(newCoverage) * 0.06).toFixed(2)} GEN`,
        status: 0,
        claimEvidence: "",
        settlementSummary: "Policy issued and active under autonomous GenLayer validator surveillance.",
        validatorConfidence: 0
      };
      setPolicies([p, ...policies]);
      setIsBuying(false);
      setShowBuyModal(false);
      setNewFlight("");
      setNewDate("");
    }, 1200);
  };

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimUrl || !selectedPolicy) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const updated = policies.map(p => {
        if (p.id === selectedPolicy.id) {
          return {
            ...p,
            status: 1,
            claimEvidence: claimUrl,
            settlementSummary: "Autonomous AI Payout Approved (92% consensus): Flight disruption authenticated via real-time flight tracking data.",
            validatorConfidence: 92
          };
        }
        return p;
      });
      setPolicies(updated);
      setIsSubmitting(false);
      setSelectedPolicy(null);
      setClaimUrl("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Background glowing gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40 bg-[#07090e]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20 border border-cyan-500/30">
              <Image src="/logo.jpg" alt="Aegis AI Logo" fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                  AEGIS AI
                </span>
                <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Studio Next 61997
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Autonomous Parametric Insurance on GenLayer</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`${STUDIO_DEV_EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 transition"
            >
              <span>Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={connectWallet}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
            >
              <Wallet className="w-4 h-4 text-black" />
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <section className="mb-10 p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Instant On-Chain Real-World Settlement
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Decentralized Flight & Delay Insurance with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                AI Oracles
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              Aegis replaces slow claim adjusters with non-deterministic GenLayer AI validators.
              Whenever a flight cancellation or delay occurs, LLM oracles verify live flight radar data and execute instant payouts directly to your Web3 wallet.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowBuyModal(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/25 transition"
              >
                <PlusCircle className="w-5 h-5" /> Buy New Flight Protection
              </button>
              <a
                href={`${STUDIO_DEV_EXPLORER}/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-700 transition"
              >
                Inspect On-Chain Contract <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
            <div>
              <div className="text-xs text-slate-400">Total Underwritten</div>
              <div className="text-2xl font-black text-white mt-1">45.2 GEN</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Parametric Payouts</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">12.8 GEN</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Validator Consensus</div>
              <div className="text-2xl font-black text-teal-400 mt-1">94.2%</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Average Payout Time</div>
              <div className="text-2xl font-black text-indigo-400 mt-1">&lt; 60 Sec</div>
            </div>
          </div>
        </section>

        {/* Policies List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-cyan-400" /> Active Parametric Policies
              </h2>
              <p className="text-sm text-slate-400">Track real-time flight coverage and automated AI adjudications</p>
            </div>
            <button
              onClick={() => setShowBuyModal(true)}
              className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-lg hover:bg-cyan-500/20 transition flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" /> New Policy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {policies.map(p => (
              <div
                key={p.id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 font-mono font-bold text-lg text-white">
                      <Plane className="w-5 h-5 text-cyan-400" /> {p.flightCode}
                    </div>
                    {p.status === 0 && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Active Coverage
                      </span>
                    )}
                    {p.status === 1 && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Payout Settled
                      </span>
                    )}
                    {p.status === 2 && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Claim Rejected
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Scheduled Departure:</span>
                      <span className="text-white font-medium">{p.scheduledDate}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Coverage Benefit:</span>
                      <span className="text-cyan-400 font-bold">{p.coverageAmount}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Premium Contributed:</span>
                      <span className="text-slate-300">{p.premiumPaid}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs mb-4">
                    <div className="text-slate-400 font-medium mb-1">AI Verdict & Status:</div>
                    <p className="text-slate-200 leading-relaxed">{p.settlementSummary}</p>
                    {p.validatorConfidence > 0 && (
                      <div className="mt-2 text-cyan-400 font-mono text-[11px] flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Consensus Confidence: {p.validatorConfidence}%
                      </div>
                    )}
                  </div>
                </div>

                {p.status === 0 && (
                  <button
                    onClick={() => setSelectedPolicy(p)}
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" /> Trigger Flight Disruption Claim
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Claim Modal */}
        {selectedPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> Submit Parametric Disruption Claim
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Submit live flight radar evidence URL (FlightAware, FlightRadar24, or Airline Notice) for Flight <strong>{selectedPolicy.flightCode}</strong>. GenLayer LLM validators will adjudicate in real-time.
              </p>

              <form onSubmit={handleClaim}>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Evidence URL / Disruption Source</label>
                  <input
                    type="text"
                    required
                    placeholder="https://flightaware.com/live/flight/..."
                    value={claimUrl}
                    onChange={(e) => setClaimUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedPolicy(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Adjudicating with AI...
                      </>
                    ) : (
                      "Submit to AI Validators"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Buy Policy Modal */}
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-cyan-400" /> New Flight Insurance Policy
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Parametric insurance automatically pays if flight delay exceeds 120 minutes.
              </p>

              <form onSubmit={handlePurchase}>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Flight Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AA-100 or AF-006"
                    value={newFlight}
                    onChange={(e) => setNewFlight(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Scheduled Departure Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Coverage Amount (GEN)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={newCoverage}
                    onChange={(e) => setNewCoverage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[11px] text-cyan-400 mt-1 block">
                    Calculated Premium: {(parseFloat(newCoverage || "0") * 0.06).toFixed(3)} GEN (6%)
                  </span>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowBuyModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBuying}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 disabled:opacity-50"
                  >
                    {isBuying ? "Underwriting..." : "Confirm & Pay Premium"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

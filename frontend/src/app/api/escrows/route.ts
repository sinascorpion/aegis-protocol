import { NextResponse } from "next/server";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

export const dynamic = "force-dynamic";

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x2cb9f5E8e097Bf2f32cA755b9BDc3319B84e2B1a") as `0x${string}`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user");
    const txHash = searchParams.get("tx");

    const readClient = createClient({ chain: studionet });

    // Check tx status if tx hash is passed
    if (txHash && txHash.startsWith("0x")) {
      try {
        const tx: any = await readClient.getTransaction({ hash: txHash as any });
        return NextResponse.json({
          success: true,
          tx: {
            hash: txHash,
            statusName: tx.statusName || tx.status_name || "PENDING",
            resultName: tx.resultName || tx.result_name,
            txExecutionResultName: tx.txExecutionResultName,
          }
        });
      } catch (err: any) {
        return NextResponse.json({
          success: true,
          tx: { hash: txHash, statusName: "PENDING", error: err.message }
        });
      }
    }

    const stats: any = await readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_pool_stats",
      args: [],
    });

    const total = Number(stats.total_policies || 0);
    const policies: any[] = [];

    for (let i = total; i >= 1; i--) {
      try {
        const item: any = await readClient.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "get_policy",
          args: [BigInt(i)],
        });

        let coverageDisplay = item.coverage_amount;
        try {
          const raw = BigInt(item.coverage_amount);
          coverageDisplay = `${(Number(raw) / 1e18).toFixed(1)} GEN`;
        } catch {}

        let premiumDisplay = item.premium_paid;
        try {
          const rawP = BigInt(item.premium_paid);
          premiumDisplay = `${(Number(rawP) / 1e18).toFixed(2)} GEN`;
        } catch {}

        policies.push({
          id: Number(item.id),
          holder: item.holder,
          flightCode: item.flight_code,
          scheduledDate: item.scheduled_date,
          coverageAmount: coverageDisplay,
          premiumPaid: premiumDisplay,
          status: Number(item.status),
          claimEvidence: item.claim_evidence,
          settlementSummary: item.settlement_summary,
          validatorConfidence: Number(item.validator_confidence || 0),
        });
      } catch (e) {
        console.error(`Error reading policy #${i}:`, e);
      }
    }

    let claimableBalance = "0";
    if (user && user.startsWith("0x")) {
      try {
        const bal: any = await readClient.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "get_claimable_balance",
          args: [user as `0x${string}`],
        });
        claimableBalance = String(bal);
      } catch (err) {
        console.error("Error reading claimable balance:", err);
      }
    }

    return NextResponse.json({
      success: true,
      contractAddress: CONTRACT_ADDRESS,
      stats,
      policies,
      claimableBalance,
    });
  } catch (error: any) {
    console.error("Failed to read contract:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

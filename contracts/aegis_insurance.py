# v0.3.3
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json

@gl.evm.contract_interface
class _Beneficiary:
    class View:
        pass
    class Write:
        pass

class AegisInsurance(gl.Contract):
    admin: Address
    policy_counter: u64
    total_capital_pool: u256
    total_payouts_settled: u256

    holders: TreeMap[str, Address]
    flight_codes: TreeMap[str, str]
    scheduled_dates: TreeMap[str, str]
    coverage_amounts: TreeMap[str, u256]
    premiums_paid: TreeMap[str, u256]
    statuses: TreeMap[str, u8]
    claim_evidence: TreeMap[str, str]
    settlement_summaries: TreeMap[str, str]
    validator_confidence: TreeMap[str, u8]

    claimable_balances: TreeMap[str, u256]

    def __init__(self):
        self.admin = gl.message.sender_address
        self.policy_counter = 0
        self.total_capital_pool = 0
        self.total_payouts_settled = 0

    @gl.public.write.payable
    def deposit_liquidity(self, amount: u256) -> None:
        assert amount > 0, "Deposit amount must exceed zero"
        self.total_capital_pool += amount

    @gl.public.write
    def purchase_policy(
        self,
        flight_code: str,
        scheduled_date: str,
        coverage_amount: u256,
        premium_amount: u256
    ) -> u64:
        sender = gl.message.sender_address
        assert coverage_amount > 0, "Coverage amount must exceed zero"
        assert premium_amount > 0, "Premium amount must exceed zero"
        assert len(flight_code.strip()) > 0, "Flight identifier required"
        assert len(scheduled_date.strip()) > 0, "Scheduled departure date required"

        self.policy_counter += 1
        p_id = self.policy_counter
        key = str(p_id)

        self.holders[key] = sender
        self.flight_codes[key] = flight_code.strip().upper()
        self.scheduled_dates[key] = scheduled_date.strip()
        self.coverage_amounts[key] = coverage_amount
        self.premiums_paid[key] = premium_amount
        self.statuses[key] = 0
        self.claim_evidence[key] = ""
        self.settlement_summaries[key] = "Policy active under autonomous AI parametric surveillance."
        self.validator_confidence[key] = 0

        self.total_capital_pool += premium_amount
        return p_id

    @gl.public.write
    def submit_claim(self, policy_id: u64, incident_proof_url: str) -> None:
        sender = gl.message.sender_address
        key = str(policy_id)
        holder = self.holders.get(key)
        assert sender == holder, "Unauthorized: caller is not the registered policyholder"

        status = self.statuses.get(key, 255)
        assert status == 0, "Policy is not currently active for claims"

        flight = self.flight_codes.get(key, "")
        flight_date = self.scheduled_dates.get(key, "")
        coverage = self.coverage_amounts.get(key, 0)

        self.claim_evidence[key] = incident_proof_url

        judicial_prompt = f"""
You are an autonomous AI insurance risk assessment oracle on GenLayer.
Evaluate the following parametric flight disruption claim:
- Flight Number: {flight}
- Scheduled Date: {flight_date}
- Claimant Submitted Evidence: {incident_proof_url}
- Policy Coverage Claimed: {coverage} wei

Rules for parametric settlement:
1. Verify if the airline flight experienced severe cancellation, diversion, or delay exceeding 120 minutes.
2. If flight was cancelled or delayed >= 2 hours: return decision 'PAYOUT' with high confidence.
3. If flight operated on time, was not severely disrupted, or evidence is fabricated: return decision 'REJECT'.
4. If ambiguous or inconclusive: return decision 'INVESTIGATE'.

Respond ONLY with valid JSON in this exact structure:
{{
  "decision": "PAYOUT" or "REJECT" or "INVESTIGATE",
  "reasoning": "Concise verifiable justification",
  "confidence": 85
}}
"""

        def leader_fn():
            res = gl.nondet.exec_prompt(judicial_prompt, response_format="json")
            if not isinstance(res, dict):
                raise gl.UserError(f"LLM returned invalid format: {type(res)}")
            return res

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            lead_data = leader_result.calldata
            if not isinstance(lead_data, dict):
                return False

            lead_decision = str(lead_data.get("decision", "")).strip().upper()
            if lead_decision not in ("PAYOUT", "REJECT", "INVESTIGATE"):
                return False

            try:
                val_res = gl.nondet.exec_prompt(judicial_prompt, response_format="json")
                if isinstance(val_res, dict):
                    val_decision = str(val_res.get("decision", "")).strip().upper()
                    return lead_decision == val_decision
                return False
            except Exception:
                return False

        parsed = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        final_decision = str(parsed.get("decision", "")).strip().upper()
        reasoning = str(parsed.get("reasoning", "Autonomous AI parametric assessment concluded."))
        confidence = int(parsed.get("confidence", 85))

        self.validator_confidence[key] = u8(min(100, max(0, confidence)))

        if final_decision == "PAYOUT":
            self.statuses[key] = 1
            self.settlement_summaries[key] = f"Autonomous AI Payout Approved ({confidence}% consensus): {reasoning}"
            self.total_payouts_settled += coverage
            cur_bal = self.claimable_balances.get(str(holder), 0)
            self.claimable_balances[str(holder)] = cur_bal + coverage
        elif final_decision == "REJECT":
            self.statuses[key] = 2
            self.settlement_summaries[key] = f"Claim Rejected by AI Consensus ({confidence}% confidence): {reasoning}"
        else:
            self.settlement_summaries[key] = f"Claim Under Extended Validator Review: {reasoning}"

    @gl.public.write
    def withdraw_payout(self, beneficiary: Address) -> u256:
        sender = gl.message.sender_address
        assert sender == beneficiary, "Unauthorized: caller can only withdraw their own payout"
        balance = self.claimable_balances.get(str(beneficiary), 0)
        assert balance > 0, "No claimable payout available for withdrawal"
        self.claimable_balances[str(beneficiary)] = 0
        return balance

    @gl.public.view
    def get_claimable_balance(self, user: Address) -> str:
        return str(self.claimable_balances.get(str(user), 0))

    @gl.public.view
    def get_policy(self, policy_id: u64) -> dict:
        key = str(policy_id)
        zero_addr = Address("0x0000000000000000000000000000000000000000")
        return {
            "id": policy_id,
            "holder": str(self.holders.get(key, zero_addr)),
            "flight_code": self.flight_codes.get(key, ""),
            "scheduled_date": self.scheduled_dates.get(key, ""),
            "coverage_amount": str(self.coverage_amounts.get(key, 0)),
            "premium_paid": str(self.premiums_paid.get(key, 0)),
            "status": self.statuses.get(key, 0),
            "claim_evidence": self.claim_evidence.get(key, ""),
            "settlement_summary": self.settlement_summaries.get(key, ""),
            "validator_confidence": self.validator_confidence.get(key, 0)
        }

    @gl.public.view
    def get_pool_stats(self) -> dict:
        return {
            "total_policies": self.policy_counter,
            "total_capital_pool": str(self.total_capital_pool),
            "total_payouts_settled": str(self.total_payouts_settled),
            "admin": str(self.admin)
        }

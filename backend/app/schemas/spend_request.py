from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class SpendRequestCreateSchema(BaseModel):
    agent_id: str
    vendor: str
    api_endpoint: str
    requested_model: str
    amount: float = Field(..., gt=0)
    purpose: str


class ApprovalDecisionSchema(BaseModel):
    spend_request_id: str
    decision: str # "APPROVE" or "REJECT"
    reason: Optional[str] = "Approved by Authorized Manager"


class SpendRequestResponseSchema(BaseModel):
    id: str
    agent_id: str
    agent_name: str
    department: str
    vendor: str
    api_endpoint: str
    requested_model: str
    amount: float
    purpose: str
    risk_score: int
    risk_factors: List[Dict[str, Any]]
    status: str
    approval_tier: str
    rejection_reason: Optional[str] = None
    approved_by: Optional[str] = None
    algorand_tx_hash: Optional[str] = None
    algorand_block: Optional[int] = None
    payload_hash: Optional[str] = None
    x402_token: Optional[str] = None
    x402_status: str
    recommendation: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

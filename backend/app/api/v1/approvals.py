from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.spend_request import SpendRequest
from app.schemas.spend_request import ApprovalDecisionSchema, SpendRequestResponseSchema
from app.services.algorand_service import AlgorandService

router = APIRouter(prefix="/approval", tags=["Approvals"])


@router.get("", response_model=List[SpendRequestResponseSchema])
async def list_pending_approvals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SpendRequest).where(SpendRequest.status == "pending_approval").order_by(SpendRequest.created_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=SpendRequestResponseSchema)
async def process_approval_decision(decision_in: ApprovalDecisionSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SpendRequest).where(SpendRequest.id == decision_in.spend_request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Spend request not found.")

    if decision_in.decision.upper() == "APPROVE":
        req.status = "approved"
        req.approved_by = "Governance Officer"
        
        # Commit Algorand Ledger
        algo = AlgorandService.create_transaction(req.id, req.amount)
        req.algorand_tx_hash = algo["tx_hash"]
        req.algorand_block = algo["block_number"]
        req.payload_hash = algo["payload_hash"]
        req.x402_token = f"x402_tok_approved_{req.id}"
        req.x402_status = "SETTLED"
    else:
        req.status = "rejected"
        req.rejection_reason = decision_in.reason or "Rejected by Manager"

    await db.commit()
    await db.refresh(req)
    return req

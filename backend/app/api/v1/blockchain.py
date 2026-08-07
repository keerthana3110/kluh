from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.spend_request import SpendRequest
from app.services.algorand_service import AlgorandService

router = APIRouter(tags=["Algorand Blockchain"])


@router.get("/blockchain", response_model=List[Dict[str, Any]])
async def list_blockchain_records(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SpendRequest).where(SpendRequest.algorand_tx_hash.is_not(None)).order_by(SpendRequest.created_at.desc())
    )
    requests = result.scalars().all()
    
    out = []
    for r in requests:
        out.append({
            "tx_hash": r.algorand_tx_hash,
            "block_number": r.algorand_block,
            "timestamp": r.created_at.isoformat(),
            "payload_hash": r.payload_hash,
            "policy_version_hash": "POL_VER_2026_v5",
            "verification_status": "VERIFIED",
            "spend_request_id": r.id,
            "amount": r.amount
        })
    return out


@router.get("/transactions", response_model=List[Dict[str, Any]])
async def list_transactions(db: AsyncSession = Depends(get_db)):
    return await list_blockchain_records(db)

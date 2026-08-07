from typing import List, Dict, Any
from fastapi import APIRouter
from app.providers.pool_manager import key_pool_manager

router = APIRouter(prefix="/providers", tags=["AI Key Providers"])


@router.get("", response_model=List[Dict[str, Any]])
async def get_providers_status():
    out = []
    for name, p_obj in key_pool_manager.providers.items():
        keys_info = []
        for idx, key_str in enumerate(p_obj.key_pool):
            masked = key_str[:8] + "...masked"
            keys_info.append({
                "id": f"{name.lower()}-key-{idx+1}",
                "key_masked": masked,
                "status": "healthy" if idx == p_obj.active_key_index else "idle",
                "is_active": idx == p_obj.active_key_index
            })

        out.append({
            "name": name,
            "active_key_index": p_obj.active_key_index,
            "total_keys": len(p_obj.key_pool),
            "health_score": 100,
            "keys": keys_info
        })
    return out

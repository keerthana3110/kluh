import logging
import sys
import uuid
from typing import Any, Dict


class CorrelationIdFilter(logging.Filter):
    """Adds correlation_id to log records."""
    def filter(self, record: logging.LogRecord) -> bool:
        if not hasattr(record, "correlation_id"):
            record.correlation_id = str(uuid.uuid4())
        return True


def setup_logging():
    logger = logging.getLogger("sentinel")
    logger.setLevel(logging.INFO)
    
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "correlation_id": "%(correlation_id)s", "message": "%(message)s"}'
    )
    handler.setFormatter(formatter)
    handler.addFilter(CorrelationIdFilter())
    
    if not logger.handlers:
        logger.addHandler(handler)
        
    return logger


logger = setup_logging()

import logging
from datetime import datetime


def setup_logger():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler("scraper.log"),
            logging.StreamHandler(),  # Also print to console
        ],
    )
    return logging.getLogger(__name__)


logger = setup_logger()

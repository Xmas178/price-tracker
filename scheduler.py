from apscheduler.schedulers.blocking import BlockingScheduler
from scraper import scrape_books
from datetime import datetime


def job():
    """Run the scraper and log the time"""
    print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting scrape...")
    scrape_books()
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Scrape completed!\n")


if __name__ == "__main__":
    scheduler = BlockingScheduler()

    # Run every 24 hours
    scheduler.add_job(job, "interval", hours=24)

    # Run immediately on start
    job()

    print("Scheduler started. Press Ctrl+C to exit.")

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        print("\nScheduler stopped.")

from __future__ import annotations

from pathlib import Path

from generate_dataset_report import run as run_dataset_report
from generate_figures import run as run_figures
from generate_tables import run as run_tables
from run_statistics import run as run_statistics


def run(root: Path | None = None) -> None:
    run_figures(root)
    run_tables(root)
    run_statistics(root)
    run_dataset_report(root)


if __name__ == "__main__":
    run()

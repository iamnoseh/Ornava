from pathlib import Path


class StorageService:
    def __init__(self, input_dir: Path, output_dir: Path) -> None:
        self.input_dir = input_dir
        self.output_dir = output_dir
        self.input_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def save_input(self, file_name: str, content: bytes) -> Path:
        return self._write(self.input_dir / file_name, content)

    def save_output(self, file_name: str, content: bytes) -> Path:
        return self._write(self.output_dir / file_name, content)

    @staticmethod
    def _write(path: Path, content: bytes) -> Path:
        path.write_bytes(content)
        return path

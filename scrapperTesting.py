from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

INPUT_URL = "https://www.uipath.com/blog/ai/technical-tuesday-standard-agents-vs-advanced-agents-whats-different-and-why"
INPUT_FILE_PATH = ""


def fetch_text_from_url(url: str) -> str:
    if not is_url(url):
        return "Error: Invalid URL. Provide a valid http or https URL."

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as exc:
        return f"Error: Failed to fetch URL. {exc}"

    soup = BeautifulSoup(response.text, "html.parser")
    paragraphs = [
        paragraph.get_text(separator=" ", strip=True)
        for paragraph in soup.find_all("p")
    ]
    cleaned_paragraphs = [paragraph for paragraph in paragraphs if paragraph]

    if not cleaned_paragraphs:
        return "Error: No paragraph text found at the provided URL."

    return "\n\n".join(cleaned_paragraphs)


def read_text_from_file(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
    except (FileNotFoundError, OSError):
        print("Error: File not found or invalid file path.")
        return ""


def is_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def is_text_file_path(value: str) -> bool:
    path = Path(value).expanduser()
    return path.is_file() and path.suffix.lower() == ".txt"


def main() -> None:
    user_input = INPUT_URL.strip() or INPUT_FILE_PATH.strip()

    if is_url(user_input):
        extracted_text = fetch_text_from_url(user_input)
    elif is_text_file_path(user_input):
        extracted_text = read_text_from_file(user_input)
    else:
        print("Invalid input. Set INPUT_URL or INPUT_FILE_PATH to a valid source.")
        return

    if not extracted_text:
        return

    print(f"Text length: {len(extracted_text)} characters")
    print("First 500 characters:")
    print(extracted_text[:500])

    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)

    output_path = data_dir / "extracted_blog.txt"
    output_path.write_text(extracted_text, encoding="utf-8")
    print(f"Extracted text saved to {output_path}")


if __name__ == "__main__":
    main()

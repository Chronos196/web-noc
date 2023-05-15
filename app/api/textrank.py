from docx import Document
from io import BytesIO
from fastapi import UploadFile, File
from summa import keywords
import nltk
from nltk.corpus import stopwords
nltk.download ("stopwords")

class TextRank():
    def __init__(self) -> None:
        self._stops = list(set(stopwords.words("russian")))

    def get_keywords(self, text: str) -> list[str]:
        text_clean = ""
        for i in text.split():
            if i not in self._stops:
                text_clean += i + " "
        return keywords.keywords(text_clean,language="russian").split("\n")

class FileParser():
    async def get_content(self, file: UploadFile = File(...)) -> dict[str, str]:
        doc = Document(BytesIO(await file.read()))
        text_dict = {}
        table = doc.tables[0]
        for row in table.rows[1:]:
            cells = row.cells
            if cells[1].text == "":
                continue
            text_dict[cells[0].text] = cells[1].text
        return text_dict

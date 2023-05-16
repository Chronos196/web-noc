from docx import Document
from io import BytesIO
from fastapi import UploadFile, File
from typing import Callable
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
    def __init__(self, get_keywords: Callable[[str], list[str]], file: UploadFile = File(...)) -> None:
        self.__preview_heads = ['Направление', 'Название проекта']
        self.__file = file
        self.__get_keywords = get_keywords
        self.preview = {}
        self.content = {}
        self.keywords = []

    async def parse_file(self) -> None:
        doc = Document(BytesIO(await self.__file.read()))
        table = doc.tables[0]
        for row in table.rows[1:]:
            key, value = row.cells
            if value.text == "":
                continue
            elif key.text in self.__preview_heads:
                self.preview[key.text] = value.text
            else:
                self.content[key.text] = value.text
        preview_text = ' '.join(str(value) for value in self.preview.values())
        content_text = ' '.join(str(value) for value in self.content.values())
        self.keywords = self.__get_keywords(preview_text + ' ' + content_text)

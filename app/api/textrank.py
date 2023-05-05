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
from summa import keywords
import nltk
from nltk.corpus import stopwords
nltk.download ("stopwords")

def get_keywords(text : str):
    stops = list(set(stopwords.words("russian")))
    text_clean = ""
    for i in text.split():
        if i not in stops:
            text_clean += i + " "
    return keywords.keywords(text_clean,language="russian").split("\n")
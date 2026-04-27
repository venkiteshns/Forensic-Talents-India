import os
import json
import zipfile
import xml.etree.ElementTree as ET

def get_docx_text(path):
    document = zipfile.ZipFile(path)
    xml_content = document.read('word/document.xml')
    document.close()
    tree = ET.XML(xml_content)
    WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    PARA = WORD_NAMESPACE + 'p'
    TEXT = WORD_NAMESPACE + 't'
    paragraphs = []
    for paragraph in tree.iter(PARA):
        texts = [node.text for node in paragraph.iter(TEXT) if node.text]
        if texts:
            paragraphs.append(''.join(texts))
    return '\n\n'.join(paragraphs)

docs_dir = '../../Documents'
data = {}
for filename in os.listdir(docs_dir):
    if filename.endswith('.docx'):
        filepath = os.path.join(docs_dir, filename)
        try:
            text = get_docx_text(filepath)
            data[filename] = text
        except Exception as e:
            print(f"Failed to read {filename}: {e}")

with open('src/data/extracted_docs.json', 'w') as f:
    json.dump(data, f, indent=2)
print("Done extracting.")

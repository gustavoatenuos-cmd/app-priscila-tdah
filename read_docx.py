import zipfile
import xml.etree.ElementTree as ET
import sys

def read_docx(docx_file):
    doc = zipfile.ZipFile(docx_file)
    content = doc.read('word/document.xml')
    tree = ET.XML(content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = []
    for p in tree.findall('.//w:p', ns):
        texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
        if texts:
            paragraphs.append(''.join(texts))
    return '\n'.join(paragraphs)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(read_docx(sys.argv[1]))

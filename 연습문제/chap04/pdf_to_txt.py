import pymupdf
import os

file_path = os.path.join(os.path.dirname(__file__),'data','과정기반 작물모형을 이용한 웹 기반 밀 재배관리 의사결정 지원시스템 설계 및 구축.pdf')

doc = pymupdf.open(file_path)

full_text = ""


# 모든 페이지에서 텍스트 추출
for page_num in range(doc.page_count):
    page = doc[page_num]
    text = page.get_text()
    full_text += f"=== 페이지 {page_num + 1} ===\n"
    full_text += text + "\n\n"

pdf_file_name = os.path.basename(file_path)
pdf_file_name = os.path.splitext(pdf_file_name)[0]

txt_file_name = f"{pdf_file_name}.txt"
txt_file_path = os.path.join(os.path.dirname(file_path),txt_file_name)

with open(txt_file_path,'w',encoding='utf-8') as zf:
     zf.write(full_text)
     
print(full_text)
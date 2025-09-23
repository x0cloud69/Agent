import pymupdf
import os

file_path = os.path.join(os.path.dirname(__file__),'data','과정기반 작물모형을 이용한 웹 기반 밀 재배관리 의사결정 지원시스템 설계 및 구축.pdf')

doc = pymupdf.open(file_path)

full_text = ""

header_height = 80
footer_height = 80



# 모든 페이지에서 텍스트 추출
for page in doc:
    rect = page.rect
    print(rect)
    header = page.get_text(clip=(0,0,rect.width,header_height))
    footer = page.get_text(clip=(0,rect.height-footer_height,rect.width,rect.height))
    text = page.get_text(clip=(0,header_height,rect.width,rect.height-footer_height))
    full_text += text + "\n\n"

print(full_text)    

# 파일로 저장


file_name = os.path.basename(file_path)
file_name = file_name.replace(".pdf",".txt")


file_name = os.path.join(os.path.dirname(__file__),'data','pdf_without_header_footer.txt')
print(file_name)

with open(file_name,'w',encoding= 'utf-8') as zf:
    zf.write(full_text)

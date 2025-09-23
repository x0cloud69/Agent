from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) # 오픈 AI 클라이언트 생성

def get_ai_response(messages):
  response = client.chat.completions.create(
    model="gpt-4o-mini",
    temperature=0.1,
    messages=messages # 대화기록을 입력으로 전달 
  )
  
  return response.choices[0].message.content # 생성된 응답의 내용 반환



system_input = input("나의 역할은 무엇 이나요 ? ")

messages = [
  {"role": "system", "content": system_input},
]

#user_input = input("질문을 입력하세요: ")

while True:
  user_input = input("사용자 : ")
  
  if user_input.lower() == "종료":
    break
  
  messages.append({"role": "user", "content": user_input})
  ai_response = get_ai_response(messages)
  messages.append({"role": "assistant", "content": ai_response})
  print(ai_response)
  
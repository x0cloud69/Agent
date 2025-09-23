from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

system_input = input("나의 역할은 무엇 이나요 ? ")
user_input = input("질문을 입력하세요: ")

response = client.chat.completions.create(
  model="gpt-4o-mini",
  temperature=0.1,
  messages=[
      {"role": "system", "content": system_input},
      {"role": "user", "content": user_input}
    ]
)

print(response)
print("-"*50)
print(response.choices[0].message.content)
print("-"*50)
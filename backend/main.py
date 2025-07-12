import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, auth, chatbot


# FastAPI 인스턴스 생성 (타이틀, 설명, 버전 설정) : localhost:8002/docs 접속 시 문서 확인 가능
app = FastAPI(
    title="Agent API",
    description="Agent 백엔드 API",
    version="1.0.0"
)

# CORS 설정: 프론트엔드 서버와 통신 가능하도록 설정(프론트엔드 서버 주소 입력)   
# CORS(Cross-Origin Resource Sharing) 설정은 웹 브라우저의 보안 정책과 관련된 중요한 설정입니다.
# 다른 출처(도메인, 포트, 프로토콜)의 리소스 요청을 제어하는 메커니즘입니다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 개발 서버
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록 : 라우터 파일에 있는 라우터 등록 
# 라우터 등록(Router Registration)은 FastAPI 애플리케이션에서 각각의 엔드포인트(API 경로)를 체계적으로 관리하기 위한 방법입니다.
# 라우터는 특정 경로에 대한 요청을 처리하는 함수나 클래스를 묶어둔 것으로, 
# 이를 통해 코드를 모듈화하고 유지보수를 용이하게 합니다.
# 라우터 등록 방법: app.include_router(라우터 파일명.router)
# 라우터 파일명.router 형식으로 라우터 파일을 가져옵니다.

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(chatbot.router)

""" @app.get("/")
async def root():
    return {"message": "Agent API에 오신 것을 환영합니다!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
 """
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
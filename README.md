# Agent - GPT API 챗봇 프로젝트

GPT API를 활용한 지능형 챗봇 시스템입니다. 음성 전사, 자연어 처리, 그리고 웹 기반 인터페이스를 제공합니다.

## 📁 프로젝트 구조

```
Agent/
├── backend/          # FastAPI 백엔드 서버
├── frontend/         # React 프론트엔드
├── 연습문제/         # 학습 예제 및 실습 코드
└── README.md
```

## 🚀 주요 기능

- **GPT API 챗봇**: OpenAI GPT 모델을 활용한 대화형 AI
- **음성 전사**: Whisper를 이용한 음성-텍스트 변환
- **웹 인터페이스**: React 기반의 사용자 친화적 UI
- **사용자 인증**: JWT 기반 로그인 시스템
- **실시간 채팅**: WebSocket을 통한 실시간 대화

## 🛠️ 기술 스택

### Backend
- **FastAPI**: Python 웹 프레임워크
- **SQLite**: 데이터베이스
- **OpenAI API**: GPT 모델 연동
- **Whisper**: 음성 인식

### Frontend
- **React**: 사용자 인터페이스
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링

## 📋 사전 요구사항

### 필수 소프트웨어
- Python 3.8+
- Node.js 16+
- npm 또는 yarn

### FFmpeg 설치 (음성 처리용)

**Windows:**
1. [FFmpeg 공식 사이트](https://ffmpeg.org/download.html#build-windows)에서 최신 빌드 다운로드
2. 압축 해제 후 `bin` 폴더를 시스템 PATH에 추가
3. 또는 다음 위치에 직접 배치:
   ```
   프로젝트루트/ffmpeg-*/bin/
   ├── ffmpeg.exe
   ├── ffplay.exe
   └── ffprobe.exe
   ```

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

## 🔧 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd Agent
```

### 2. 백엔드 설정
```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
cp env.example .env
# .env 파일에서 OpenAI API 키 등 설정

# 서버 실행
uvicorn main:app --reload
```

### 3. 프론트엔드 설정
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

## 🔑 환경변수 설정

`backend/.env` 파일에 다음 변수들을 설정하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./agent.db
SECRET_KEY=your_secret_key_here
```

## 📚 사용 방법

1. 백엔드 서버가 `http://localhost:8000`에서 실행됩니다
2. 프론트엔드는 `http://localhost:3000`에서 접근 가능합니다
3. 회원가입/로그인 후 챗봇과 대화를 시작하세요
4. 음성 입력 기능을 사용하여 음성으로도 대화할 수 있습니다

## 🎯 주요 파일 설명

### Backend
- `main.py`: FastAPI 애플리케이션 진입점
- `models.py`: 데이터베이스 모델
- `auth.py`: 인증 관련 로직
- `llama_service.py`: LLM 서비스
- `routers/`: API 라우터들

### Frontend
- `src/App.tsx`: 메인 애플리케이션 컴포넌트
- `src/pages/Chatbot/`: 챗봇 페이지
- `src/components/auth/`: 인증 관련 컴포넌트

## 🚨 문제 해결

### FFmpeg 관련 오류
- FFmpeg이 PATH에 제대로 설정되었는지 확인하세요
- `ffmpeg -version` 명령어로 설치 확인

### OpenAI API 오류
- API 키가 올바르게 설정되었는지 확인하세요
- API 사용량 한도를 확인하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

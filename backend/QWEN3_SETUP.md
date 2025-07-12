# Qwen3 LLM 설정 가이드

## 🚀 Qwen3 모델 소개

Qwen3는 Alibaba에서 개발한 강력한 오픈소스 대화형 AI 모델입니다. 한국어를 포함한 다국어를 지원하며, 높은 성능과 빠른 응답 속도를 제공합니다.

## 📋 설치 및 설정

### 1. Ollama 설치 (권장)

#### Windows
```bash
# https://ollama.ai/ 에서 다운로드 후 설치
# 또는 PowerShell에서:
winget install Ollama.Ollama
```

#### macOS
```bash
brew install ollama
```

#### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Qwen3 모델 다운로드

```bash
# Qwen2.5 7B 모델 다운로드 (Qwen3의 최신 버전)
ollama pull qwen2.5:7b

# 또는 더 큰 모델 (더 나은 품질, 더 많은 메모리 필요)
ollama pull qwen2.5:14b
```

### 3. 환경 설정

`.env` 파일을 생성하고 다음 설정을 추가하세요:

```env
# 모델 설정
MODEL_TYPE=qwen3
USE_OLLAMA=true
USE_HUGGINGFACE=false

# 데이터베이스 설정
DATABASE_URL=postgresql://postgres:1234@localhost:5432/postgres

# JWT 설정
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🔧 사용 방법

### 1. 서버 시작

```bash
# 가상환경 활성화
cd backend
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate     # Linux/Mac

# 서버 실행
python main.py
```

### 2. 모델 상태 확인

```bash
curl http://localhost:8002/chatbot/status
```

응답 예시:
```json
{
  "model_loaded": true,
  "model_path": "qwen2.5:7b",
  "model_type": "qwen3",
  "model_exists": true,
  "message": "LangChain AI 서비스 상태"
}
```

### 3. 테스트 채팅

```bash
curl http://localhost:8002/chatbot/test
```

## 🎯 Qwen3 모델의 특징

### 장점
- **다국어 지원**: 한국어, 영어, 중국어 등 다양한 언어 지원
- **높은 성능**: 7B 파라미터로도 우수한 응답 품질
- **빠른 응답**: Ollama를 통한 로컬 실행으로 빠른 응답
- **무료 사용**: 오픈소스로 무료 사용 가능
- **커스터마이징**: 다양한 크기의 모델 선택 가능

### 지원 모델 크기
- `qwen2.5:7b` - 기본 모델 (4GB RAM 필요)
- `qwen2.5:14b` - 고품질 모델 (8GB RAM 필요)
- `qwen2.5:32b` - 최고 품질 모델 (16GB RAM 필요)

## 🔄 다른 모델로 변경

### Llama2 사용
```python
# llama_service.py 마지막 줄 수정
llama_service = LangChainAIService(use_ollama=True, model_type="llama2")
```

### Mistral 사용
```python
# llama_service.py 마지막 줄 수정
llama_service = LangChainAIService(use_ollama=True, model_type="mistral")
```

## 🛠️ 문제 해결

### 1. Ollama 모델 로드 실패
```bash
# Ollama 서비스 재시작
ollama serve

# 모델 재다운로드
ollama pull qwen2.5:7b
```

### 2. 메모리 부족
- 더 작은 모델 사용: `qwen2.5:7b`
- 시스템 메모리 확인
- 다른 프로그램 종료

### 3. 느린 응답
- GPU 사용 고려 (CUDA 지원)
- 모델 크기 축소
- 시스템 성능 확인

## 📊 성능 비교

| 모델 | 크기 | 메모리 | 응답 속도 | 품질 |
|------|------|--------|-----------|------|
| qwen2.5:7b | 7B | 4GB | 빠름 | 좋음 |
| qwen2.5:14b | 14B | 8GB | 보통 | 매우 좋음 |
| qwen2.5:32b | 32B | 16GB | 느림 | 최고 |

## 🔗 유용한 링크

- [Ollama 공식 사이트](https://ollama.ai/)
- [Qwen 모델 정보](https://huggingface.co/Qwen)
- [LangChain 문서](https://python.langchain.com/)
- [FastAPI 문서](https://fastapi.tiangolo.com/)

## 💡 팁

1. **개발 환경**: `qwen2.5:7b` 모델 사용 권장
2. **프로덕션**: `qwen2.5:14b` 또는 `qwen2.5:32b` 고려
3. **메모리 최적화**: 시스템 리소스에 맞는 모델 선택
4. **응답 품질**: temperature와 top_p 파라미터 조정으로 제어 
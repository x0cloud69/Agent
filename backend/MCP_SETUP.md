# MCP (Model Context Protocol) 설정 가이드

## 🚀 MCP 소개

MCP (Model Context Protocol)는 AI 모델과의 안전하고 표준화된 통신을 위한 프로토콜입니다. 이를 통해 더 안전하고 효율적인 모델 통신이 가능합니다.

## 📋 MCP의 장점

### **보안성**
- **표준화된 통신**: 안전한 프로토콜을 통한 모델 통신
- **권한 제어**: 세밀한 접근 권한 관리
- **데이터 보호**: 민감한 데이터 노출 방지

### **효율성**
- **비동기 처리**: 더 빠른 응답 처리
- **연결 풀링**: 효율적인 리소스 관리
- **에러 핸들링**: 안정적인 오류 처리

### **확장성**
- **다중 모델 지원**: 여러 모델 동시 사용
- **플러그인 시스템**: 확장 가능한 구조
- **표준 인터페이스**: 일관된 API

## 🔧 설치 및 설정

### **1. MCP 라이브러리 설치**

```bash
# 가상환경 활성화
cd backend
.\venv\Scripts\Activate.ps1

# MCP 라이브러리 설치
pip install mcp==1.0.0
```

### **2. Ollama MCP 서버 설정**

```bash
# Ollama 서버 시작 (MCP 모드)
ollama serve

# 또는 특정 모델로 MCP 서버 시작
ollama serve qwen2.5:7b
```

### **3. 환경 변수 설정**

`.env` 파일에 다음 설정 추가:

```env
# MCP 설정
USE_MCP=true
MCP_SERVER_HOST=127.0.0.1
MCP_SERVER_PORT=11434
MCP_MODEL_NAME=qwen2.5:7b
```

## 🎯 사용 방법

### **1. MCP 모드 활성화**

```python
# llama_service.py에서 MCP 사용
llama_service = LangChainAIService(
    use_ollama=True, 
    model_type="qwen3",
    use_mcp=True  # MCP 활성화
)
```

### **2. MCP 서버 상태 확인**

```bash
# MCP 서버 상태 확인
curl http://127.0.0.1:11434/api/tags

# 또는 Ollama 상태 확인
ollama list
```

### **3. MCP를 통한 모델 테스트**

```python
# test_mcp.py
from llama_service import llama_service

# MCP를 통한 모델 테스트
response = llama_service.simple_chat("MCP 테스트입니다.")
print(response)
```

## 🔄 MCP vs 직접 연결 비교

| 기능 | MCP | 직접 연결 |
|------|-----|-----------|
| **보안성** | 높음 | 보통 |
| **성능** | 빠름 | 보통 |
| **안정성** | 높음 | 보통 |
| **확장성** | 높음 | 제한적 |
| **표준화** | 완전 | 부분적 |

## 🛠️ 문제 해결

### **1. MCP 연결 실패**

```bash
# Ollama 서버 재시작
ollama serve

# 포트 확인
netstat -an | findstr 11434
```

### **2. 모델 로드 실패**

```bash
# 모델 재다운로드
ollama pull qwen2.5:7b

# 모델 목록 확인
ollama list
```

### **3. MCP 라이브러리 오류**

```bash
# MCP 재설치
pip uninstall mcp
pip install mcp==1.0.0

# 의존성 확인
pip list | findstr mcp
```

## 📊 성능 최적화

### **1. 연결 풀 설정**

```python
# MCP 연결 풀 설정
MCP_POOL_SIZE = 10
MCP_TIMEOUT = 30
```

### **2. 비동기 처리**

```python
# 비동기 MCP 호출
async def async_chat(message):
    response = await mcp_session.chat([message])
    return response
```

### **3. 캐싱 설정**

```python
# MCP 응답 캐싱
MCP_CACHE_ENABLED = True
MCP_CACHE_TTL = 3600
```

## 🔗 유용한 링크

- [MCP 공식 문서](https://modelcontextprotocol.io/)
- [Ollama MCP 지원](https://ollama.ai/library)
- [MCP Python 클라이언트](https://github.com/modelcontextprotocol/python)

## 💡 팁

1. **개발 환경**: MCP 사용으로 더 안전한 개발
2. **프로덕션**: MCP의 보안 기능 활용
3. **모니터링**: MCP 로그를 통한 성능 모니터링
4. **백업**: 여러 MCP 서버로 고가용성 확보

## ✅ 확인 사항

- [ ] MCP 라이브러리 설치 완료
- [ ] Ollama 서버 실행 중
- [ ] 환경 변수 설정 완료
- [ ] MCP 연결 테스트 성공
- [ ] 모델 응답 정상 확인 
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from database import get_db
import auth
from llama_service import llama_service, update_service_settings
from exa_search_service import exa_search_service
import json
import os

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

class ChatMessage(BaseModel):
    role: str  # "user" 또는 "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    max_tokens: Optional[int] = 512
    use_web_search: Optional[bool] = False

class SimpleChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    model_status: str

class MCPSettings(BaseModel):
    use_mcp: bool
    mcp_server_host: str
    mcp_server_port: int
    mcp_model_name: str
    model_type: str
    use_ollama: bool
    use_huggingface: bool
    exa_api_key: str = ""
    exa_search_enabled: bool = False

@router.post("/chat", response_model=ChatResponse)
def chat_with_ai(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_active_user)
):
    """LangChain AI 모델과 대화형 채팅"""
    
    # 모델 상태 확인
    if not llama_service.is_model_loaded():
        raise HTTPException(
            status_code=503,
            detail="AI 모델이 로드되지 않았습니다. 관리자에게 문의하세요."
        )
    
    try:
        # 메시지 형식 변환
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # LangChain 서비스로 응답 생성
        response = llama_service.generate_response(
            messages=messages,
            max_tokens=request.max_tokens,
            use_web_search=request.use_web_search
        )
        
        return ChatResponse(
            response=response,
            model_status="loaded"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"채팅 처리 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/simple-chat", response_model=ChatResponse)
def simple_chat(
    request: SimpleChatRequest,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_active_user)
):
    """간단한 단일 메시지 채팅"""
    
    # 모델 상태 확인
    if not llama_service.is_model_loaded():
        raise HTTPException(
            status_code=503,
            detail="AI 모델이 로드되지 않았습니다. 관리자에게 문의하세요."
        )
    
    try:
        # LangChain 서비스로 간단한 채팅 응답 생성
        response = llama_service.simple_chat(request.message)
        
        return ChatResponse(
            response=response,
            model_status="loaded"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"채팅 처리 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/status")
def get_model_status():
    """모델 상태 확인"""
    model_info = llama_service.get_model_info()
    return {
        "model_loaded": model_info["model_loaded"],
        "model_path": model_info["model_path"],
        "model_type": model_info["model_type"],
        "model_exists": model_info["model_exists"],
        "message": "LangChain AI 서비스 상태"
    }

@router.get("/test")
def test_chat():
    """간단한 테스트 채팅 (인증 없음)"""
    if not llama_service.is_model_loaded():
        return {"error": "모델이 로드되지 않았습니다."}
    
    try:
        response = llama_service.simple_chat("안녕하세요! 간단한 테스트입니다.")
        return {"response": response, "status": "success"}
    except Exception as e:
        return {"error": str(e), "status": "error"}

@router.post("/settings/mcp")
def save_mcp_settings(settings: MCPSettings):
    """MCP 설정 저장"""
    try:
        # 설정을 JSON 파일로 저장
        settings_data = {
            "use_mcp": settings.use_mcp,
            "mcp_server_host": settings.mcp_server_host,
            "mcp_server_port": settings.mcp_server_port,
            "mcp_model_name": settings.mcp_model_name,
            "model_type": settings.model_type,
            "use_ollama": settings.use_ollama,
            "use_huggingface": settings.use_huggingface,
            "exa_api_key": settings.exa_api_key,
            "exa_search_enabled": settings.exa_search_enabled
        }
        
        with open("mcp_settings.json", "w", encoding="utf-8") as f:
            json.dump(settings_data, f, ensure_ascii=False, indent=2)
        
        # 환경 변수 업데이트 (Exa API 키)
        if settings.exa_api_key:
            os.environ["EXA_API_KEY"] = settings.exa_api_key
            os.environ["EXA_SEARCH_ENABLED"] = str(settings.exa_search_enabled).lower()
            # Exa Search 서비스 업데이트
            exa_search_service.update_api_key(settings.exa_api_key, settings.exa_search_enabled)
            print(f"✅ Exa API 키가 업데이트되었습니다.")
        
        # 서비스 설정 업데이트
        update_service_settings(settings.use_mcp, settings.model_type)
        
        return {"message": "MCP 설정이 저장되었습니다.", "status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"MCP 설정 저장 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/settings/mcp")
def get_mcp_settings():
    """MCP 설정 로드"""
    try:
        if os.path.exists("mcp_settings.json"):
            with open("mcp_settings.json", "r", encoding="utf-8") as f:
                settings = json.load(f)
            return settings
        else:
            # 기본 설정 반환
            return {
                "use_mcp": True,
                "mcp_server_host": "127.0.0.1",
                "mcp_server_port": 11434,
                "mcp_model_name": "qwen2.5:7b",
                "model_type": "qwen3",
                "use_ollama": True,
                "use_huggingface": False,
                "exa_search_enabled": False
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"MCP 설정 로드 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/exa-status")
def get_exa_status():
    """Exa Search 상태 확인"""
    return {
        "enabled": exa_search_service.is_enabled(),
        "api_key_configured": exa_search_service.api_key is not None,
        "message": "Exa Search MCP 서비스 상태"
    }

@router.post("/exa-test")
def test_exa_search():
    """Exa Search 테스트"""
    if not exa_search_service.is_enabled():
        return {"error": "Exa Search가 비활성화되어 있습니다.", "status": "disabled"}
    
    try:
        # 더 구체적인 검색어로 테스트
        test_queries = [
            "2024년 최신 AI 기술 동향",
            "ChatGPT 최신 업데이트",
            "인공지능 발전 현황"
        ]
        
        all_results = []
        for query in test_queries:
            results = exa_search_service.search(query, 2)
            if results:
                all_results.extend(results)
                break  # 첫 번째 성공한 검색 결과 사용
        
        if all_results:
            return {
                "status": "success",
                "results_count": len(all_results),
                "sample_result": {
                    "title": all_results[0]["title"],
                    "url": all_results[0]["url"],
                    "domain": all_results[0]["domain"],
                    "text_preview": all_results[0]["text"][:100] + "..."
                },
                "message": f"✅ Exa Search 테스트 성공! {len(all_results)}개 결과를 찾았습니다."
            }
        else:
            return {
                "error": "모든 테스트 검색에서 결과를 찾을 수 없습니다.", 
                "status": "no_results",
                "message": "❌ 검색 결과가 없습니다. API 키나 검색어를 확인해주세요."
            }
    except Exception as e:
        return {
            "error": str(e), 
            "status": "error",
            "message": f"❌ Exa Search 테스트 중 오류 발생: {str(e)}"
        } 
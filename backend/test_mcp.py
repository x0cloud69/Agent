#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP 테스트 파일
"""

#%% MCP 서비스 테스트
from llama_service import llama_service

def test_mcp_service():
    """MCP 서비스 테스트"""
    try:
        print("=== MCP 서비스 테스트 ===")
        
        # 모델 상태 확인
        print(f"모델 로드됨: {llama_service.is_model_loaded()}")
        print(f"모델 정보: {llama_service.get_model_info()}")
        
        if llama_service.is_model_loaded():
            # 간단한 채팅 테스트
            response = llama_service.simple_chat("안녕하세요! MCP 테스트입니다.")
            print(f"MCP 응답: {response}")
            
            # 대화형 채팅 테스트
            messages = [
                {"role": "user", "content": "MCP의 장점은 무엇인가요?"}
            ]
            response = llama_service.generate_response(messages)
            print(f"대화형 응답: {response}")
            
            return True
        else:
            print("모델이 로드되지 않았습니다.")
            return False
            
    except Exception as e:
        print(f"테스트 실패: {e}")
        import traceback
        print(f"상세 오류: {traceback.format_exc()}")
        return False

#%% MCP 연결 테스트
def test_mcp_connection():
    """MCP 연결 테스트"""
    try:
        print("=== MCP 연결 테스트 ===")
        
        # MCP 라이브러리 임포트 테스트
        from mcp import ClientSession, StdioServerParameters
        print("✅ MCP 라이브러리 임포트 성공")
        
        # Ollama 서버 연결 테스트
        import requests
        try:
            response = requests.get("http://127.0.0.1:11434/api/tags", timeout=5)
            if response.status_code == 200:
                print("✅ Ollama 서버 연결 성공")
                print(f"사용 가능한 모델: {response.json()}")
            else:
                print("❌ Ollama 서버 응답 오류")
        except Exception as e:
            print(f"❌ Ollama 서버 연결 실패: {e}")
            print("ollama serve 명령어로 서버를 시작하세요.")
        
        return True
        
    except ImportError:
        print("❌ MCP 라이브러리가 설치되지 않았습니다.")
        print("pip install mcp 설치 후 다시 시도하세요.")
        return False
    except Exception as e:
        print(f"❌ MCP 연결 테스트 실패: {e}")
        return False

#%% 메인 실행
if __name__ == "__main__":
    print("MCP 테스트 시작...")
    print("="*50)
    
    # MCP 연결 테스트
    if test_mcp_connection():
        print("\n" + "="*50)
        
        # MCP 서비스 테스트
        if test_mcp_service():
            print("\n✅ MCP 테스트 성공!")
        else:
            print("\n❌ MCP 서비스 테스트 실패!")
    else:
        print("\n❌ MCP 연결 테스트 실패!")
    
    print("\n" + "="*50)
    print("테스트 완료!") 
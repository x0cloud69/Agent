#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ollama 테스트 파일
"""

#%% 기본 Ollama 테스트
from langchain_community.llms import Ollama

def test_basic_ollama():
    """기본 Ollama 테스트"""
    try:
        print("=== 기본 Ollama 테스트 ===")
        llm = Ollama(model="qwen2.5:7b")
        result = llm.invoke("로컬 LLM의 장점은?")
        print("응답:", result)
        return True
    except Exception as e:
        print(f"오류: {e}")
        return False

#%% Llama2 테스트
def test_llama2():
    """Llama2 테스트"""
    try:
        print("=== Llama2 테스트 ===")
        llm = Ollama(model="llama2:7b")
        result = llm.invoke("로컬 LLM의 장점은?")
        print("응답:", result)
        return True
    except Exception as e:
        print(f"오류: {e}")
        return False

#%% 모델 목록 확인
def list_models():
    """사용 가능한 모델 목록 확인"""
    try:
        print("=== 사용 가능한 모델 목록 ===")
        import subprocess
        result = subprocess.run(['ollama', 'list'], capture_output=True, text=True)
        print(result.stdout)
    except Exception as e:
        print(f"오류: {e}")

#%% 메인 실행
if __name__ == "__main__":
    print("Ollama 테스트 시작...")
    
    # 모델 목록 확인
    list_models()
    print("\n" + "="*50 + "\n")
    
    # Qwen3 테스트
    if test_basic_ollama():
        print("✅ Qwen3 테스트 성공!")
    else:
        print("❌ Qwen3 테스트 실패!")
    
    print("\n" + "="*50 + "\n")
    
    # Llama2 테스트
    if test_llama2():
        print("✅ Llama2 테스트 성공!")
    else:
        print("❌ Llama2 테스트 실패!") 
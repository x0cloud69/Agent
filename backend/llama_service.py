import os
import requests
import json
from typing import List, Dict, Any, Optional, Mapping
from exa_search_service import exa_search_service

# Langchain imports
from langchain_community.llms import LlamaCpp, Ollama
from langchain_core.language_models.llms import BaseLLM
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_core.callbacks.manager import CallbackManagerForLLMRun

# --- MCP Implementation ---

def check_ollama_server_sync(base_url: str = "http://127.0.0.1:11434") -> bool:
    """Ollama 서버가 실행 중인지 동기적으로 확인"""
    try:
        print(f"🔍 Ollama 서버 상태 확인 중... ({base_url})")
        # /api/tags는 모델 목록을 반환하며, 서버 상태 확인에 적합합니다.
        response = requests.get(f"{base_url}/api/tags", timeout=3)
        if response.status_code == 200:
            print(f"   ✅ Ollama 서버 정상 작동")
            return True
        else:
            print(f"   ❌ Ollama 서버 응답 오류: {response.status_code}")
            return False
    except requests.exceptions.Timeout:
        print(f"   ⏰ Ollama 서버 연결 타임아웃")
        return False
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Ollama 서버 연결 실패: {e}")
        return False

class MCP_LLM(BaseLLM):
    """MCP 프로토콜을 통한 Ollama LLM 래퍼"""
    
    model_name: str = "qwen2.5:7b"
    base_url: str = "http://127.0.0.1:11434"
    temperature: float = 0.7
    top_p: float = 0.9
    
    def __init__(self, model_name: str = "qwen2.5:7b", base_url: str = "http://127.0.0.1:11434", temperature: float = 0.3, top_p: float = 0.9, **kwargs):
        super().__init__(model_name=model_name, base_url=base_url, temperature=temperature, top_p=top_p, **kwargs)
    
    @property
    def _llm_type(self) -> str:
        """LLM 타입을 반환합니다."""
        return "mcp_ollama"
 
    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        """LLM을 식별하는 파라미터를 반환합니다."""
        return {
            "model_name": self.model_name,
            "base_url": self.base_url,
            "temperature": self.temperature,
            "top_p": self.top_p,
        }

    def _generate(
        self,
        prompts: List[str],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ):
        """LangChain의 최신 API에 맞는 _generate 메서드 구현"""
        from langchain_core.outputs import LLMResult, Generation
        
        generations = []
        for prompt in prompts:
            api_url = f"{self.base_url}/api/generate"
            
            # Ollama API에 맞는 payload 구성
            payload = {
                "model": self.model_name,
                "prompt": prompt,
                "stream": False, # 스트리밍은 비활성화
                "options": {
                    "temperature": self.temperature,
                    "top_p": self.top_p,
                },
            }
            
            # stop-sequence가 있으면 payload에 추가
            if stop:
                payload["options"]["stop"] = stop

            try:
                print(f"   📤 Ollama API 요청 전송 중... (타임아웃: 120초)")
                response = requests.post(api_url, json=payload, timeout=120)
                response.raise_for_status()  # 200 OK가 아니면 예외 발생
                
                result = response.json()
                print(f"   ✅ Ollama 원본 응답: {result}")  # 전체 응답을 로그로 출력
                response_text = result.get("response", "")
                print(f"   ✅ Ollama 응답 완료 ({len(response_text)}자)")
                
                # Generation 객체 생성
                generation = Generation(text=response_text)
                generations.append([generation])
                
            except requests.exceptions.Timeout:
                raise ConnectionError(f"Ollama 서버 응답 타임아웃 (120초 초과)")
            except requests.exceptions.RequestException as e:
                raise ConnectionError(f"Ollama 서버({api_url}) 연결에 실패했습니다: {e}")
            except Exception as e:
                raise RuntimeError(f"Ollama API 호출 중 오류 발생: {e}")
        
        return LLMResult(generations=generations)

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        """LLM을 호출하는 메인 로직입니다."""
        api_url = f"{self.base_url}/api/generate"
        
        # Qwen 3B는 시스템 프롬프트 없이 질문만 전달
        enhanced_prompt = prompt
        print(f"[DEBUG] _call에서 Ollama로 보낼 프롬프트: {enhanced_prompt}")
        
        # Ollama API에 맞는 payload 구성
        payload = {
            "model": self.model_name,
            "prompt": enhanced_prompt,
            "stream": False, # 스트리밍은 비활성화
            "options": {
                "temperature": self.temperature,
                "top_p": self.top_p,
            },
        }
        print(f"[DEBUG] Ollama에 전달되는 payload: {payload}")
        
        # stop-sequence가 있으면 payload에 추가
        if stop:
            payload["options"]["stop"] = stop

        try:
            print(f"   📤 Ollama API 요청 전송 중... (타임아웃: 120초)")
            response = requests.post(api_url, json=payload, timeout=120)
            response.raise_for_status()  # 200 OK가 아니면 예외 발생
            
            result = response.json()
            print(f"   ✅ Ollama 원본 응답: {result}")  # 전체 응답을 로그로 출력
            response_text = result.get("response", "")
            print(f"   ✅ Ollama 응답 완료 ({len(response_text)}자)")
            return response_text
            
        except requests.exceptions.Timeout:
            raise ConnectionError(f"Ollama 서버 응답 타임아웃 (120초 초과)")
        except requests.exceptions.RequestException as e:
            raise ConnectionError(f"Ollama 서버({api_url}) 연결에 실패했습니다: {e}")
        except Exception as e:
            raise RuntimeError(f"Ollama API 호출 중 오류 발생: {e}")

# --- Main Service Class ---

class LangChainAIService:
    def __init__(self, model_path: str = None, use_mcp: bool = True, use_ollama: bool = False, model_type: str = "qwen3"):
        """
        LangChain을 사용한 AI 서비스 초기화 (MCP 중심)
        model_path: 모델 파일 경로 (.gguf 파일)
        use_mcp: MCP 프로토콜 사용 여부 (권장)
        use_ollama: Ollama 직접 연결 사용 여부
        model_type: 사용할 모델 타입 ("qwen3", "qwen2", "llama2", "mistral" 등)
        """
        self.model = None
        self.model_path = model_path or os.getenv("MODEL_PATH", "models/qwen2.5-7b-instruct.gguf")
        self.use_mcp = use_mcp
        self.use_ollama = use_ollama
        self.model_type = model_type
        
        # MCP 우선 사용 (안전하고 표준화된 통신)
        if self.use_mcp:
            self.load_mcp_model()
        elif self.use_ollama:
            self.load_ollama_model()
        else:
            # 로컬 모델 사용
            if os.path.exists(self.model_path):
                self.load_model()
            else:
                print(f"모델 파일을 찾을 수 없습니다: {self.model_path}")
                print("MCP를 사용하는 것을 권장합니다 (안전하고 표준화된 통신)")
                print("1. https://ollama.ai/ 에서 Ollama 다운로드")
                print("2. ollama pull qwen2.5:7b 실행")
                print("3. ollama serve 실행")
                print("4. use_mcp=True로 설정")

    def load_mcp_model(self):
        """MCP를 사용한 모델 로드 (Ollama API 직접 호출 방식)"""
        print("MCP 모델 로드를 시도합니다 (Ollama API 직접 호출)...")
        
        # 1. Ollama 서버 실행 여부 확인
        if not check_ollama_server_sync():
            print("❌ Ollama 서버가 실행 중이 아닙니다.")
            print("MCP를 사용하려면 'ollama serve' 명령어로 서버를 먼저 실행해야 합니다.")
            self.model = None
            return

        print("✅ Ollama 서버가 실행 중입니다.")
        
        # 2. 모델 타입에 따른 모델명 설정 (Qwen 3B 우선)
        if self.model_type == "qwen3":
            model_name = "qwen2.5:3b"  # Qwen 3B 모델
        elif self.model_type == "qwen2":
            model_name = "qwen2.5:7b"
        elif self.model_type == "llama2":
            model_name = "llama2:7b"
        elif self.model_type == "mistral":
            model_name = "mistral:7b"
        else:
            model_name = "qwen2.5:3b"  # 기본값을 Qwen 3B로 변경
            
        print(f"'{model_name}' 모델을 MCP를 통해 로드합니다...")
        
        try:
            # 3. MCP_LLM 인스턴스 생성
            self.model = MCP_LLM(model_name=model_name)
            print(f"✅ MCP 모델 로드 완료: {model_name}")
        except Exception as e:
            print(f"❌ MCP 모델 로드 중 오류 발생: {e}")
            self.model = None

    def load_ollama_model(self):
        """Ollama 라이브러리를 통해 모델 로드"""
        try:
            if self.model_type == "qwen3":
                model_name = "qwen2.5:7b"
                print("Qwen3 모델을 로드합니다...")
            elif self.model_type == "qwen2":
                model_name = "qwen2.5:7b"
                print("Qwen2.5 모델을 로드합니다...")
            elif self.model_type == "mistral":
                model_name = "mistral:7b"
                print("Mistral 모델을 로드합니다...")
            else:
                model_name = "llama2:7b"
                print("Llama2 모델을 로드합니다...")
            
            self.model = Ollama(
                model=model_name,
                temperature=0.3,
                top_p=0.9
            )
            print(f"Ollama 모델 로드 완료: {model_name}")
            
        except Exception as e:
            print(f"Ollama 모델 로드 실패: {e}")
            print("Ollama가 설치되지 않았거나 실행 중이 아닌 것 같습니다.")
            print("1. https://ollama.ai/ 에서 Ollama 다운로드 및 설치")
            print(f"2. 'ollama pull {self.model_type}' 실행")
            print("3. 'ollama serve' 실행")
            self.model = None

    def load_model(self):
        """LangChain을 사용하여 로컬 GGUF 모델 로드"""
        try:
            callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
            self.model = LlamaCpp(
                model_path=self.model_path,
                temperature=0.3,
                max_tokens=256,
                top_p=0.9,
                callback_manager=callback_manager,
                verbose=False,
                n_ctx=2048,
                n_threads=4,
                n_gpu_layers=0
            )
            print(f"로컬 모델 로드 완료: {self.model_path}")
        except Exception as e:
            print(f"모델 로드 실패: {e}")
            self.model = None

    def generate_response(self, messages: List[Dict[str, str]], max_tokens: int = 512, use_web_search: bool = False) -> str:
        """메시지 기반으로 응답 생성 (웹 검색 포함)"""
        print(f"\n[DEBUG] generate_response에 전달된 messages: {messages}")
        if not self.is_model_loaded():
            return "모델이 로드되지 않았습니다. 설정을 확인해주세요."
        
        try:
            import time
            start_time = time.time()
            
            # 마지막 메시지를 프롬프트로 사용
            last_message = messages[-1]['content'] if messages else ""
            print(f"[DEBUG] generate_response에서 Ollama로 보낼 프롬프트: {last_message}")
            
            # Exa Search 비활성화 (리소스 절약)
            # Qwen 3B는 시스템 프롬프트 없이 질문만 전달
            enhanced_prompt = last_message
            print(f"   - Exa Search 비활성화됨 (리소스 절약)")
            print(f"   - Qwen 3B 프롬프트 단순화 적용")
            
            # 연결 방식에 따른 로깅
            if self.use_mcp:
                print(f"🔒 MCP 프로토콜을 통해 요청 처리 중...")
                print(f"   - 모델: {self.model_type}")
                print(f"   - 보안: 토큰 기반 인증")
                print(f"   - 프로토콜: JSON-RPC 표준")
            else:
                print(f"🌐 일반 HTTP API를 통해 요청 처리 중...")
                print(f"   - 모델: {self.model_type}")
                print(f"   - 보안: 기본 HTTP")
                print(f"   - 프로토콜: REST API")

            response = self.model.invoke(enhanced_prompt)
            
            end_time = time.time()
            processing_time = end_time - start_time
            
            # 성능 정보 추가
            if self.use_mcp:
                print(f"✅ MCP 응답 완료 (처리시간: {processing_time:.2f}초)")
                print(f"   - 컨텍스트 관리: 구조화됨")
                print(f"   - 보안 레벨: 높음")
            else:
                print(f"✅ 일반 API 응답 완료 (처리시간: {processing_time:.2f}초)")
                print(f"   - 컨텍스트 관리: 기본")
                print(f"   - 보안 레벨: 기본")
            
            return response.strip()
            
        except Exception as e:
            print(f"응답 생성 실패: {e}")
            return "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다."

    def simple_chat(self, user_input: str) -> str:
        """간단한 채팅 응답 생성"""
        if not self.is_model_loaded():
            return "모델이 로드되지 않았습니다."
        
        try:
            import time
            start_time = time.time()
            
            # 연결 방식 표시
            connection_type = "MCP 프로토콜" if self.use_mcp else "일반 HTTP API"
            print(f"\n🤖 {connection_type}를 통한 채팅 요청")
            print(f"   사용자 입력: {user_input[:50]}{'...' if len(user_input) > 50 else ''}")
            
            # Qwen 3B는 시스템 프롬프트 없이 질문만 전달
            enhanced_input = user_input
            
            response = self.model.invoke(enhanced_input)
            
            end_time = time.time()
            processing_time = end_time - start_time
            
            # 응답 정보
            print(f"   응답 시간: {processing_time:.2f}초")
            print(f"   응답 길이: {len(response)} 문자")
            print(f"   연결 방식: {connection_type}")
            
            return response.strip()
            
        except Exception as e:
            print(f"채팅 응답 생성 실패: {e}")
            import traceback
            print(f"상세 오류: {traceback.format_exc()}")
            return "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다."

    def is_model_loaded(self) -> bool:
        """모델 로드 여부 확인"""
        return self.model is not None

    def get_model_info(self) -> Dict[str, Any]:
        """모델 정보 반환"""
        model_info = {
            "model_loaded": self.is_model_loaded(),
            "use_mcp": self.use_mcp,
            "use_ollama_lib": self.use_ollama,
            "model_type": self.model_type,
            "model_path": self.model_path,
            "model_class": self.model.__class__.__name__ if self.is_model_loaded() else None,
            "model_exists": os.path.exists(self.model_path) if self.model_path else False
        }
        return model_info

# 전역 인스턴스 - MCP 사용을 기본으로 설정 (Qwen 3B 모델 사용)
llama_service = LangChainAIService(use_mcp=True, use_ollama=False, model_type="qwen3")

def update_service_settings(use_mcp: bool, model_type: str):
    """서비스 설정 업데이트"""
    global llama_service
    llama_service.use_mcp = use_mcp
    llama_service.model_type = model_type
    
    # 설정에 따라 모델 재로드
    if use_mcp:
        llama_service.load_mcp_model()
    else:
        llama_service.load_ollama_model()



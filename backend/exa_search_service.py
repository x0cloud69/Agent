import os
import requests
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio
import aiohttp

class ExaSearchMCP:
    """Exa Search를 MCP로 통합하는 서비스"""
    
    def __init__(self):
        self.base_url = "https://api.exa.ai"
        self._update_config()
    
    def _update_config(self):
        """환경 변수에서 설정 업데이트"""
        self.api_key = os.getenv("EXA_API_KEY")
        self.enabled = os.getenv("EXA_SEARCH_ENABLED", "false").lower() == "true"
        
        # 강제로 비활성화 (리소스 절약)
        self.enabled = False
        print("🔒 Exa Search가 강제 비활성화되었습니다. (리소스 절약)")
    
    def update_api_key(self, api_key: str, enabled: bool = True):
        """API 키 업데이트"""
        os.environ["EXA_API_KEY"] = api_key
        os.environ["EXA_SEARCH_ENABLED"] = str(enabled).lower()
        self._update_config()
    
    def is_enabled(self) -> bool:
        """Exa Search가 활성화되어 있는지 확인"""
        return self.enabled and self.api_key is not None
    
    def search(self, query: str, num_results: int = 5) -> List[Dict[str, Any]]:
        """Exa Search를 통해 웹 검색 수행"""
        if not self.is_enabled():
            return []
        
        try:
            print(f"🔍 Exa Search 시작: '{query}' (결과 수: {num_results})")
            start_time = datetime.now()
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # 검색 파라미터 최적화
            payload = {
                "query": query,
                "numResults": min(num_results, 10),  # 최대 10개로 제한
                "includeDomains": [],
                "excludeDomains": [],
                "startCrawlDate": None,
                "endCrawlDate": None,
                "startPublishedDate": None,
                "endPublishedDate": None,
                "useAutoprompt": True,
                "type": "keyword",
                "category": "general",  # 일반 카테고리
                "safesearch": "moderate",  # 안전 검색
                "freshness": "month"  # 최신 정보 우선
            }
            
            print(f"   📡 API 요청 전송 중...")
            response = requests.post(
                f"{self.base_url}/search",
                headers=headers,
                json=payload,
                timeout=15  # 타임아웃 단축
            )
            
            end_time = datetime.now()
            search_time = (end_time - start_time).total_seconds()
            
            if response.status_code == 200:
                data = response.json()
                results = self._process_search_results(data)
                print(f"   ✅ 검색 완료 ({search_time:.2f}초) - {len(results)}개 결과")
                return results
            else:
                print(f"   ❌ Exa Search API 오류: {response.status_code}")
                print(f"   📄 응답 내용: {response.text[:200]}...")
                return []
                
        except requests.exceptions.Timeout:
            print(f"   ⏰ Exa Search 타임아웃 (15초 초과)")
            return []
        except Exception as e:
            print(f"   ❌ Exa Search 중 오류 발생: {e}")
            return []
    
    def _process_search_results(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """검색 결과를 처리하고 정리"""
        results = []
        
        if "results" not in data:
            return results
        
        for result in data["results"]:
            processed_result = {
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "text": result.get("text", ""),
                "published_date": result.get("publishedDate"),
                "domain": result.get("domain", ""),
                "score": result.get("score", 0)
            }
            results.append(processed_result)
        
        return results
    
    def get_content(self, url: str) -> Optional[str]:
        """특정 URL의 콘텐츠를 가져오기"""
        if not self.is_enabled():
            return None
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "url": url,
                "includeImages": False
            }
            
            response = requests.post(
                f"{self.base_url}/contents",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get("text", "")
            else:
                print(f"❌ Exa Content API 오류: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Exa Content 가져오기 중 오류: {e}")
            return None
    
    def create_search_context(self, query: str, max_results: int = 2) -> str:
        """검색 결과를 컨텍스트로 변환"""
        if not self.is_enabled():
            return ""
        
        print(f"🌐 Exa Search 컨텍스트 생성: '{query}'")
        results = self.search(query, max_results)
        
        if not results:
            print(f"   ⚠️ 검색 결과가 없습니다.")
            return ""
        
        print(f"   📊 {len(results)}개 결과를 컨텍스트로 변환 중...")
        
        context = f"최신 웹 검색 결과 ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')}):\n\n"
        
        for i, result in enumerate(results, 1):
            context += f"[{i}] {result['title']}\n"
            context += f"URL: {result['url']}\n"
            context += f"도메인: {result['domain']}\n"
            if result.get('published_date'):
                context += f"발행일: {result['published_date']}\n"
            if result.get('score'):
                context += f"관련도: {result['score']:.2f}\n"
            
            # 텍스트 내용 최적화 (더 짧게)
            text_content = result['text'][:200]  # 200자로 단축
            if len(result['text']) > 200:
                text_content += "..."
            context += f"내용: {text_content}\n\n"
        
        context += "위의 최신 웹 검색 결과를 바탕으로 정확하고 구체적으로 답변해주세요."
        print(f"   ✅ 컨텍스트 생성 완료 ({len(context)}자)")
        return context

# 전역 인스턴스
exa_search_service = ExaSearchMCP() 
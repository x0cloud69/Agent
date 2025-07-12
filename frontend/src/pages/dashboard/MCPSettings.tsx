import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Server, 
  Database, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Save,
  TestTube,
  Network,
  Lock,
  Search
} from 'lucide-react';

interface MCPSettings {
  use_mcp: boolean;
  mcp_server_host: string;
  mcp_server_port: number;
  mcp_model_name: string;
  model_type: string;
  use_ollama: boolean;
  use_huggingface: boolean;
  exa_api_key: string;
  exa_search_enabled: boolean;
}

const MCPSettings: React.FC = () => {
  const [settings, setSettings] = useState<MCPSettings>({
    use_mcp: true,
    mcp_server_host: '127.0.0.1',
    mcp_server_port: 11434,
    mcp_model_name: 'qwen2.5:3b',
    model_type: 'qwen3',
    use_ollama: true,
    use_huggingface: false,
    exa_api_key: '',
    exa_search_enabled: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [exaStatus, setExaStatus] = useState<any>(null);

  // 설정 로드
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // MCP 설정 로드
      const mcpResponse = await fetch('http://localhost:8000/chatbot/settings/mcp');
      if (mcpResponse.ok) {
        const mcpData = await mcpResponse.json();
        setSettings(mcpData);
      }

      // 모델 상태 확인
      const statusResponse = await fetch('http://localhost:8000/chatbot/status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setIsConnected(statusData.model_loaded);
      }

      // Exa Search 상태 확인
      const exaResponse = await fetch('http://localhost:8000/chatbot/exa-status');
      if (exaResponse.ok) {
        const exaData = await exaResponse.json();
        setExaStatus(exaData);
      }
    } catch (error) {
      console.error('설정 로드 실패:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/chatbot/settings/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setTestResult('설정이 저장되었습니다.');
      } else {
        const errorData = await response.json();
        setTestResult('설정 저장에 실패했습니다: ' + (errorData.detail || '알 수 없는 오류'));
      }
    } catch (error) {
      setTestResult('설정 저장 중 오류가 발생했습니다: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const testMCPConnection = async () => {
    setIsLoading(true);
    setTestResult('MCP 연결을 테스트하는 중...');
    
    try {
      const response = await fetch('http://localhost:8000/chatbot/test');
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setTestResult('✅ MCP 연결 성공! 모델이 정상적으로 응답합니다.');
          setIsConnected(true);
        } else {
          setTestResult('❌ MCP 연결 실패: ' + data.error);
          setIsConnected(false);
        }
      } else {
        setTestResult('❌ MCP 연결 테스트 실패');
        setIsConnected(false);
      }
    } catch (error) {
      setTestResult('❌ MCP 연결 테스트 중 오류 발생');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const testExaSearch = async () => {
    setIsLoading(true);
    setTestResult('Exa Search를 테스트하는 중...');
    
    try {
      const response = await fetch('http://localhost:8000/chatbot/exa-test', {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setTestResult(`${data.message}\n\n샘플 결과:\n제목: ${data.sample_result.title}\n도메인: ${data.sample_result.domain}\n미리보기: ${data.sample_result.text_preview}`);
        } else {
          setTestResult('❌ Exa Search 실패: ' + (data.message || data.error));
        }
      } else {
        setTestResult('❌ Exa Search 테스트 실패');
      }
    } catch (error) {
      setTestResult('❌ Exa Search 테스트 중 오류 발생: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                MCP 설정
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                isConnected 
                  ? 'text-green-800 bg-green-100' 
                  : 'text-red-800 bg-red-100'
              }`}>
                {isConnected ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isConnected ? '연결됨' : '연결 안됨'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* MCP 개요 */}
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Network className="mr-2 w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">MCP (Model Context Protocol)</h2>
            </div>
            <p className="mb-4 text-gray-600">
              MCP는 AI 모델과의 안전하고 표준화된 통신을 위한 프로토콜입니다. 
              더 안전하고 효율적인 모델 통신을 제공합니다.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Shield className="mr-2 w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">보안성</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Zap className="mr-2 w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">효율성</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Database className="mr-2 w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">확장성</span>
              </div>
            </div>
          </div>

          {/* MCP 설정 */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">MCP 설정</h3>
            
            <div className="space-y-4">
              {/* MCP 사용 여부 */}
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-700">MCP 사용</label>
                  <p className="text-sm text-gray-500">MCP 프로토콜을 통한 모델 통신</p>
                </div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.use_mcp}
                    onChange={(e) => setSettings(prev => ({ ...prev, use_mcp: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* MCP 서버 설정 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    MCP 서버 호스트
                  </label>
                  <input
                    type="text"
                    value={settings.mcp_server_host}
                    onChange={(e) => setSettings(prev => ({ ...prev, mcp_server_host: e.target.value }))}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="127.0.0.1"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    MCP 서버 포트
                  </label>
                  <input
                    type="number"
                    value={settings.mcp_server_port}
                    onChange={(e) => setSettings(prev => ({ ...prev, mcp_server_port: parseInt(e.target.value) }))}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="11434"
                  />
                </div>
              </div>

              {/* 모델 설정 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    모델 타입
                  </label>
                  <select
                    value={settings.model_type}
                    onChange={(e) => setSettings(prev => ({ ...prev, model_type: e.target.value }))}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="qwen3">Qwen3</option>
                    <option value="qwen2">Qwen2</option>
                    <option value="llama2">Llama2</option>
                    <option value="mistral">Mistral</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    MCP 모델명
                  </label>
                  <input
                    type="text"
                    value={settings.mcp_model_name}
                    onChange={(e) => setSettings(prev => ({ ...prev, mcp_model_name: e.target.value }))}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="qwen2.5:7b"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Exa Search 설정 */}
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Search className="mr-2 w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Exa Search 설정</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-700">Exa Search 활성화</label>
                  <p className="text-sm text-gray-500">실시간 웹 검색을 통한 최신 정보 제공</p>
                </div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.exa_search_enabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, exa_search_enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Exa API 키
                </label>
                <input
                  type="password"
                  value={settings.exa_api_key}
                  onChange={(e) => setSettings(prev => ({ ...prev, exa_api_key: e.target.value }))}
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="exa_..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  <a href="https://exa.ai" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                    Exa.ai에서 API 키 발급
                  </a>
                </p>
              </div>

              {/* Exa Search 상태 표시 */}
              {exaStatus && (
                <div className={`p-3 rounded-lg ${
                  exaStatus.enabled 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {exaStatus.enabled ? (
                      <CheckCircle className="mr-2 w-4 h-4" />
                    ) : (
                      <AlertCircle className="mr-2 w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {exaStatus.enabled ? 'Exa Search 활성화됨' : 'Exa Search 비활성화됨'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs">
                    {exaStatus.enabled 
                      ? '실시간 웹 검색이 가능합니다.' 
                      : 'API 키를 설정하고 활성화해주세요.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 대안 설정 */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">대안 설정</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-700">Ollama 직접 연결</label>
                  <p className="text-sm text-gray-500">MCP 실패 시 Ollama 직접 연결 사용</p>
                </div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.use_ollama}
                    onChange={(e) => setSettings(prev => ({ ...prev, use_ollama: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-700">Hugging Face API</label>
                  <p className="text-sm text-gray-500">Hugging Face Inference API 사용</p>
                </div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.use_huggingface}
                    onChange={(e) => setSettings(prev => ({ ...prev, use_huggingface: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 테스트 결과 */}
          {testResult && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">테스트 결과</h3>
              <div className={`p-4 rounded-lg ${
                testResult.includes('성공') 
                  ? 'bg-green-50 text-green-800' 
                  : testResult.includes('실패') 
                    ? 'bg-red-50 text-red-800'
                    : 'bg-blue-50 text-blue-800'
              }`}>
                <p className="text-sm">{testResult}</p>
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={testExaSearch}
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                <Search className="mr-2 w-4 h-4" />
              )}
              Exa Search 테스트
            </button>
            <button
              onClick={testMCPConnection}
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                <TestTube className="mr-2 w-4 h-4" />
              )}
              MCP 연결 테스트
            </button>
            <button
              onClick={saveSettings}
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <Save className="mr-2 w-4 h-4" />
              설정 저장
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MCPSettings; 
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send,
  Paperclip,
  Image,
  Mic,
  MoreVertical,
  ChevronLeft,
  Clock,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Maximize2,
  MinusCircle,
  Bot,
  User,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  attachments?: string[];
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: '안녕하세요! AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sending'
    };

    // 사용자 메시지 추가
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // 토큰 가져오기
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      // 대화 히스토리 준비 (최근 10개 메시지, 반드시 userMessage 포함)
      const recentMessages = [...messages, userMessage].slice(-10);
      const apiMessages = recentMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // API 호출
      const response = await fetch('http://localhost:8000/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: apiMessages,
          max_tokens: 512
        })
      });

      if (!response.ok) {
        throw new Error('API 호출 실패');
      }

      const data = await response.json();

      // AI 응답 메시지 추가
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: data.response,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('메시지 전송 실패:', error);
      
      // 에러 메시지 추가
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        status: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">채팅 목록</h2>
        </div>
        
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="대화 검색"
              className="py-2 pr-4 pl-10 w-full bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto flex-1">
          <div className="p-2 space-y-2">
            {['Regulatory Compliance', 'Workforce Management', 'Culture Analytics'].map((agent) => (
              <div
                key={agent}
                className="flex items-center p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{agent}</h3>
                  <p className="text-xs text-gray-500 truncate">최근 대화: 1시간 전</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Chat Header */}
        <div className="flex justify-between items-center px-6 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-800">Regulatory Compliance</h2>
              <p className="text-sm text-gray-500">근로기준법 전문 상담</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Search className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <RefreshCw className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start max-w-2xl`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-100 ml-3' : 'bg-gray-100 mr-3'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                
                <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                    {message.type === 'agent' && (
                      <div className="flex items-center space-x-2">
                        <button className="p-1 rounded hover:bg-gray-100">
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <ThumbsUp className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <ThumbsDown className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* 스크롤 참조 */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-end space-x-4">
              <div className="flex-1 bg-white rounded-lg border border-gray-200">
                <div className="px-4 pt-3 pb-3">
                  <textarea
                    rows={1}
                    className="w-full text-sm resize-none focus:outline-none"
                    placeholder="메시지를 입력하세요..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                
                <div className="flex justify-between items-center px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <Paperclip className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <Image className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <Mic className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <button 
                    className={`flex items-center px-4 py-2 text-white rounded-lg ${
                      isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    onClick={sendMessage}
                    disabled={isLoading}
                  >
                    <span className="mr-2">{isLoading ? '전송 중...' : '전송'}</span>
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Context Panel */}
      <div className="flex flex-col w-80 bg-white border-l border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">상세 정보</h2>
        </div>
        
        <div className="p-4 space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Agent 정보</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                근로기준법 및 사내규정에 대한 전문 상담을 제공하는 AI Agent입니다.
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">관련 문서</h3>
            <div className="space-y-2">
              <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex justify-center items-center w-8 h-8 bg-blue-100 rounded">
                  <Download className="w-4 h-4 text-blue-600" />
                </div>
                <span className="ml-3 text-sm text-gray-600">근로기준법.pdf</span>
              </div>
              <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex justify-center items-center w-8 h-8 bg-blue-100 rounded">
                  <Download className="w-4 h-4 text-blue-600" />
                </div>
                <span className="ml-3 text-sm text-gray-600">사내규정.pdf</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">최근 업데이트</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="mr-2 w-4 h-4" />
                <span>최근 업데이트: 2시간 전</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <RefreshCw className="mr-2 w-4 h-4" />
                <span>버전: v2.1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
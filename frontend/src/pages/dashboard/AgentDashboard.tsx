import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Heart,
  Calendar,
  CheckSquare,
  GraduationCap,
  Search,
  Bell,
  Settings,
  Grid,
  List,
  TrendingUp,
  AlertCircle,
  Clock,
  BarChart2,
  Bot,
  Code,
  Paintbrush,
  FileText,
  Database,
  ChevronDown,
  X,
  Menu,
  Network
} from 'lucide-react';

const MainDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const agents = [
    {
      name: 'Regulatory Compliance Monitoring',
      icon: <Shield className="w-6 h-6" />,
      color: 'blue',
      metrics: [
        { label: '문의 건수', value: '356건', trend: '+22' },
        { label: '요청 건수', value: '156건', trend: '+12' },
        { label: '처리해야할건수', value: '3건', trend: '-1' },
        { label: '자동처리건수', value: '156건', trend: '+12' },
        { label: '처리완료건수', value: '146건', trend: '+21' },
      ],
      status: '정상',
      usage: 87
    },
    {
      name: 'Workforce Management',
      icon: <Users className="w-6 h-6" />,
      color: 'purple',
      metrics: [
        { label: '실시간 출근율', value: '98%', trend: '+1%' },
        { label: '결재 처리율', value: '92%', trend: '+5%' },
        { label: '초과근무', value: '12명', trend: '-3' },
      ],
      status: '정상',
      usage: 92
    },
    {
      name: 'Culture Analytics',
      icon: <Heart className="w-6 h-6" />,
      color: 'rose',
      metrics: [
        { label: '조직 건강도', value: '85%', trend: '+3%' },
        { label: '피드백 수', value: '234건', trend: '+18' },
        { label: '참여율', value: '78%', trend: '+5%' },
      ],
      status: '주의',
      usage: 76
    },
    {
      name: 'Smart Schedule Assistant',
      icon: <Calendar className="w-6 h-6" />,
      color: 'green',
      metrics: [
        { label: '일정 최적화율', value: '96%', trend: '+4%' },
        { label: '회의 수', value: '28건', trend: '-2' },
        { label: '충돌 예방', value: '8건', trend: '-1' },
      ],
      status: '정상',
      usage: 94
    },
    {
      name: 'Smart Task Navigator',
      icon: <CheckSquare className="w-6 h-6" />,
      color: 'amber',
      metrics: [
        { label: '태스크 완료율', value: '88%', trend: '+6%' },
        { label: '긴급 태스크', value: '5건', trend: '-2' },
        { label: '진행률', value: '92%', trend: '+3%' },
      ],
      status: '정상',
      usage: 85
    },
    {
      name: 'Public Support & Training',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'indigo',
      metrics: [
        { label: '교육 참여율', value: '82%', trend: '+8%' },
        { label: '응답률', value: '95%', trend: '+2%' },
        { label: '만족도', value: '4.8/5', trend: '+0.2' },
      ],
      status: '정상',
      usage: 89
    }
  ];

  const handleRunAgent = () => {
    navigate('/chatbot');
  };

  const handleMCPSettings = () => {
    navigate('/mcp-settings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BarChart2 className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                AI Agent Hub
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  className="py-2 pr-4 pl-10 w-64 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Agent 검색..."
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <button 
                onClick={handleMCPSettings}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Network className="w-4 h-4 mr-2" />
                MCP 설정
              </button>

              <button className="relative p-2 text-gray-500 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Overview Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Agent 현황</h1>
              <p className="mt-1 text-gray-500">전체 Agent의 실시간 상태와 성능을 확인하세요</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Agents Grid */}
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'grid-cols-1 gap-4'
          }`}>
            {agents.map((agent) => (
              <div
                key={agent.name}
                className={`bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200
                  ${viewMode === 'list' ? 'flex items-center' : ''}
                `}
              >
                {viewMode === 'list' ? (
                  <div className="flex items-center p-4 w-full">
                    <div className={`h-12 w-12 rounded-lg bg-${agent.color}-50 flex items-center justify-center`}>
                      {agent.icon}
                    </div>
                    <div className="flex-1 ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{agent.name}</h3>
                      <div className="flex items-center mt-1 space-x-4">
                        {agent.metrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center">
                            <span className="text-sm text-gray-500">{metric.label}</span>
                            <span className="ml-1 text-sm font-medium">{metric.value}</span>
                            <span className={`ml-1 text-xs ${
                              metric.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {metric.trend}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${
                          agent.status === '정상' ? 'bg-green-500' : 'bg-yellow-500'
                        } mr-2`}></div>
                        <span className="text-sm text-gray-600">{agent.status}</span>
                      </div>
                      <button 
                        onClick={handleRunAgent}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                      >
                        실행
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className={`h-12 w-12 rounded-lg bg-${agent.color}-50 flex items-center justify-center`}>
                        {agent.icon}
                      </div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${
                          agent.status === '정상' ? 'bg-green-500' : 'bg-yellow-500'
                        } mr-2`}></div>
                        <span className="text-sm text-gray-600">{agent.status}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                    <div className="mt-4 space-y-3">
                      {agent.metrics.map((metric, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{metric.label}</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{metric.value}</span>
                            <span className={`ml-2 text-xs ${
                              metric.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {metric.trend}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-gray-500">사용률</span>
                        <span className="font-medium">{agent.usage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className={`h-2 rounded-full bg-${agent.color}-500`}
                          style={{width: `${agent.usage}%`}}
                        ></div>
                      </div>
                    </div>
                    <button 
                      onClick={handleRunAgent}
                      className="px-4 py-2 mt-4 w-full text-sm font-medium text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                    >
                      실행하기
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CreateWorkspaceModal, ShareModal } from '@/components/ui/Modal';
import { LockedPreview, PremiumBadge, UpgradeCard } from '@/components/ui/PremiumExperience';
import { useToast } from '@/context/ToastContext';
import { Folder, Plus, BarChart2, MoreVertical, LayoutDashboard, Share2, Download, FileText, Database, Lock, Users } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

interface WorkspaceCardItem {
  id: string;
  name: string;
  edited: string;
  chartsCount: number;
  datasetsCount: number;
  folder: string;
}

export function Workspace() {
  const [activeFolder, setActiveFolder] = useState<string>('All Projects');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedShareTitle, setSelectedShareTitle] = useState('Workspace');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [workspaces, setWorkspaces] = useState<WorkspaceCardItem[]>([
    { id: '1', name: 'Q3 Market Analysis', edited: 'Last edited 2 hrs ago', chartsCount: 4, datasetsCount: 12, folder: 'Q3 Market Analysis' },
    { id: '2', name: 'Healthcare Trends', edited: 'Last edited yesterday', chartsCount: 2, datasetsCount: 8, folder: 'Healthcare Trends' },
    { id: '3', name: 'Competitor Benchmarks', edited: 'Last edited 3 days ago', chartsCount: 5, datasetsCount: 15, folder: 'Competitor Benchmarks' },
  ]);

  const handleCreateWorkspace = (name: string, description: string) => {
    const newWs: WorkspaceCardItem = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      edited: 'Just now',
      chartsCount: 0,
      datasetsCount: 0,
      folder: name
    };
    setWorkspaces([newWs, ...workspaces]);
  };

  const filteredWorkspaces = activeFolder === 'All Projects'
    ? workspaces
    : workspaces.filter((w) => w.folder === activeFolder || w.name === activeFolder);

  const handleShareClick = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setSelectedShareTitle(title);
    setIsShareModalOpen(true);
  };

  const handleDownloadClick = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    showToast(`Downloading workspace bundle: "${title}"`, 'success');
  };

  const chartOption1 = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
    yAxis: { type: 'value', show: false },
    series: [
      { type: 'bar', data: [12, 19, 15, 22], itemStyle: { color: '#0EA5E9' } }
    ]
  };

  const chartOption2 = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['50%', '80%'],
        data: [
          { value: 1048, name: 'Tech', itemStyle: { color: '#1E3A8A' } },
          { value: 735, name: 'Health', itemStyle: { color: '#0EA5E9' } },
          { value: 580, name: 'Fin', itemStyle: { color: '#10B981' } },
        ]
      }
    ]
  };

  return (
    <Layout>
      <div className="border-b border-border bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-text-main mb-2">My Workspaces</h1>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-text-muted">Organize your saved datasets, AI insights, and custom dashboards.</p>
              <PremiumBadge>Workspace Preview</PremiumBadge>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-medium shadow"
          >
            <Plus className="w-4 h-4 mr-2" /> New Workspace
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-text-muted mb-3">Folders</h3>
              <div className="space-y-1">
                {['All Projects', 'Q3 Market Analysis', 'Healthcare Trends', 'Competitor Benchmarks'].map((folder) => (
                  <Button
                    key={folder}
                    variant="ghost"
                    onClick={() => { setActiveFolder(folder); showToast(`Filter: ${folder}`, 'info'); }}
                    className={`w-full justify-start text-sm ${
                      activeFolder === folder
                        ? 'text-primary bg-primary/10 font-bold'
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    <Folder className="mr-2 h-4 w-4" /> {folder}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-text-muted mb-3">Shared With Me</h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  onClick={() => showToast('Opening shared board: APAC Expansion', 'info')}
                  className="w-full justify-start text-text-muted hover:text-text-main"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" /> APAC Expansion
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => showToast('Opening shared report: 2024 Tech Forecast', 'info')}
                  className="w-full justify-start text-text-muted hover:text-text-main"
                >
                  <FileText className="mr-2 h-4 w-4" /> 2024 Tech Forecast
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                ['Companies', '3 saved', 'Unlimited with Premium'],
                ['Reports', '3 saved', 'Scheduled reports with Premium'],
                ['Bookmarks', '5 saved', 'AI collections with Premium']
              ].map(([label, value, premium]) => (
                <Card key={label} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-[10px] uppercase tracking-wider font-mono text-text-muted">{label}</div>
                    <div className="mt-1 text-lg font-bold font-mono text-text-main">{value}</div>
                    <div className="mt-1 text-xs text-primary font-medium">{premium}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {filteredWorkspaces.map((ws, idx) => (
                <Card
                  key={ws.id}
                  onClick={() => navigate('/dashboard')}
                  className="hover:border-primary/50 transition-colors cursor-pointer group shadow-sm bg-surface flex flex-col justify-between"
                >
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{ws.name}</CardTitle>
                      <p className="text-xs text-text-muted mt-1 font-mono">{ws.edited}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleShareClick(e, ws.name)}
                      className="h-8 w-8 p-0 -mr-2 text-text-muted hover:text-primary"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 mb-4 bg-background rounded-md border border-border p-2">
                      <ReactECharts option={idx % 2 === 0 ? chartOption1 : chartOption2} style={{ height: '100%', width: '100%' }} />
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-[10px] bg-background"><BarChart2 className="w-3 h-3 mr-1" /> {ws.chartsCount} Charts</Badge>
                      <Badge variant="outline" className="text-[10px] bg-background"><Database className="w-3 h-3 mr-1" /> {ws.datasetsCount} Datasets</Badge>
                      <Badge variant="outline" className="text-[10px] bg-background"><Lock className="w-3 h-3 mr-1" /> Exports</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Create New Card */}
              <Card
                onClick={() => setIsCreateModalOpen(true)}
                className="hover:border-primary/50 transition-colors cursor-pointer group shadow-none border-dashed bg-background/50 flex flex-col items-center justify-center min-h-[220px]"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-text-main group-hover:text-primary">Create Workspace</h4>
                <p className="text-xs text-text-muted mt-1 text-center px-4">Start a new collection of data stories</p>
              </Card>

            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <LockedPreview
                className="min-h-[240px]"
                title="Unlock Workspace Collaboration"
                value="Invite teams, add research notes, schedule reports, share dashboards, and build AI-powered collections."
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="h-3 w-32 rounded bg-text-muted/30" />
                      <div className="mt-2 h-2 w-44 rounded bg-text-muted/20" />
                    </div>
                  </div>
                  <div className="h-28 rounded-lg border border-border bg-background" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 rounded bg-primary/20" />
                    <div className="h-10 rounded bg-accent/20" />
                    <div className="h-10 rounded bg-success/20" />
                  </div>
                </div>
              </LockedPreview>

              <UpgradeCard
                title="Enterprise Features"
                description="Guest workspaces are useful for light research. Premium turns them into repeatable institutional workflows."
                features={[
                  'Unlimited companies, reports, bookmarks, dashboards, and notes',
                  'AI collections, scheduled reports, and collaboration',
                  'Bulk downloads, PDF exports, and API-connected workspaces'
                ]}
              />
            </div>

            {/* Recent Items List */}
            <div>
              <h3 className="text-lg font-bold font-heading mb-4 border-b border-border pb-2">Recent Items</h3>
              <div className="space-y-3">
                {[
                  { name: 'Global Artificial Intelligence (AI) Market Size by Region', type: 'Dataset', time: '10 mins ago', icon: Database, route: '/dataset' },
                  { name: 'Comparison: India and China Population Growth', type: 'AI Synthesis', time: '2 hours ago', icon: BarChart2, route: '/search' },
                  { name: 'Apple Inc. Financial Dossier 2024', type: 'Report', time: 'Yesterday', icon: FileText, route: '/company' }
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(item.route)}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface hover:bg-background transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background rounded border border-border">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] uppercase font-mono py-0">{item.type}</Badge>
                          <span className="text-xs text-text-muted font-mono">• {item.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={(e) => handleShareClick(e, item.name)} className="h-8 w-8 p-0"><Share2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={(e) => handleDownloadClick(e, item.name)} className="h-8 w-8 p-0"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`Share ${selectedShareTitle}`}
      />
    </Layout>
  );
}


import React from 'react';
import { Activity } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Clock, CheckCircle, Zap } from 'lucide-react';

interface ActivityTrackerProps {
  activities: Activity[];
}

const ActivityTracker: React.FC<ActivityTrackerProps> = ({ activities }) => {
  const chartData = [
    { name: 'Chat', value: activities.filter(a => a.type === 'chat').length },
    { name: 'Research', value: activities.filter(a => a.type === 'research').length },
    { name: 'Voice', value: activities.filter(a => a.type === 'voice').length },
    { name: 'Video', value: activities.filter(a => a.type === 'video').length },
    { name: 'Task', value: activities.filter(a => a.type === 'task').length },
  ];

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Memory & Activities</h2>
          <p className="text-gray-400">Long-term context and behavioral analytics tracking.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-[#1a1a1a] p-8 rounded-3xl border border-white/10 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Activity Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#222'}} 
                    contentStyle={{backgroundColor: '#000', borderColor: '#333', borderRadius: '12px', color: '#fff'}}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-center text-center">
            <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">{activities.length}</h3>
            <p className="text-gray-400">Total Interactions Captured</p>
            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-indigo-400">Today</p>
                <p className="text-sm text-gray-500">Captured Context</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">Proactive</p>
                <p className="text-sm text-gray-500">Learning Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 bg-white/5">
            <h3 className="font-semibold text-white">Interaction Log</h3>
          </div>
          <div className="divide-y divide-white/10">
            {activities.length > 0 ? activities.slice().reverse().map((activity) => (
              <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-white/5 transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'chat' ? 'bg-indigo-500/10 text-indigo-400' :
                  activity.type === 'research' ? 'bg-green-500/10 text-green-400' :
                  'bg-white/10 text-gray-400'
                }`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 font-medium mb-1">{activity.description}</p>
                  <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
                <div className="px-3 py-1 bg-black rounded-full text-xs font-mono text-gray-500 uppercase tracking-widest">
                  {activity.type}
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-gray-500">
                No activities recorded yet. Start interacting with Aura!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;

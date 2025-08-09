import { Clock, Shield, Vote, DollarSign, AlertTriangle } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';

interface ActivityItem {
  id: string;
  type: 'policy' | 'claim' | 'vote' | 'payment' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'claim',
    title: 'Claim Submitted',
    description: 'Crop damage claim for 2,000 XLM submitted',
    timestamp: '2024-12-20T10:30:00Z',
    status: 'Under Review',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Premium Payment',
    description: 'Weekly premium of 50 XLM paid successfully',
    timestamp: '2024-12-19T14:15:00Z',
    status: 'Completed',
  },
  {
    id: '3',
    type: 'vote',
    title: 'DAO Proposal Vote',
    description: 'Voted on "New Emergency Medical Coverage Plan"',
    timestamp: '2024-12-18T16:45:00Z',
    status: 'Active',
  },
  {
    id: '4',
    type: 'policy',
    title: 'Policy Subscription',
    description: 'Subscribed to Crop Loss Protection plan',
    timestamp: '2024-12-15T09:20:00Z',
    status: 'Active',
  },
];

const activityIcons = {
  policy: Shield,
  claim: AlertTriangle,
  vote: Vote,
  payment: DollarSign,
  alert: AlertTriangle,
};

const activityColors = {
  policy: 'text-primary-600 bg-primary-100',
  claim: 'text-warning-600 bg-warning-100',
  vote: 'text-purple-600 bg-purple-100',
  payment: 'text-success-600 bg-success-100',
  alert: 'text-danger-600 bg-danger-100',
};

export function RecentActivity() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="card-body p-0">
        <div className="divide-y divide-gray-200">
          {mockActivities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];
            
            return (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatRelativeTime(activity.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    
                    {activity.status && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {activity.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="card-footer">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
}
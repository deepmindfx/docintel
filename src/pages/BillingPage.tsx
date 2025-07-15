import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { useData } from '../contexts/DataProvider';
import { 
  CreditCard, 
  Download, 
  Check, 
  Crown,
  Zap,
  TrendingUp,
  FileText,
  MessageCircle,
  HardDrive,
  Users
} from 'lucide-react';
import { formatFileSize } from '../lib/utils';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  limits: {
    uploads: number;
    chats: number;
    storage: number;
    users: number;
  };
  popular?: boolean;
}

export const BillingPage: React.FC = () => {
  const { usage, organization } = useData();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'monthly',
      features: [
        '100 uploads per month',
        '50 AI chats',
        '10K tokens per month',
        '100 API requests',
        '5GB storage',
        'Basic AI engines',
        'Email support'
      ],
      limits: {
        uploads: 100,
        chats: 50,
        tokens: 10000,
        requests: 100,
        storage: 5368709120, // 5GB
        users: 3
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingPeriod === 'monthly' ? 29 : 290,
      period: billingPeriod,
      features: [
        '1,000 uploads per month',
        '500 AI chats',
        '100K tokens per month',
        '1K API requests',
        '50GB storage',
        'All AI engines',
        'Priority support',
        'Advanced analytics'
      ],
      limits: {
        uploads: 1000,
        chats: 500,
        tokens: 100000,
        requests: 1000,
        storage: 53687091200, // 50GB
        users: 10
      },
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingPeriod === 'monthly' ? 99 : 990,
      period: billingPeriod,
      features: [
        'Unlimited uploads',
        'Unlimited AI chats',
        '1M tokens per month',
        '10K API requests',
        '500GB storage',
        'Custom AI models',
        'Dedicated support',
        'SSO integration',
        'Advanced security'
      ],
      limits: {
        uploads: 999999,
        chats: 999999,
        tokens: 1000000,
        requests: 10000,
        storage: 536870912000, // 500GB
        users: 50
      }
    }
  ];

  const invoices = [
    {
      id: 'INV-2024-001',
      date: new Date('2024-01-01'),
      amount: 29.00,
      status: 'paid',
      plan: 'Pro Monthly'
    },
    {
      id: 'INV-2023-012',
      date: new Date('2023-12-01'),
      amount: 29.00,
      status: 'paid',
      plan: 'Pro Monthly'
    },
    {
      id: 'INV-2023-011',
      date: new Date('2023-11-01'),
      amount: 29.00,
      status: 'paid',
      plan: 'Pro Monthly'
    }
  ];

  const currentPlan = plans.find(plan => plan.id === organization.plan);

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageVariant = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing & Usage</h1>
          <p className="text-gray-400">Manage your subscription and monitor usage</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="success" className="capitalize">
            {organization.plan} Plan
          </Badge>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade
          </Button>
        </div>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Current Plan</h3>
                <p className="text-sm text-gray-400">Your active subscription</p>
              </div>
              <Crown className="w-5 h-5 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white capitalize">{organization.plan}</div>
                <div className="text-sm text-gray-400">
                  ${currentPlan?.price || 0}/{currentPlan?.period || 'month'}
                </div>
              </div>
              
              <div className="space-y-2">
                {currentPlan?.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <Card className="lg:col-span-2 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Usage Overview</h3>
                <p className="text-sm text-gray-400">Current month usage</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">Uploads</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {usage.uploadsUsed.toLocaleString()} / {usage.uploadsLimit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={usage.uploadsUsed}
                    max={usage.uploadsLimit}
                    variant={getUsageVariant(usage.uploadsUsed, usage.uploadsLimit)}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-gray-300">AI Chats</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {usage.chatsUsed.toLocaleString()} / {usage.chatsLimit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={usage.chatsUsed}
                    max={usage.chatsLimit}
                    variant={getUsageVariant(usage.chatsUsed, usage.chatsLimit)}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-300">Tokens</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {usage.tokensUsed.toLocaleString()} / {usage.tokensLimit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={usage.tokensUsed}
                    max={usage.tokensLimit}
                    variant={getUsageVariant(usage.tokensUsed, usage.tokensLimit)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-gray-300">Storage</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatFileSize(usage.storageUsed)} / {formatFileSize(usage.storageLimit)}
                    </span>
                  </div>
                  <Progress
                    value={usage.storageUsed}
                    max={usage.storageLimit}
                    variant={getUsageVariant(usage.storageUsed, usage.storageLimit)}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">API Requests</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {usage.requestsMade.toLocaleString()} / {usage.requestsLimit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={usage.requestsMade}
                    max={usage.requestsLimit}
                    variant={getUsageVariant(usage.requestsMade, usage.requestsLimit)}
                  />
                </div>
                
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-300">Active Users</span>
                  </div>
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-xs text-gray-400">out of {currentPlan?.limits.users || 0} allowed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Plans */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Pricing Plans</h3>
              <p className="text-sm text-gray-400">Choose the perfect plan for your needs</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  billingPeriod === 'monthly' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  billingPeriod === 'yearly' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-lg border transition-colors ${
                  plan.popular 
                    ? 'bg-emerald-500/5 border-emerald-500 ring-1 ring-emerald-500/20' 
                    : 'bg-gray-700/30 border-gray-700 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="flex items-center justify-center mb-4">
                    <Badge variant="success" className="px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold text-white">
                    ${plan.price}
                    <span className="text-sm text-gray-400 font-normal">/{plan.period}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {organization.plan === plan.id ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Billing History</h3>
              <p className="text-sm text-gray-400">Download your invoices and receipts</p>
            </div>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{invoice.id}</div>
                    <div className="text-sm text-gray-400">
                      {invoice.date.toLocaleDateString()} • {invoice.plan}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-medium text-white">${invoice.amount.toFixed(2)}</div>
                    <Badge variant="success" className="text-xs">
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
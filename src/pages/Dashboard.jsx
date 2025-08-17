import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Upload from '../components/Upload';
import { Plus } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

const diseaseOptions = {
  plugins: {
    datalabels: {
      color: '#000',
      formatter: (value, context) => {
        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        const percentage = ((value / total) * 100).toFixed(0);
        return `${percentage}%`;
      },
    },
    legend: {
      position: 'bottom',
    },
  },
  elements: {
    arc: {
      borderWidth: 0,
    }
  },
  cutout: 0,
};

export default function Dashboard() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [data, setData] = useState({
    totalCases: 0,
    healthyPercentage: 0,
    activeAlerts: 0,
    diseaseBreakdown: {},
    monthlyTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/dashboard/stats', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = () => {
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Generate pie chart data from real data
  const diseaseData = {
    labels: Object.keys(data.diseaseBreakdown),
    datasets: [
      {
        data: Object.values(data.diseaseBreakdown),
        backgroundColor: Object.keys(data.diseaseBreakdown).length === 1 
          ? ['#f87171'] // Single color for one disease
          : ['#4ade80', '#facc15', '#f87171', '#a855f7', '#06b6d4', '#f97316'].slice(0, Object.keys(data.diseaseBreakdown).length),
        hoverBackgroundColor: Object.keys(data.diseaseBreakdown).length === 1
          ? ['#ef4444'] // Single hover color for one disease
          : ['#22c55e', '#eab308', '#ef4444', '#9333ea', '#0891b2', '#ea580c'].slice(0, Object.keys(data.diseaseBreakdown).length),
        borderWidth: 0,
        borderColor: 'transparent',
      },
    ],
  };

  // Generate trend data from real data
  const trendData = {
    labels: data.monthlyTrend.map(item => item.month),
    datasets: [
      {
        label: 'Cases',
        data: data.monthlyTrend.map(item => item.cases),
        borderColor: '#4ade80',
        backgroundColor: '#4ade80',
        tension: 0.3,
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-6 pt-26 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 pt-26 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error loading dashboard: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-26">
      {/* KPI Cards */}
      <div className="col-span-1 lg:col-span-3 flex justify-between p-6 bg-green-50 rounded-xl shadow">
        <div>
          <h2 className="text-xl font-semibold">Total Cases Detected</h2>
          <p className="text-3xl font-bold">{data.totalCases}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Healthy Animals</h2>
          <p className="text-3xl font-bold text-green-600">{data.healthyPercentage}%</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Infected Cases</h2>
          <p className="text-3xl font-bold text-red-600">{data.activeAlerts}</p>
        </div>
      </div>

      {/* Disease Breakdown */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Disease Type Breakdown</h3>
        {Object.keys(data.diseaseBreakdown).length > 0 ? (
          <Pie data={diseaseData} options={diseaseOptions} />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No disease data available
          </div>
        )}
      </div>

      {/* Trend Over Time */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Infected Cases Trend (Last 6 Months)</h3>
        {data.monthlyTrend.length > 0 ? (
          <Line data={trendData} />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No trend data available
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="col-span-1 lg:col-span-3 bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
        {data.activeAlerts > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
            {data.activeAlerts > 5 && (
              <li className="text-red-600">High number of infected cases detected. Consider immediate veterinary consultation.</li>
            )}
            {Object.keys(data.diseaseBreakdown).map(disease => {
              if (data.diseaseBreakdown[disease] > 0) {
                return (
                  <li key={disease}>
                    {data.diseaseBreakdown[disease]} case(s) of {disease} detected. Monitor affected animals closely.
                  </li>
                );
              }
              return null;
            })}
            <li>Increase regular health monitoring and maintain proper hygiene protocols.</li>
          </ul>
        ) : (
          <p className="text-green-600">All animals appear healthy. Continue regular monitoring.</p>
        )}
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          View Detailed Report
        </button>
      </div>

      {/* Sticky Upload Button */}
      <button
        onClick={() => setIsUploadOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 z-40"
        title="Upload Image"
      >
        <Plus size={24} />
      </button>

      {/* Upload Modal */}
      <Upload 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={refreshDashboard}
      />
    </div>
  );
}

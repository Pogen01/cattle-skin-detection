import React, { useState } from 'react';
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

const diseaseData = {
  labels: ['Ringworm', 'Mange', 'Lumpy Skin Disease'],
  datasets: [
    {
      data: [8, 5, 2],
      backgroundColor: ['#4ade80', '#facc15', '#f87171'],
      hoverBackgroundColor: ['#22c55e', '#eab308', '#ef4444'],
    },
  ],
};

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
};

const trendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Cases',
      data: [2, 4, 6, 3, 5, 9],
      borderColor: '#4ade80',
      backgroundColor: '#4ade80',
      tension: 0.3,
    },
  ],
};

export default function Dashboard() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-26">
      {/* KPI Cards */}
      <div className="col-span-1 lg:col-span-3 flex justify-between p-6 bg-green-50 rounded-xl shadow">
        <div>
          <h2 className="text-xl font-semibold">Total Cases Detected</h2>
          <p className="text-3xl font-bold">15</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Healthy Animals</h2>
          <p className="text-3xl font-bold text-green-600">92%</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Active Alerts</h2>
          <p className="text-3xl font-bold text-red-600">3</p>
        </div>
      </div>

      {/* Disease Breakdown */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Disease Type Breakdown</h3>
        <Pie data={diseaseData} options={diseaseOptions} />
      </div>

      {/* Trend Over Time */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Detection Trend</h3>
        <Line data={trendData} />
      </div>

      {/* Recommendations */}
      <div className="col-span-1 lg:col-span-3 bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Isolate cattle showing severe mange immediately.</li>
          <li>Increase pasture inspection due to rising ringworm cases.</li>
          <li>Contact a vet if lumpy skin disease symptoms persist.</li>
        </ul>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">View Detailed Report</button>
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
      />
    </div>
  );
}

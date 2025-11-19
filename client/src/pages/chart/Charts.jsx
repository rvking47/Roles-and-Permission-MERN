import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Charts = () => {

  // LINE CHART DATA (User Growth)
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "User Growth",
        data: [150, 300, 450, 600, 900, 1200, 1300],
        borderColor: "rgb(59,130,246)", // blue
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.4,
      }
    ]
  };

  // BAR CHART DATA (Active Users)
  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Active Users",
        data: [150, 200, 180, 220, 260, 300, 280],
        backgroundColor: "rgba(16,185,129,0.6)", // green
        borderRadius: 5,
      }
    ]
  };

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* LINE CHART */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">User Growth Chart</h3>
        <Line data={lineData} />
      </div>

      {/* BAR CHART */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Active Users This Week</h3>
        <Bar data={barData} />
      </div>

    </div>
  );
};

export default Charts;

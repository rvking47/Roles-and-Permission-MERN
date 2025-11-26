import axios from "axios";
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
import { useEffect, useState } from "react";

import { Line, Bar } from "react-chartjs-2";
import toast from "react-hot-toast";

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

const base_url = "http://localhost:7001";

const Charts = () => {

  const [usersMonth, setUserMonth] = useState(new Array(12).fill(0));
  const [usersActive, setUsersActive] = useState(new Array(7).fill(0));
  const token = localStorage.getItem("token");


  const handleUsers = async () => {
    try {
      const result = await axios.get(`${base_url}/api/users/view`, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });

      if (result.status === 200) {
        const users = result.data;

        const monthCounts = new Array(12).fill(0);
        users.forEach(user => {
          const month = new Date(user.createdAt).getMonth();
          monthCounts[month]++;
        });

        setUserMonth(monthCounts);

        const weekCounts = new Array(7).fill(0);
        const now = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);

        users.forEach(user => {
          if (user.lastLoginAt) {
            const loginDate = new Date(user.lastLoginAt);

            // Only count if login was within last 7 days
            if (loginDate >= lastWeek) {
              const day = loginDate.getDay();
              weekCounts[day]++;
            }
          }
        });

        const arranged = [
          weekCounts[1],
          weekCounts[2],
          weekCounts[3],
          weekCounts[4],
          weekCounts[5],
          weekCounts[6],
          weekCounts[0],
        ];

        setUsersActive(arranged);
      }
    } catch (err) {
      toast.error("Server Error");
    }
  };

  // LINE CHART DATA (User Growth)
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "User Growth",
        data: usersMonth,
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
        data: usersActive,
        backgroundColor: "rgba(16,185,129,0.6)", // green
        borderRadius: 5,
      }
    ]
  };

  useEffect(() => {
    handleUsers();
  }, [])

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

import React, { useEffect, useState } from "react";
import { getAllExpos, getExhibitorsByExpo } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { token } = useAuth(); // Assuming you store token in AuthContext
  const [stats, setStats] = useState({
    totalExpos: 0,
    totalExhibitors: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const exposRes = await getAllExpos();
      const expos = exposRes.data;

      let exhibitorsCount = 0;
      for (let expo of expos) {
        const exhibitorsRes = await getExhibitorsByExpo(expo._id, token);
        exhibitorsCount += exhibitorsRes.data.length;
      }

      setStats({
        totalExpos: expos.length,
        totalExhibitors: exhibitorsCount,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold">Total Expos</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalExpos}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold">Total Exhibitors</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalExhibitors}</p>
        </div>
      </div>
    </div>
  );
}

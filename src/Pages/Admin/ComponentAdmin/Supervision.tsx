import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import axios from 'axios';
import { Activity, TrendingUp, Users, Calendar } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Supervision = () => {
  const [activityData, setActivityData] = useState({
    dailyStats: [],
    weeklyStats: [],
    monthlyStats: [],
    userActivity: []
  });

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      const [doctors, patients, appointments] = await Promise.all([
        axios.get('http://localhost:3000/doctors'),
        axios.get('http://localhost:3000/patients'),
        axios.get('http://localhost:3000/appointments')
      ]);

      // Process data for charts
      const dailyData = processDataForDaily(appointments.data);
      const weeklyData = processDataForWeekly(appointments.data);
      const monthlyData = processDataForMonthly(appointments.data);
      const userActivityData = processUserActivity(doctors.data, patients.data);

      setActivityData({
        dailyStats: dailyData,
        weeklyStats: weeklyData,
        monthlyStats: monthlyData,
        userActivity: userActivityData
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  const processDataForDaily = (appointments) => {
    // Group appointments by day
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      appointments: appointments.filter(apt => apt.date?.startsWith(date)).length
    }));
  };

  const processDataForWeekly = (appointments) => {
    // Group appointments by week
    const last4Weeks = Array.from({ length: 4 }, (_, i) => ({
      week: `Semaine ${i + 1}`,
      appointments: Math.floor(Math.random() * 50) // Simulate data
    }));
    return last4Weeks;
  };

  const processDataForMonthly = (appointments) => {
    // Group appointments by month
    const last6Months = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(new Date().setMonth(new Date().getMonth() - i)).toLocaleString('fr-FR', { month: 'long' }),
      appointments: Math.floor(Math.random() * 150) // Simulate data
    })).reverse();
    return last6Months;
  };

  const processUserActivity = (doctors, patients) => {
    return [
      { name: 'Médecins', value: doctors.length },
      { name: 'Patients', value: patients.length }
    ];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Supervision du Système</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className="bg-[#2a303c] p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Activité Journalière</h3>
          <LineChart width={500} height={300} data={activityData.dailyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: '#2a303c', border: 'none' }} />
            <Legend />
            <Line type="monotone" dataKey="appointments" stroke="#0088FE" />
          </LineChart>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-[#2a303c] p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Activité Hebdomadaire</h3>
          <BarChart width={500} height={300} data={activityData.weeklyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="week" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: '#2a303c', border: 'none' }} />
            <Legend />
            <Bar dataKey="appointments" fill="#00C49F" />
          </BarChart>
        </div>

        {/* Monthly Activity Chart */}
        <div className="bg-[#2a303c] p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Activité Mensuelle</h3>
          <LineChart width={500} height={300} data={activityData.monthlyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: '#2a303c', border: 'none' }} />
            <Legend />
            <Line type="monotone" dataKey="appointments" stroke="#FFBB28" />
          </LineChart>
        </div>

        {/* User Distribution Chart */}
        <div className="bg-[#2a303c] p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Distribution des Utilisateurs</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={activityData.userActivity}
              cx={250}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {activityData.userActivity.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#2a303c', border: 'none' }} />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Supervision;
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

export default function Dashboard({ userName, skillProgress, skillsData, onBack, onViewResults }) {
  // Get completed skills with scores
  const completedSkills = Object.keys(skillProgress)
    .map(skillId => {
      const skill = skillsData.find(s => s.id === parseInt(skillId));
      return {
        name: skill?.title || 'Unknown',
        score: Math.round(skillProgress[skillId].score || 0),
        id: skillId
      };
    })
    .filter(skill => skill.score > 0);

  // Statistics
  const totalCompleted = completedSkills.length;
  const averageScore = totalCompleted > 0 
    ? Math.round(completedSkills.reduce((sum, skill) => sum + skill.score, 0) / totalCompleted)
    : 0;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <h1>Welcome, <span className="user-name">{userName}</span></h1>
        {onViewResults && (
          <button className="view-results-btn" onClick={onViewResults}>
            <i className="fa-solid fa-database"></i> View All Results
          </button>
        )}
      </div>

      {/* Status Section */}
      <div className="dashboard-content">
        {totalCompleted === 0 ? (
          <div className="no-completed">
            <i className="fa-solid fa-clipboard-list"></i>
            <h2>No Tests Completed Yet</h2>
            <p>Start a quiz to see your progress graph!</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <h3>{totalCompleted}</h3>
                  <p>Tests Completed</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="stat-info">
                  <h3>{averageScore}%</h3>
                  <p>Average Score</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
              {/* Bar Chart */}
              <div className="chart-container">
                <h2>Skills Performance</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={completedSkills}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => `${value}%`}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                    />
                    <Bar dataKey="score" fill="#4ECDC4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="chart-container">
                <h2>Completion Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: totalCompleted },
                        { name: 'Pending', value: skillsData.length - totalCompleted }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#4ECDC4" />
                      <Cell fill="#E0E0E0" />
                    </Pie>
                    <Tooltip formatter={(value) => `${value} skills`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="results-table">
              <h2>Detailed Results</h2>
              <table>
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedSkills.map((skill) => (
                    <tr key={skill.id}>
                      <td>{skill.name}</td>
                      <td className="score">{skill.score}%</td>
                      <td className="status">
                        <span className={skill.score >= 70 ? 'passed' : 'pending'}>
                          {skill.score >= 70 ? '✓ Passed' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

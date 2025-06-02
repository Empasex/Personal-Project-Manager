import React from 'react';
import ProjectList from '../components/ProjectList';

const Dashboard = ({ userId }) => {
    return (
        <div className="container mt-4">
            <h1>Dashboard</h1>
            <ProjectList userId={userId} />
        </div>
    );
};

export default Dashboard;
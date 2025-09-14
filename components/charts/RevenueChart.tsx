
import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import Card from '../ui/Card';
import { MOCK_REVENUE_DATA } from '../../constants';

const RevenueChart: React.FC = () => {
    return (
        <Card title="Revenue Forecasting (Q1-Q3)">
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={MOCK_REVENUE_DATA}
                        margin={{
                            top: 5,
                            right: 20,
                            left: -10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#475569" />
                        <YAxis stroke="#475569" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                            }}
                            labelStyle={{ color: '#1e293b' }}
                        />
                        <Legend wrapperStyle={{ color: '#1e293b' }} />
                        <Line type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={2} name="Forecasted" />
                        <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default RevenueChart;
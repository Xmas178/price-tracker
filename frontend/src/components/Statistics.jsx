import { useState, useEffect } from 'react';
import {
    Paper,
    Grid,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';

function Statistics() {
    // State for statistics data
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch statistics from API
    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/stats');
            setStats(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch statistics');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    // Show loading spinner
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    // Show error message
    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    // Prepare chart data
    const chartData = [
        { name: 'Products', value: stats.total_products },
        { name: 'Total Scans', value: stats.total_scans }
    ];

    return (
        <Box>
            {/* Statistics cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Total Products
                        </Typography>
                        <Typography variant="h3" color="primary">
                            {stats.total_products}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Total Scans
                        </Typography>
                        <Typography variant="h3" color="secondary">
                            {stats.total_scans}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Bar chart */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Overview Chart
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#1976d2" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
}

export default Statistics;
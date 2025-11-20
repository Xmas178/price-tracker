import { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Box,
    TextField,
    Chip
} from '@mui/material';
import axios from 'axios';

function PriceAlerts() {
    // State for alerts data
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [threshold, setThreshold] = useState(5.0);

    // Fetch alerts from API
    useEffect(() => {
        fetchAlerts();
    }, [threshold]);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/alerts?threshold=${threshold}`);
            setAlerts(response.data.alerts);
            setError(null);
        } catch (err) {
            setError('Failed to fetch alerts');
            console.error('Error fetching alerts:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle threshold input change
    const handleThresholdChange = (event) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value) && value >= 0) {
            setThreshold(value);
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

    return (
        <Box>
            {/* Header with threshold filter */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">
                    Price Alerts ({alerts.length})
                </Typography>
                <TextField
                    label="Threshold (%)"
                    type="number"
                    value={threshold}
                    onChange={handleThresholdChange}
                    size="small"
                    sx={{ width: 150 }}
                />
            </Box>

            {/* Alerts table */}
            {alerts.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        No price changes exceed {threshold}% threshold
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell align="right">Previous Price</TableCell>
                                <TableCell align="right">Current Price</TableCell>
                                <TableCell align="center">Change</TableCell>
                                <TableCell>Last Updated</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alerts.map((alert) => (
                                <TableRow key={alert.id} hover>
                                    <TableCell>{alert.id}</TableCell>
                                    <TableCell>{alert.title}</TableCell>
                                    <TableCell align="right">£{alert.previous_price}</TableCell>
                                    <TableCell align="right">£{alert.current_price}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={`${alert.change_percent.toFixed(2)}%`}
                                            color={alert.change_percent > 0 ? 'error' : 'success'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(alert.last_updated).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default PriceAlerts;
import { useState, useEffect } from 'react';
import { Container, Box, Typography, Tab, Tabs } from '@mui/material';
import ProductList from './components/ProductList';
import Statistics from './components/Statistics';
import PriceAlerts from './components/PriceAlerts';

function App() {
  // Tab state for navigation
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Main title */}
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Price Tracker Dashboard
        </Typography>

        {/* Navigation tabs */}
        <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
          <Tab label="Products" />
          <Tab label="Statistics" />
          <Tab label="Price Alerts" />
        </Tabs>

        {/* Render components based on active tab */}
        {tabValue === 0 && <ProductList />}
        {tabValue === 1 && <Statistics />}
        {tabValue === 2 && <PriceAlerts />}
      </Box>
    </Container>
  );
}

export default App;
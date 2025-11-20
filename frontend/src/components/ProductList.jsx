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
    Button
} from '@mui/material';
import axios from 'axios';

function ProductList() {
    // State for products data
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products from API
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/products');
            setProducts(response.data.products);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    // Export to CSV
    const handleExportCSV = () => {
        window.open('http://localhost:8000/export/csv', '_blank');
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
            {/* Header with export button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Products ({products.length})</Typography>
                <Button variant="contained" onClick={handleExportCSV}>
                    Export CSV
                </Button>
            </Box>

            {/* Products table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell align="right">Current Price</TableCell>
                            <TableCell>Last Updated</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} hover>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.title}</TableCell>
                                <TableCell align="right">£{product.current_price}</TableCell>
                                <TableCell>{new Date(product.last_updated).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ProductList;
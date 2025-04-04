import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import axios from 'axios';

const PaymentPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('payme');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/courses/${id}/`, {
          headers: {
            'X-Telegram-User-ID': user.id,
          },
        });
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load course data');
        setLoading(false);
      }
    };

    if (user) {
      fetchCourse();
    }
  }, [id, user]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // In a real application, you would integrate with the actual payment providers
      // For this example, we'll simulate a successful payment
      await axios.post(`/api/progress/${id}/update_payment/`, null, {
        headers: {
          'X-Telegram-User-ID': user.id,
        },
      });
      
      // Send success message to Telegram
      window.Telegram.WebApp.sendData(JSON.stringify({
        type: 'payment_success',
        course_id: id,
        user_id: user.id,
      }));
      
      // Navigate back to course detail page
      navigate(`/course/${id}`);
    } catch (err) {
      setError('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.Telegram.WebApp.close()}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Payment
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            ${course.price}
          </Typography>
        </CardContent>
      </Card>

      <FormControl component="fieldset" sx={{ width: '100%', mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select Payment Method
        </Typography>
        <RadioGroup
          value={selectedPayment}
          onChange={(e) => setSelectedPayment(e.target.value)}
        >
          <FormControlLabel
            value="payme"
            control={<Radio />}
            label="Payme"
          />
          <FormControlLabel
            value="click"
            control={<Radio />}
            label="Click"
          />
          <FormControlLabel
            value="uzum"
            control={<Radio />}
            label="Uzum Bank"
          />
        </RadioGroup>
      </FormControl>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => window.Telegram.WebApp.close()}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentPage; 
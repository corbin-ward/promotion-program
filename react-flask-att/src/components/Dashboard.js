import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Card, CardActionArea, CardContent, CardMedia, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from './AuthContext';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { authToken, logout } = useAuth();

  useEffect(() => {
    if (!authToken) {
      navigate('/');
    } else {
      fetch('http://127.0.0.1:5000/user/profile', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      .then(response => response.json())
      .then(data => {
        if (data.first_name) {
          setUserName(data.first_name);
        } else {
          throw new Error('User not found');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        navigate('/');
      });
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>Welcome to the Dashboard</Typography>
      <Typography variant="h5" gutterBottom>Welcome, {userName || 'User'}!</Typography>
      <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ mb: 2 }}>
        Logout
      </Button>
      <Grid container spacing={3} justifyContent="center">
        {dashboardLinks.map(({ path, title, image }) => (
          <Grid item xs={12} sm={6} md={4} key={title}>
            <Card raised sx={{ '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s ease-in-out' } }}>
              <CardActionArea component={RouterLink} to={path}>
                {image && <CardMedia component="img" height="140" image={image} alt={title} />}
                <CardContent>
                  <Typography variant="h6" align="center">{title}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const dashboardLinks = [
  { path: '/nominee/dashboard', title: 'Nominator Dashboard'},
  { path: '/recommender/dashboard', title: 'Recommender Dashboard'},
  { path: '/review/dashboard', title: 'Review Committee Dashboard'}
];

export default Dashboard;

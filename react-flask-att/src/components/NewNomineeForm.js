import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Button, TextField, Typography, Container, Card, CardContent, Grid, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const NewNomineeForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    department_name: '',
    job_category: '',
    email: '',
    nominator_qualification: ''
  });

  const { authToken, userId } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const allFieldsFilled = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!allFieldsFilled()) {
      alert('Please fill all fields before submitting.');
      return;
    }
    const fullData = {
        ...formData,
        user_id: userId
    };
    axios.post('http://127.0.0.1:5000/nominee/create', fullData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
      console.log('Response data:', response.data);
      if(response.data && response.data.id) {
          navigate(`/nominee/${response.data.id}/education`);
      } else {
          throw new Error('ID not found in response');
      }
    })
    .catch(error => {
        console.error('Error creating nominee:', error.response ? error.response.data : "No response");
    });
  };

  return (
    <Container maxWidth="sm">
      <Card raised>
        <CardContent>
          <Typography variant="h6" gutterBottom>New Nominee Form</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nominee First Name" name="first_name" value={formData.first_name} onChange={handleChange} variant="outlined" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Nominee Last Name" name="last_name" value={formData.last_name} onChange={handleChange} variant="outlined" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Department Name" name="department_name" value={formData.department_name} onChange={handleChange} variant="outlined" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Job Category" name="job_category" value={formData.job_category} onChange={handleChange} variant="outlined" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} variant="outlined" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Nominator Qualification" name="nominator_qualification" value={formData.nominator_qualification} onChange={handleChange} variant="outlined" multiline rows={4} required />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Button type="submit" variant="contained" color="primary">Submit</Button>
                  <Button variant="contained" color="secondary" component={Link} to="/nominee/dashboard">Back to Dashboard</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NewNomineeForm;

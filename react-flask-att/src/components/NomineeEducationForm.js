import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Typography, Container, Card, CardContent, Grid, Box } from '@mui/material';
import { useAuth } from './AuthContext';

const NomineeEducationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [educations, setEducations] = useState([{
    college_name: '',
    location: '',
    degree: '',
    program: '',
    graduation_year: ''
  }]);

  const handleChange = (index, e) => {
    const newEducations = educations.map((education, i) => {
      if (i === index) {
        return { ...education, [e.target.name]: e.target.value };
      }
      return education;
    });
    setEducations(newEducations);
  };

  const allFieldsFilled = () => {
    return educations.every(education => {
      return Object.values(education).every(value => value.trim() !== '');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allFieldsFilled()) {
      alert('Please fill all fields in every education entry before submitting.');
      return;
    }
    if (!authToken) {
      console.error("No authentication token found.");
      return;
    }
    try {
      await Promise.all(educations.map(education => 
        axios.post(`http://127.0.0.1:5000/nominee/${id}/education/add`, education, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })
      ));
      console.log('All educations added');
      navigate('/nominee/dashboard');
    } catch (error) {
      console.error('Error adding education:', error.response ? error.response.data : "No response");
    }
  };

  const addEducationForm = () => {
    setEducations([...educations, {
      college_name: '',
      location: '',
      degree: '',
      program: '',
      graduation_year: ''
    }]);
  };

  return (
    <Container maxWidth="md">
      <Card raised>
        <CardContent>
          <Typography variant="h6" gutterBottom>Add Education Details</Typography>
          <form onSubmit={handleSubmit}>
            {educations.map((education, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="College Name"
                    name="college_name"
                    value={education.college_name}
                    onChange={e => handleChange(index, e)}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={education.location}
                    onChange={e => handleChange(index, e)}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Degree"
                    name="degree"
                    value={education.degree}
                    onChange={e => handleChange(index, e)}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Program"
                    name="program"
                    value={education.program}
                    onChange={e => handleChange(index, e)}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Graduation Year"
                    name="graduation_year"
                    value={education.graduation_year}
                    onChange={e => handleChange(index, e)}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                {educations.length - 1 === index && (
                  <Grid item xs={12}>
                    <Button onClick={addEducationForm} variant="contained" color="primary">
                      Add Another Education
                    </Button>
                  </Grid>
                )}
              </Grid>
            ))}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button type="submit" variant="contained" color="primary">Submit All Educations</Button>
              <Button variant="contained" color="secondary" onClick={() => navigate('/nominee/dashboard')}>Cancel</Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NomineeEducationForm;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container } from '@mui/material';

function EditEducationForm() {
    const { eduId } = useParams();
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');

    const [educationData, setEducationData] = useState({
        college_name: '',
        location: '',
        degree: '',
        program: '',
        graduation_year: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEducationData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!authToken) {
            console.error("No authentication token found.");
            return;
        }
        axios.put(`http://127.0.0.1:5000/nominee/education/${eduId}/edit`, educationData, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            alert('Education updated successfully');
            navigate('/nominee/dashboard');
        })
        .catch(error => {
            console.error('Failed to update education:', error);
            alert('Failed to update education: ' + (error.response ? error.response.data.error : "Unknown error"));
        });
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h6" gutterBottom>Edit Education Details</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="College Name"
                    name="college_name"
                    value={educationData.college_name}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={educationData.location}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Degree"
                    name="degree"
                    value={educationData.degree}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Program"
                    name="program"
                    value={educationData.program}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    type="date"
                    label="Graduation Year"
                    name="graduation_year"
                    value={educationData.graduation_year}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button type="submit" variant="contained" color="primary">Update Education</Button>
            </form>
        </Container>
    );
}

export default EditEducationForm;

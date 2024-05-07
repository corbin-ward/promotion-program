import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField } from '@mui/material';

function ReviewCommitteeDashboard() {
    const [nominees, setNominees] = useState([]);
    const [rankedNominees, setRankedNominees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('http://127.0.0.1:5000/review/dashboard', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                });
                console.log(data);  // Debug: What exactly is being received?
    
                // Ensure that you are referencing the correct property from the response
                if(data.all_nominees) {
                    setNominees(data.all_nominees);
                } else {
                    console.log('No nominees data found under all_nominees');
                }
                if(data.ranked_nominees) {
                    setRankedNominees(data.ranked_nominees);
                } 
                
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
    
        fetchData();
    }, []);

    const handleBack = () => {
        navigate('/dashboard'); // Navigate back to the main dashboard
    };

    const updateRank = (nomineeId, rankRev) => {
        axios.post('/api/updateRankRev', { nomineeId, rankRev })
            .then(response => {
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('Error updating rank:', error);
            });
    };

    const handleRankChange = (nomineeId, rank) => {
        // Update nominee's rank locally
        const updatedNominees = nominees.map(nominee => {
            if (nominee.id === nomineeId) {
                return { ...nominee, rankRev: rank };
            }
            return nominee;
        });
        setNominees(updatedNominees);
    };

    const handleSubmitRank = (nomineeId, rank) => {
        // Call updateRank to update rank_rev in the backend
        updateRank(nomineeId, rank);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Review Committee Dashboard</Typography>
            <Button variant="contained" color="primary" onClick={handleBack} style={{ marginBottom: '20px' }}>
                Back to Main Dashboard
            </Button>
            
            {/* Table to display all nominees with editable rank */}
            <Typography variant="h5" gutterBottom>All Nominees</Typography>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nominee Name</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Job Category</TableCell>
                            <TableCell>Current Ranking</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {nominees.map((nominee) => (
                            <TableRow key={nominee.id}>
                                <TableCell>{nominee.first_name} {nominee.last_name}</TableCell>
                                <TableCell>{nominee.department_name}</TableCell>
                                <TableCell>{nominee.job_category}</TableCell>
                                <TableCell>
                                    <TextField
                                    type="number"
                                    value={nominee.rankRev || ''}
                                    onChange={(e) => handleRankChange(nominee.id, parseInt(e.target.value))}
                                    style={{ width: '80px' }} // Set a specific width
                                />
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleSubmitRank(nominee.id, nominee.rankRev)}>
                                        Submit
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button component={RouterLink} to={`/review/nominee/${nominee.id}/details`}>
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Table to display all nominees with rev_rank */}
        </div>
    );
}

export default ReviewCommitteeDashboard;

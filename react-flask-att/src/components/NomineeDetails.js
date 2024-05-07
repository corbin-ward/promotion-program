import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button, TextField, Typography, Container, Card, CardContent, Grid,
  IconButton, Dialog, Link, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ViewNominee from './ViewNominee'; // Ensure correct import

function NomineeDetails() {
    const { nomineeId } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState([]);
    const [nomineeName, setNomineeName] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [fullText, setFullText] = useState('');
    const [isFullTextDialogOpen, setIsFullTextDialogOpen] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/review/nominee/${nomineeId}/details`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        })
        .then(response => {
            if (response.data.length > 0) {
                setNomineeName(response.data[0].nominee_name);
                setDetails(response.data.slice(1));
            }
        })
        .catch(error => {
            console.error('Error fetching nominee details:', error);
            navigate('/dashboard');
        });
    }, [nomineeId, navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % details.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => prev === 0 ? details.length - 1 : prev - 1);
    };

    const openViewDialog = () => setIsViewDialogOpen(true);
    const closeViewDialog = () => setIsViewDialogOpen(false);

    const openFullTextDialog = (text) => {
        setFullText(text);
        setIsFullTextDialogOpen(true);
    };

    const closeFullTextDialog = () => setIsFullTextDialogOpen(false);

    return (
        <Container maxWidth="md">
            <Card raised>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Details for Nominee: <Link onClick={openViewDialog} style={{ cursor: 'pointer', color: 'blue' }}>{nomineeName}</Link>
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleBack} sx={{ mb: 2 }}>
                        Go Back
                    </Button>
                    {details.length > 0 ? (
                        <form>
                            <Typography variant="h6" gutterBottom>
                                Recommender's Feedback by {details[currentIndex]?.first_name || 'Unknown'} {details[currentIndex]?.last_name || 'Recommender'}:
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    { key: 'ic_q1', label: 'Personally, became aware of the importance of his/her extraordinary accomplishments and their impact on the company.' },
                                    { key: 'ic_q2', label: 'List technical patents; technical reports and presentations; development of products, applications and systems; and application of facilities and services.' },
                                    { key: 'ic_q3', label: 'Comparing with people in this position.' },
                                    { key: 'ic_q4', label: 'What’s the expansion of job responsibility.' },
                                    { key: 'ic_q5', label: 'What is the future development area, what’s manager’s plan for the career development.' }
                                ].map(field => (
                                    <Grid item xs={12} key={field.key}>
                                        <TextField
                                            fullWidth
                                            label={field.label}
                                            value={details[currentIndex][field.key] || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            margin="normal"
                                            onClick={() => openFullTextDialog(details[currentIndex][field.key] || '')}
                                        />
                                    </Grid>
                                ))}
                                <Grid item container justifyContent="space-between" xs={12}>
                                    <IconButton onClick={goToPrevious}>
                                        <ArrowBackIosIcon />
                                    </IconButton>
                                    <IconButton onClick={goToNext}>
                                        <ArrowForwardIosIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </form>
                    ) : (
                        <Typography>No details available</Typography>
                    )}
                </CardContent>
            </Card>
            <Dialog open={isViewDialogOpen} onClose={closeViewDialog} maxWidth="md" fullWidth>
                <ViewNominee id={nomineeId} onClose={closeViewDialog} />
            </Dialog>
            <Dialog open={isFullTextDialogOpen} onClose={closeFullTextDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Recommender Response</DialogTitle>
                <DialogContent>
                    <Typography>{fullText}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeFullTextDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default NomineeDetails;

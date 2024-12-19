import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Avatar, Box, Button, Card, CardActions, CardContent, Container, Grid, IconButton, Modal, Typography, Tab, Tabs, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';

interface Petition {
    categoryId: number;
    creationDate: string;
    numberOfSupporters: number;
    ownerFirstName: string;
    ownerId: number;
    ownerLastName: string;
    petitionId: number;
    supportingCost: number;
    title: string;
}

const MyPetitions = () => {
    const [petitions, setPetitions] = useState<Petition[]>([]);
    const [filteredPetitions, setFilteredPetitions] = useState<Petition[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [listCategories, setListCategories] = useState<Array<{ categoryId: number; name: string }>>([]);
    const [showModal, setShowModal] = useState(false);
    const [petitionToDelete, setPetitionToDelete] = useState<number | null>(null);
    const [showMyPetitions, setShowMyPetitions] = useState<boolean>(true); // State to toggle between showing owned and supported petitions

    const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = React.useState(false);
    useEffect(() => {
        if (Cookies.get('id') == null) {
            navigate("/users/login")
        }
        const id = Cookies.get('id');

        if (showMyPetitions) {
            axios.get(`http://localhost:4941/api/v1/petitions?ownerId=${id}`).then(
                (response) => {
                    setFilteredPetitions(response.data.petitions);
                    setPetitions(response.data.petitions);
                },
                (error) => {
                    setError(error.response.data.message);
                }
            );
        } else {
            axios.get(`http://localhost:4941/api/v1/petitions?supporterId=${id}`).then(
                (response) => {
                    setFilteredPetitions(response.data.petitions);
                },
                (error) => {
                    setError(error.response.data.message);
                }
            );
        }
        getCategories();
    }, [showMyPetitions, navigate]);

    const closeModal = () => {
        setShowModal(false);
        setPetitionToDelete(null);
    };

    const handleDelete = (id: number) => {
        setPetitionToDelete(id);
        setShowModal(true);
    };

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };

    const handleSuccessSnackbarClose = () => {
        setIsSuccessSnackbarOpen(false);
    };

    const getCategories = () => {
        axios.get('http://localhost:4941/api/v1/petitions/categories').then((response) => {
            setListCategories(response.data);
        }).catch((error) => {
            console.error('Error fetching petitions:', error);
        });
    };
    // Function to delete petition
    const deletePetition = () => {
        if (petitionToDelete !== null) {
            axios
                .delete(`http://localhost:4941/api/v1/petitions/${petitionToDelete}`, {
                    headers: { 'X-Authorization': Cookies.get('X-Authorization') },
                })
                .then(() => {
                    const updatedPetitions = petitions.filter((petition) => petition.petitionId !== petitionToDelete);
                    setPetitions(updatedPetitions);
                    setFilteredPetitions(updatedPetitions);
                    setSnackbarMessage("petition deleted");
                    setIsSuccessSnackbarOpen(true);
                    setShowModal(false);
                })
                .catch((error) => {
                    console.error('Error deleting petition:', error);
                    setError('Error deleting petition');
                    setShowModal(false);
                });
        }
    };

    const viewPetitionDetails = (petitionId: number, route: string) => {
        if (route === "edit") {
            navigate(`/edit-petition/${petitionId}`);
        } else {
            navigate(`/Petitions/${petitionId}`);
        }
    };

    const formatDate = (date: string | number | Date) => {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        return formattedDate;
    };

    const getCategory = (id: number) => {
        const category = listCategories.find(category => category.categoryId === id);
        return category ? category.name : undefined;
    };

    return (
        <Container>
            <Box sx={{ mb: 2 }}>
                <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={showMyPetitions ? 0 : 1} onChange={(event, newValue) => setShowMyPetitions(newValue === 0)} aria-label="basic tabs example" variant="fullWidth">
                        <Tab label="My Petitions" />
                        <Tab label="Supported Petitions" />
                    </Tabs>
                </Box>
            </Box>
            {filteredPetitions.length === 0 ? (
                
                <Box>
                    <Typography variant="h6" align="center" sx={{ marginTop: "28%", fontSize: '2rem', textAlign: 'center' }}>
                        Nothing yet...
                    </Typography>
                </Box>

            
            ) : (
                <Box>
                    <Grid container padding="30px">
                        {filteredPetitions.map(petition => (
                            <Grid item lg={4} style={{ paddingLeft: "2vw" }} key={petition.petitionId}>
                                    <Card sx={{ marginBottom: 2}}>
                                    <CardContent>
                                        <img src={`http://localhost:4941/api/v1/petitions/${petition.petitionId}/image`} style={{ display: 'flex', objectFit: 'cover', justifyContent: 'center', alignItems: 'center', height: "32vh" }}  alt="No petition pic yet..." />
                                        <Typography gutterBottom variant="h5" component="div">
                                            {petition.title}
                                        </Typography>
                                        <Typography style={{marginBottom:"5px"}} variant="body2" color="text.secondary">
                                            Category: {getCategory(petition.categoryId)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDate(petition.creationDate)}
                                        </Typography>
                                        <div style={{marginBottom:"5px", marginTop:"5px",  display: 'flex', alignItems: 'center', marginLeft: '20%' }}>
                                            <Avatar src={`http://localhost:4941/api/v1/users/${petition.ownerId}/image`} sx={{ marginRight: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {petition.ownerFirstName} {petition.ownerLastName}
                                            </Typography>
                                        </div>
                                        <Typography variant="body2" color="text.secondary">
                                            Min support cost: {petition.supportingCost}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={() => viewPetitionDetails(petition.petitionId, "view")}>View Details</Button>
                                    </CardActions>
                                    {showMyPetitions && (
                                        <CardActions>
                                            <IconButton
                                                onClick={() => handleDelete(petition.petitionId)}
                                                aria-label="delete"
                                                disabled={petition.numberOfSupporters > 0}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton onClick={() => viewPetitionDetails(petition.petitionId, "edit")} aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                        </CardActions>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            {error && <div>Error: {error}</div>}
            <Modal open={showModal} onClose={closeModal} aria-labelledby="modal-title" aria-describedby="modal-description">
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                        Confirm Deletion
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to delete this petition?
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={closeModal} sx={{ mr: 2 }}>Cancel</Button>
                        <Button onClick={deletePetition} variant="contained" color="error">Delete</Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="error">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>

            <Snackbar open={isSuccessSnackbarOpen} autoHideDuration={6000} onClose={handleSuccessSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSuccessSnackbarClose} severity="success">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>

        </Container>
    );
};

export default MyPetitions;

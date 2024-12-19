import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, List, ListItem, ListItemText, Typography, TextField, Snackbar, Alert, Tooltip, Tabs, Tab } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

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

interface SupportTier {
    cost: number;
    description: string;
    supportTierId: number;
    title: string;
}

interface Supporter {
    supportId: number;
    supportTierId: number;
    message: string;
    supporterId: number;
    supporterFirstName: string;
    supporterLastName: string;
    timestamp: string;
}

const SpecificPetition = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [categories, setCategories] = useState<number>(-1);
    const [ownerId, setOwnerId] = useState(11);
    const [ownerFirstName, setOwnerFirstName] = useState("");
    const [ownerLastName, setOwnerLastName] = useState("");
    const [numberOfSupporters, setNumberOfSupporters] = useState(100);
    const [creationDate, setCreationDate] = useState("");
    const [description, setDescription] = useState("");
    const [moneyRaised, setMoneyRaised] = useState<number>(0);
    const [supportTiers, setSupportTiers] = useState<SupportTier[]>([]);
    const [supporters, setSupporters] = useState<Supporter[]>([]);
    const [similarPetitions, setSimilarPetitions] = useState<Petition[]>([]);
    const [listCategories, setListCategories] = useState<Array<{ categoryId: number; name: string }>>([]);
    const [selectedTierSupporters, setSelectedTierSupporters] = useState<Supporter[]>([]);
    const [checker, setChecker] = useState<number>(0);
    const [selectedTier, setSelectedTier] = useState('');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const [selectedTierId, setSelectedTierId] = useState<number | null>(null);
    const [supportMessage, setSupportMessage] = useState('');
    const [openSupportDialog, setOpenSupportDialog] = useState(false);
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const path ="http://localhost:4941"

    const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        const fetchPetition = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}`).then((response) => {
                const petitionData = response.data;
                setTitle(petitionData.title);
                setCategories(petitionData.categoryId);
                setOwnerId(petitionData.ownerId);
                setOwnerFirstName(petitionData.ownerFirstName);
                setOwnerLastName(petitionData.ownerLastName);
                setNumberOfSupporters(petitionData.numberOfSupporters);
                setCreationDate(petitionData.creationDate);
                setDescription(petitionData.description);
                setMoneyRaised(petitionData.moneyRaised);
                setSupportTiers(petitionData.supportTiers);
            }, (error) => {
                setSnackbarMessage(error.response.data.message);
                setErrorSnackbarOpen(true);
            });
        };
    
        const fetchSupporters = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}/supporters`).then((response) => {
                setSupporters(response.data);
            }, (error) => {
                setSnackbarMessage(error.response.data.message);
                setErrorSnackbarOpen(true);
            });
        };

        
        fetchPetition();
        fetchSupporters();
        getCategories();
    }, [id]);

    useEffect(() => {
        const fetchPetition = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}`).then((response) => {
                const petitionData = response.data;
                setTitle(petitionData.title);
                setCategories(petitionData.categoryId);
                setOwnerId(petitionData.ownerId);
                setOwnerFirstName(petitionData.ownerFirstName);
                setOwnerLastName(petitionData.ownerLastName);
                setNumberOfSupporters(petitionData.numberOfSupporters);
                setCreationDate(petitionData.creationDate);
                setDescription(petitionData.description);
                setMoneyRaised(petitionData.moneyRaised);
                setSupportTiers(petitionData.supportTiers);
            }, (error) => {
                setSnackbarMessage(error.response.data.message);
                setErrorSnackbarOpen(true);
            });
        };
    
        const fetchSupporters = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}/supporters`).then((response) => {
                setSupporters(response.data);
            }, (error) => {
                setSnackbarMessage(error.response.data.message);
                setErrorSnackbarOpen(true);
            });
        };

        
        fetchPetition();
        fetchSupporters();
    }, [checker, id]);

    useEffect(() => {

        const fetchSimilarPetitions = () => {
            
            axios.get(`http://localhost:4941/api/v1/petitions?categoryIds=${categories}`).then((response) => {
                let petitions = [];
                if (id) {
                    petitions = response.data.petitions.filter((petition: Petition) => petition.petitionId !== parseInt(id));
                }
                setSimilarPetitions(petitions);
            }, (error) => {
            });

            axios.get(`http://localhost:4941/api/v1/petitions?ownerId=${ownerId}`).then((response) => {
                let newPetitions: Petition[] = [];
                if (id) {
                    newPetitions = response.data.petitions.filter((petition: Petition) => petition.petitionId !== parseInt(id));
                }

                setSimilarPetitions((prevPetitions) => [...prevPetitions, ...newPetitions]);
            });
        };

        fetchSimilarPetitions();

    }, [categories, id, ownerId]);

    const getCategories = () => {
        axios.get('http://localhost:4941/api/v1/petitions/categories').then((response) => {
            setListCategories(response.data);
        }, (error) => {
            console.error('Error fetching petitions:', error);
        });
    };

    const getCategory = (id: number) => {
        const category = listCategories.find((category: { categoryId: number; }) => category.categoryId === id);
        return category ? category.name : undefined;
    };

    const isTierSupportedByUser = (tierId: number) => {
        const specificId = parseInt(Cookies.get('id') || '');
        return supporters.some(supporter => supporter.supportTierId === tierId && supporter.supporterId === specificId);
    };

    const handleOpenSupportDialog = (tierId: number) => {
        setSelectedTierId(tierId);
        const selectedTier = supportTiers.find(tier => tier.supportTierId === tierId);
        if (selectedTier) {
            setSelectedTier(selectedTier.title);
        }
        if (!Cookies.get('X-Authorization')) {
            navigate('/users/login');
        }
        setOpenSupportDialog(true);
    };

    const handleCloseSupportDialog = () => {
        setOpenSupportDialog(false);
    };

    const handleSupportSubmit = () => {
        handleCloseSupportDialog();
        if (supportMessage !== '') {
            axios.post(`http://localhost:4941/api/v1/petitions/${id}/supporters`, { supportTierId: selectedTierId, message: supportMessage }, { headers: { 'X-Authorization': Cookies.get('X-Authorization') } }).then((response) => {
                setSuccessSnackbarOpen(true);
                setSnackbarMessage("supported!");
                setChecker(checker + 1);
                setSupportMessage('')
            }, (error) => {
                console.error('Error supporting petitions:', error);
            });
        } else {
            axios.post(`http://localhost:4941/api/v1/petitions/${id}/supporters`, { supportTierId: selectedTierId }, { headers: { 'X-Authorization': Cookies.get('X-Authorization') } }).then((response) => {
                setSuccessSnackbarOpen(true);
                setSnackbarMessage("supported!");
                setChecker(checker + 1);
            }, (error) => {
                console.error('Error supporting petitions:', error);
            });
        }
    };

    const viewPetitionDetails = (petitionId: number) => {
        window.location.href = `http://localhost:8080/Petitions/${petitionId}`;
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

    const handleModalOpen = (tierId: number) => {
        const tierSupporters = supporters.filter(supporter => supporter.supportTierId === tierId);
        const selectedTier = supportTiers.find(tier => tier.supportTierId === tierId);
        if (selectedTier) {
            setSelectedTier(selectedTier.title);
        }
        setSelectedTierSupporters(tierSupporters);
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const getImagePetition = (id: string | undefined) =>{
        if(id){
            const imageUrl = path + `/api/v1/petitions/${parseInt(id)}/image`;
            return imageUrl ? imageUrl : 'https://via.placeholder.com/150';
        }
    }

    const getImageUser = (id: number) =>{
        const imageUrl = path + `/api/v1/users/${id}/image`;
        // Check if image URL exists, if not, return a placeholder image URL
        return imageUrl ? imageUrl : 'https://via.placeholder.com/150';
    }


    return (
        <Box p={4}>
            <Card sx={{ margin: "auto", width: "50%", marginBottom: 4 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title={`Number of supporters: ${numberOfSupporters}`} arrow>
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                        </Tooltip>
                        <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>{numberOfSupporters} supporters</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title={moneyRaised ? `total money raised $${moneyRaised}` : "total money raised $0" } arrow>
                            <Avatar>
                                <MonetizationOnIcon />
                            </Avatar>
                        </Tooltip>
                        <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>{moneyRaised ? `$${moneyRaised} dollars raised` : "$0" }</Typography>
                    </Box>
                </Box>
                <Avatar src={getImagePetition(id)} sx={{ margin: "auto", width: 200, height: 200 }} alt="Petition Image" />  
                <Typography variant="h2" >{title}</Typography>              
                <Typography variant="body2" gutterBottom>{getCategory(categories)}</Typography>
                <Typography gutterBottom>About: {description}</Typography>
                <Typography gutterBottom>Created on {formatDate(creationDate)}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginLeft:'20%' }}>
                    <Avatar src={getImageUser(ownerId)} sx={{ marginLeft: "30%", marginRight:"5px", alignItems:"center"}} />
                    <Typography variant="body2" color="text.secondary">{ownerFirstName} {ownerLastName}</Typography>
                </Box>
            </CardContent>
            </Card>

            <Divider sx={{ my: 2 }} />

            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="fullWidth"
                centered
                sx={{ marginTop: '2rem' }}
            >
                <Tab label="Support Tiers" />
                <Tab label="Similar Petitions" />
            </Tabs>

            {selectedTab === 0 && (
            <Grid container spacing={3}>
                {supportTiers.map(tier => (
                    <Grid item key={tier.supportTierId} xs={12} sm={6} md={4} sx={{ height: '100%' }}>
                        <Card sx={{ height: '100%', marginTop: "5%"}}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                    <Tooltip title={`Cost $${tier.cost}`} arrow>
                                        <Avatar>
                                            <MonetizationOnIcon />
                                        </Avatar>
                                    </Tooltip>
                                    <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                                        {tier.cost ? `Cost $${tier.cost}` : "Free" }
                                    </Typography>
                                </Box>
                                <Typography variant="h5" component="h2">
                                    {tier.title}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {tier.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                                {supporters.filter(supporter => supporter.supportTierId === tier.supportTierId).length > 0 ? (
                                    <Button size="small" onClick={() => handleModalOpen(tier.supportTierId)}>View Supporters</Button>
                                ) : (
                                    <Typography>No supporters</Typography>
                                )}
                                <Button size="small" disabled={isTierSupportedByUser(tier.supportTierId)} onClick={() => handleOpenSupportDialog(tier.supportTierId)}>
                                    {Cookies.get('id') !== ownerId.toString() ? 'Support this tier' : ''}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )}

    {selectedTab === 1 && (
        <Grid container>
            {similarPetitions.length === 0 ? (
                <Grid>
                    <Typography style={{ margin: "3%"}}variant="body1">No similar petitions found...</Typography>
                </Grid>
            ) : (
                similarPetitions.map(petition => (
                    <Grid item lg={3} xs={12} sm={6} xl={3} style={{ paddingLeft: "4vw" }} key={petition.petitionId}>
                        <Card sx={{ maxWidth: 345, marginBottom: 2, marginTop: 3 }}>
                            <CardContent>
                                <img src={`http://localhost:4941/api/v1/petitions/${petition.petitionId}/image`} style={{ display: 'flex', objectFit: 'cover', justifyContent: 'center', alignItems: 'center', height: "32vh" }} alt="Profile" />
                                <Typography gutterBottom variant="h5" component="div">
                                    {petition.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Creation Date: {formatDate(petition.creationDate)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Categories: {getCategory(petition.categoryId)}
                                </Typography>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft:'20%' }}>
                                        <Avatar src={getImageUser(petition.ownerId)} sx={{ marginLeft: "30%", marginRight:"5px", alignItems:"center"}} />
                                        <Typography variant="body2" color="text.secondary">{petition.ownerFirstName} {petition.ownerLastName}</Typography>
                                    </Box>
                                </div>
                                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                                        {numberOfSupporters} supporters
                                    </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Support cost: {petition.supportingCost}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => viewPetitionDetails(petition.petitionId)}>View Details</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    )}


            <Dialog open={openModal} onClose={handleModalClose}>
                    <DialogTitle>Supporters for {selectedTier}:</DialogTitle>
                    <DialogContent>
                        <List>
                            {selectedTierSupporters.map(supporter => (
                                <ListItem key={supporter.supportId}>
                                    <Avatar 
                                        src={`http://localhost:4941/api/v1/users/${supporter.supporterId}/image`} 
                                        sx={{ marginRight: '8px' }} // Adding margin to the right of the avatar
                                    />
                                    <ListItemText 
                                        primary={`${supporter.supporterFirstName} ${supporter.supporterLastName}`} 
                                        secondary={`${supporter.message || "No message"}  ${new Date(supporter.timestamp).toLocaleDateString()}`} // Display message or "No message" along with date
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModalClose} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openSupportDialog} onClose={handleCloseSupportDialog}>
                    <DialogTitle>Support {selectedTier} Tier</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="support-message"
                            label="Support Message (optional)"
                            type="text"
                            fullWidth
                            value={supportMessage}
                            onChange={(e) => setSupportMessage(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseSupportDialog} color="primary">Cancel</Button>
                        <Button onClick={handleSupportSubmit} color="primary">Support</Button>
                    </DialogActions>
                </Dialog>

            <Snackbar open={successSnackbarOpen} autoHideDuration={6000} onClose={() => setSuccessSnackbarOpen(false)}>
                <Alert onClose={() => setSuccessSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={() => setErrorSnackbarOpen(false)}>
                <Alert onClose={() => setErrorSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SpecificPetition;

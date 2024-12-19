import axios from 'axios';
import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Box, Button, Card, CardActions, CardContent, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Snackbar, TextField, Tooltip, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Add, Delete, Edit } from '@mui/icons-material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';


interface SupportTier {
    supportTierId: number,
    cost: number;
    description: string;
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

const EditPetition = () => {
    const { id } = useParams();
    const [title, setTitle] = React.useState("");
    const [categories, setCategories] = React.useState<number | ''>('');
    const [description, setDescription] = React.useState("");
    const [supportTiers, setSupportTiers] = React.useState<SupportTier[]>([]);
    const [supporters, setSupporters] = React.useState<Supporter[]>([]);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editTier, setEditTier] = React.useState<SupportTier | null>(null);
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const navigate = useNavigate();
    const [isNewTierModalOpen, setIsNewTierModalOpen] = React.useState(false);
    const [newTier, setNewTier] = React.useState<SupportTier>({ supportTierId: 0, cost: 0, description: '', title: '' });
    const [listCategories, setListCategories] = React.useState<Array<{ categoryId: number; name: string }>>([]);
    const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = React.useState(false);
    const [checker, setChecker] = React.useState(1);

    React.useEffect(() => {
        const fetchPetition = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}`).then((response) => {
                
                const petitionData = response.data;
                
                if (String(petitionData.ownerId) !== String(Cookies.get('id'))) {
                    navigate('/users/login')
                }

                setTitle(petitionData.title);
                setCategories(petitionData.categoryId);
                setDescription(petitionData.description);
                setSupportTiers(petitionData.supportTiers)
            }, (error) => {
                navigate("/my-petitions")
            })
        };

        const fetchSupporters= () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}/supporters`).then((response) => {
                const supporters = response.data;
                setSupporters(supporters)
            }, (error) => {
                setErrorMessage(error.response.data.message);
            })
        };

        fetchPetition();
        getCategories();
        fetchSupporters();
    }, [id, navigate]);

    const fetchSupportTiers = () => {
        axios.get(`http://localhost:4941/api/v1/petitions/${id}`).then((response) => {
            const petitionData = response.data;
            setSupportTiers(petitionData.supportTiers)
        }, (error) => {
            setErrorMessage(error.response.data.message);
        })
    };

    React.useEffect(() => {
        const fetchSupportTiers = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}`).then((response) => {
                const petitionData = response.data;
                setSupportTiers(petitionData.supportTiers)
            }, (error) => {
                setErrorMessage(error.response.data.message);
            })
        };
        fetchSupportTiers();
    }, [id, checker]);

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        axios.patch(`http://localhost:4941/api/v1/petitions/${id}`, { title: title, description: description, categoryId: Number(categories), }, { headers: { 'X-Authorization': Cookies.get('X-Authorization') } }).then((response) => {
            
            setSnackbarMessage("Changes saved");
            setIsSuccessSnackbarOpen(true);
            return;
        })
    
    };

    const isEditDisabled = (tierId: number) => {
        const supportersForTier = supporters.filter(supporter => supporter.supportTierId === tierId);
        return supportersForTier.length > 0;
    };
    
    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };

    const handleSuccessSnackbarClose = () => {
        setIsSuccessSnackbarOpen(false);
    };

    const handleDelete = (tierId: number) => {
        axios.delete(`http://localhost:4941/api/v1/petitions/${id}/supportTiers/${tierId}`, { headers: { 'X-Authorization': Cookies.get('X-Authorization') } }).then((response) => {
            const updatedSupportTiers = supportTiers.filter(tier => tier.supportTierId !== tierId);
            setSnackbarMessage("tier deleted");
            setIsSuccessSnackbarOpen(true);
            setSupportTiers(updatedSupportTiers);
        }).catch((error) => {
            setSnackbarMessage(error.response.statusText);
            setIsSnackbarOpen(true);
        });
    };

    const getCategories = () => {
        axios.get('http://localhost:4941/api/v1/petitions/categories')
            .then((response) => {
                setListCategories(response.data);
            })
            .catch((error) => {
                setSnackbarMessage(error);
                setIsSnackbarOpen(true);
            });
    };

    const openEditModal = (tier: SupportTier, index: number) => {
        setEditTier(tier);
        setEditIndex(index);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditTier(null);
        setEditIndex(null);
    };

    
    const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: keyof SupportTier) => {
        if (editTier) {
            if (fieldName === 'cost') {
                // Convert the value to a number
                const costValue = parseInt(event.target.value, 10);
                setEditTier({ ...editTier, [fieldName]: costValue } as SupportTier);
            } else {
                // For other fields, directly set the value
                setEditTier({ ...editTier, [fieldName]: event.target.value } as SupportTier);
            }
    
            const updatedTiers = supportTiers.map((tier, index) => {
                if (index === editIndex) {
                    return { ...tier, [fieldName]: event.target.value } as SupportTier;
                }
                return tier;
            });
            setSupportTiers(updatedTiers);
        }
    };

    const openNewTierModal = () => {
        setIsNewTierModalOpen(true);
    };

    const handleNewTierModalClose = () => {
        setIsNewTierModalOpen(false);
        setNewTier({ supportTierId: 0, cost: 0, description: '', title: '' });
    };

    const handleNewTierChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: keyof SupportTier) => {
        setNewTier({ ...newTier, [fieldName]: event.target.value });
    };

    const saveEditedTier = () => {
        if (editIndex !== null && editTier) {
            axios.patch(`http://localhost:4941/api/v1/petitions/${id}/supportTiers/${editTier.supportTierId}`, editTier, {headers: { 'X-Authorization': Cookies.get('X-Authorization') }}).then((response) => {
                // Update local state with edited data
                const updatedTiers = supportTiers.map((tier, index) => {
                    if (index === editIndex) {
                        return editTier;
                    }
                    return tier;
                });
                setSupportTiers(updatedTiers);
                setChecker(checker * -1)
                handleModalClose();

            }).catch((error) => {
                setSnackbarMessage(error.response.statusText);
                setIsSnackbarOpen(true);
            });
        }
    };
    

    const saveNewTier = () => {
        const newTierData = { ...newTier, cost: parseInt(newTier.cost.toString(), 10) };
        axios.put(`http://localhost:4941/api/v1/petitions/${id}/supportTiers`, newTierData, { headers: { 'X-Authorization': Cookies.get('X-Authorization') } }).then((response) => {
            // Fetch the updated list of support tiers after successfully adding a new tier
            fetchSupportTiers();
            handleNewTierModalClose();
        }).catch((error) => {
            setSnackbarMessage(error.response.statusText);
            setIsSnackbarOpen(true);
        });
    };

    const handleInputChange = (event: { target: { value: any; }; }) => {
        setTitle(event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
            <Box sx={{ margin: '20px'}}>
                <Card sx={{ padding: '50px', marginTop: "70px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                    <Typography variant="h1">Edit Petition</Typography>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ marginBottom: '20px' }}>
                            <TextField
                                label="Title"
                                name="title"
                                value={title}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ marginBottom: '20px' }}>
                            <TextField
                                label="Description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={4}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ marginBottom: '20px' }}>
                            <FormControl fullWidth required>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="category-select"
                                    value={categories}
                                    label="Category"
                                    name="categoryId"
                                    
                                >
                                    {listCategories.map((category) => (
                                        <MenuItem key={category.categoryId} value={category.categoryId}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    
                        <Button onClick={() => handleSubmit} type="submit" variant="contained" color="primary" sx={{ marginLeft: '10px', marginTop: '10px' }}>
                            Update petition
                        </Button>
                        
                    </form>
                    {errorMessage && <Typography color="error">Error: {errorMessage}</Typography>}
                </Card>
                {supportTiers.length >= 3 ? (
                    <Tooltip title="You can't add more than three support tiers">
                        <span>
                            <Button disabled variant="contained" color="primary" sx={{ marginLeft: '10px', marginTop: '10px' }}>
                                Add Support Tier
                            </Button>
                        </span>
                    </Tooltip>
                ) : (
                    <Button onClick={openNewTierModal} startIcon={<Add />} variant="contained" color="primary" sx={{ marginLeft: '10px', marginTop: '10px' }}>
                        Add Support Tier
                    </Button>
                )}
                <Grid  sx={{ width: '100%' }} display="flex">

                {supportTiers.map(tier => (
                    <Grid item key={tier.supportTierId} xs={12} sx={{ marginBottom: '20px' }}>
                        <Card sx={{ height: '100%' }}>
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
                            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Button onClick={() => openEditModal(tier, tier.supportTierId)} startIcon={<Edit />} disabled={isEditDisabled(tier.supportTierId)} >Edit</Button>
                                {supportTiers.length > 1 ? (
                                    <Button onClick={() => handleDelete(tier.supportTierId)} disabled={isEditDisabled(tier.supportTierId)} startIcon={<Delete />}>Delete</Button>
                                ) : (
                                    <Button disabled startIcon={<Delete />}>Delete</Button>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                </Grid>
            </Box>

            <Modal open={isModalOpen} onClose={handleModalClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400,  bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography variant="h6" component="h2">Edit Support Tier</Typography>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label="Title"
                            value={editTier?.title || ''}
                            onChange={(e) => handleEditChange(e, 'title')}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            value={editTier?.description || ''}
                            onChange={(e) => handleEditChange(e, 'description')}
                            fullWidth
                            required
                            multiline
                            rows={4}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Cost"
                            type="number"
                            value={editTier?.cost !== undefined && editTier?.cost !== null ? editTier.cost : ''}
                            onChange={(e) => handleEditChange(e, 'cost')}
                            fullWidth
                            required
                            sx={{ mt: 2 }}
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleModalClose} variant="outlined" color="primary" sx={{ mr: 2 }}>
                                Cancel
                            </Button>
                            <Button onClick={saveEditedTier} variant="contained" color="primary">
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <Modal open={isNewTierModalOpen} onClose={handleNewTierModalClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography variant="h6" component="h2">Add New Support Tier</Typography>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label="Title"
                            value={newTier.title}
                            onChange={(e) => handleNewTierChange(e, 'title')}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            value={newTier.description}
                            onChange={(e) => handleNewTierChange(e, 'description')}
                            fullWidth
                            required
                            multiline
                            rows={4}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Cost"
                            type="number"
                            value={newTier.cost}
                            onChange={(e) => handleNewTierChange(e, 'cost')}
                            fullWidth
                            required
                            sx={{ mt: 2 }}
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleNewTierModalClose} variant="outlined" color="primary" sx={{ mr: 2 }}>
                                Cancel
                            </Button>
                            <Button onClick={saveNewTier} variant="contained" color="primary" >
                                Save
                            </Button>
                        </Box>
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
        </Box>

    );
}

export default EditPetition;
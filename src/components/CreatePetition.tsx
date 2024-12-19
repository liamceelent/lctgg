import axios from 'axios';
import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Grid, IconButton, Snackbar, TextField, Typography, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material'; import { Add, Delete } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 

interface SupportTier {
    title: string;
    description: string;
    cost: number;
}


const CreatePetition = () => {
    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        categoryId: '', 
        supportTiers: [{ title: '', description: '', cost: 0 }],
    });

    const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [errorMessage, setError] = React.useState<string | null>(null);
    const navigate = useNavigate();
    const [listCategories, setListCategories] = React.useState<Array<{ categoryId: number; name: string }>>([]);
    const [image, setImage] = React.useState<File>();
    const [fileName, setFileName] = React.useState(''); 

    React.useEffect(() => {
        if (!Cookies.get('id')) {
            navigate("/");
        }
        getCategories();
    }, [navigate]);

    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        const parsedValue = name === 'categoryId' ? parseInt(value, 10) : value;
        setFormData({ ...formData, [name]: parsedValue });
    };

    const handleTierChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, fieldName: keyof SupportTier) => {
        const { value } = event.target;
        const updatedTiers = [...formData.supportTiers];
        const parsedValue = fieldName === 'cost' ? parseInt(value, 10) : value;
        updatedTiers[index][fieldName] = parsedValue as never; // Assert the value to 'never'
        setFormData({ ...formData, supportTiers: updatedTiers });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        
        if (!formData.title || !formData.description || !formData.categoryId || !image) {
            setSnackbarMessage("Please fill in all fields and select an image.");
            setIsSnackbarOpen(true);
            return;
        }
        axios.post('http://localhost:4941/api/v1/petitions', formData, { headers: { 'X-Authorization': Cookies.get('X-Authorization') } }).then((response) => {
            const petitionID = response.data.petitionId
            if (image) {
                axios.put(`http://localhost:4941/api/v1/petitions/${petitionID}/image`, image,  {headers: { 'Content-Type': image.type, 'X-Authorization': Cookies.get('X-Authorization') }}).then((response) =>{
                    navigate("/my-petitions")
                }, (error) => {
                    setError(error.response.statusText);
                })
            }
        }, (error) => {
            setSnackbarMessage(error.response.statusText);
            setIsSnackbarOpen(true);
        })
    };

    const addNewTier = () => {
        if (formData.supportTiers.length <= 2) {
            setFormData({ ...formData, supportTiers: [...formData.supportTiers, { title: '', description: '', cost: 0 }] });
        } else {
            setSnackbarMessage("Can only have three support tiers");
            setIsSnackbarOpen(true);
        }
    };

    const handleDelete = (index: number) => {
        const updatedTiers = [...formData.supportTiers];
        updatedTiers.splice(index, 1);
        setFormData({ ...formData, supportTiers: updatedTiers });
    }

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };

    const getCategories = () => {
        axios.get('http://localhost:4941/api/v1/petitions/categories')
            .then((response) => {
                setListCategories(response.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    };

    const handleCategory = (event: SelectChangeEvent<string>) => {
        const categoryId = event.target.value as string;
        setFormData({ ...formData, categoryId: categoryId });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
                setImage(file);
                setFileName(file.name);
            } else {
                setSnackbarMessage("wrong file type, please only .png, .jpeg, .gif");
                setIsSnackbarOpen(true);
            }
        }
    };

    const deleteImage = () => {
        setImage(undefined)
        setFileName('')
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
            <Box sx={{ '& > *': { marginBottom: '20px' } }}>
                <Card sx={{ padding: '45px', marginTop: "100px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                    <Typography variant="h1">Create Petition</Typography>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ marginBottom: '20px' }}>
                            <TextField
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ marginBottom: '20px' }}>
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
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
                                    value={formData.categoryId}
                                    label="Category"
                                    name="categoryId"
                                    onChange={handleCategory}
                                >
                                    {listCategories.map((category) => (
                                        <MenuItem key={category.categoryId} value={category.categoryId}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Grid item xs={6} sx={{marginBottom: "10px"}}>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                color="primary"
                                sx={{ marginTop: '10px' }}
                            >
                                <CloudUploadIcon sx={{mr:"5px"}}/> {fileName || 'Upload Image'}
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png, image/gif"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                            </Button>
                            {image && (
                                <Grid item xs={6} sx={{ marginTop: '10px', marginBottom: "20px"}}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color="error"
                                        onClick={deleteImage}
                                    >
                                        Delete Image
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                        {formData.supportTiers.map((tier, index) => (
                            <Grid container spacing={2} key={index}>
                                <Grid item xs={12} lg={3.7}>
                                    <TextField
                                        label="Title"
                                        value={tier.title}
                                        onChange={(event) => handleTierChange(event, index, 'title')}
                                        fullWidth
                                        required
                                        sx={{ marginTop: '10px' }}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3.7}>
                                    <TextField
                                        label="Description"
                                        value={tier.description}
                                        onChange={(event) => handleTierChange(event, index, 'description')}
                                        fullWidth
                                        required
                                        sx={{ marginTop: '10px' }}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3.7}>
                                    <TextField
                                        label="Cost"
                                        type="number"
                                        value={tier.cost}
                                        onChange={(event) => handleTierChange(event, index, 'cost')}
                                        fullWidth
                                        required
                                        sx={{ marginTop: '10px' }}
                                    />
                                </Grid>

                                
                                <Grid item xs={12} lg={0.9} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton disabled={formData.supportTiers.length <= 1} onClick={() => handleDelete(index)}>
                                        <Delete />
                                    </IconButton>
                                </Grid>
                                
                            </Grid>
                        ))}
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            disabled={formData.supportTiers.length >= 3}
                            onClick={addNewTier}
                            sx={{ marginTop: '10px' }}
                        >
                            Add Tier
                        </Button>
                        <Button onClick={handleSubmit} type="submit" variant="contained" color="primary" sx={{ marginLeft: '10px', marginTop: '10px' }}>
                            Create Petition
                        </Button>
                    </form>
                    {errorMessage && <Typography color="error">Error: {errorMessage}</Typography>}
                </Card>
            </Box>

            <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="error">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Box>

    );
}

export default CreatePetition;
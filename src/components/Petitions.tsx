import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Box, Button, Card, CardActions, CardContent, Grid, InputAdornment, MenuItem, TextField, Typography, Pagination, Autocomplete, Checkbox } from '@mui/material';

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

interface Category {
    categoryId: number;
    name: string;
}

const Petitions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPetitions, setFilteredPetitions] = useState<Petition[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [maxSupportingCost, setMaxSupportingCost] = useState<number>(0);
    const [sortOption, setSortOption] = useState<string>('CREATED_ASC');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPetitions, setTotalPetitions] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [listCategories, setListCategories] = useState<Category[]>([]);
    const path ="http://localhost:4941";
    const [disableMaxSupportingCost, setDisableMaxSupportingCost] = useState<boolean>(false); 

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleCategoryChange = (event: React.ChangeEvent<{}>, value: Category[]) => {
        setCategories(value);
    };

    const handleDisableMaxSupportingCost = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        if (disableMaxSupportingCost && !isChecked) {
            setMaxSupportingCost(0);
        } else if (!disableMaxSupportingCost && isChecked) {
            setMaxSupportingCost(-1);
        }
        setDisableMaxSupportingCost(isChecked);
    };
    const searchPetitions = () => {
        const params: any = {};

        if (searchQuery) {
            params.q = searchQuery.toLowerCase();
        }
        if (categories.length > 0) {
            params.categoryIds = categories.map(category => category.categoryId); // Change here
        }
        const defaultCost = 0;

        if (isNaN(maxSupportingCost)) {
            params.supportingCost = defaultCost;
        } else {
            params.supportingCost = maxSupportingCost;
        }

        params.sortBy = sortOption;
        console.log(params)
        axios.get('http://localhost:4941/api/v1/petitions', { params }).then((response) => {
            setTotalPetitions(response.data.count);
            setFilteredPetitions(response.data.petitions);
            const newTotalPages = Math.ceil(response.data.count / pageSize);
            setTotalPages(newTotalPages);
        }).catch((error) => {
            setError(error.response.data.message);
        });
    };

    const handleMaxSupportingCostChange = (event: string) => {
        setMaxSupportingCost(event as unknown as number);
    };

    const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSortOption(event.target.value as string);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleEndChange = (page: number) => {
        setCurrentPage(page);
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

    const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPageSize(event.target.value as number);
    };

    useEffect(() => {
        const fetchPetitions = () => {
            axios.get('http://localhost:4941/api/v1/petitions').then((response) => {
                setTotalPetitions(response.data.count);
                setFilteredPetitions(response.data.petitions);
                const newTotalPages = Math.ceil(response.data.count / pageSize);
                setTotalPages(newTotalPages);
            }).catch((error) => {
                console.error('Error fetching petitions:', error);
            });
        };
    
        fetchPetitions();
        getCategories();
    }, [pageSize]);

    useEffect(() => {
        const newTotalPages = Math.ceil(filteredPetitions.length / pageSize);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            handleEndChange(newTotalPages);
        }
    }, [filteredPetitions, currentPage, pageSize, maxSupportingCost]);

    useEffect(() => {

        console.log("test")
        const searchPetitions = () => {
            const params: any = {};
            
            if (searchQuery) {
                params.q = searchQuery.toLowerCase();
            }
            if (categories.length > 0) {
                params.categoryIds = categories.map(category => category.categoryId); // Change here
            }
    
            if (maxSupportingCost !== -1 ) {
                params.supportingCost = maxSupportingCost;
            }
            
            params.sortBy = sortOption;
            
            axios.get('http://localhost:4941/api/v1/petitions', { params }).then((response) => {
                setTotalPetitions(response.data.count);
                setFilteredPetitions(response.data.petitions);
                const newTotalPages = Math.ceil(response.data.count / pageSize);
                setTotalPages(newTotalPages);
            }).catch((error) => {
                setError(error.response.data.message);
            });
        };
        searchPetitions();
    }, [searchQuery, categories, maxSupportingCost, sortOption, currentPage, pageSize]);

    const viewPetitionDetails = (petitionId: number) => {
        window.location.href = `http://localhost:8080/Petitions/${petitionId}`;
    };

    const getCategories = () => {
        axios.get('http://localhost:4941/api/v1/petitions/categories').then((response) => {
            setListCategories(response.data);
        }).catch((error) => {
            console.error('Error fetching petitions:', error);
        });
    };

    const getImage = (id: number) =>{
        return path + `/api/v1/petitions/${id}/image`
    }


    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalPetitions);

    return (
        <div>
            
            <Box sx={{ width: '50%', marginLeft: "25%" }}>
                <Typography variant="h1" gutterBottom>Petitions</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search petitions"
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: '20px' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button onClick={searchPetitions}>Search</Button>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>

                
            <div>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', width: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom></Typography>
                    <Autocomplete
                        multiple
                        disablePortal
                        id="combo-box-demo"
                        options={listCategories}
                        getOptionLabel={(option) => option.name}
                        sx={{ flex: 1 }} 
                        renderInput={(params) =>
                            <TextField {...params} label="Category" />}
                        onChange={handleCategoryChange} 
                    />

                    <TextField
                        select
                        label="Page Size"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        variant="outlined"
                        size="small"
                        sx={{ marginLeft: '10px', width: '150px' }}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                    </TextField>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>Disable Supporting Cost</Typography>
                        <Checkbox
                            checked={disableMaxSupportingCost}
                            onChange={handleDisableMaxSupportingCost}
                        />
                    </Box>
            <TextField
                type="number"
                label="Max Supporting Cost"
                value={maxSupportingCost}
                onChange={(event) => handleMaxSupportingCostChange(event.target.value)}
                variant="outlined"
                fullWidth
                sx={{ marginLeft: '20px', width: '200px' }}
                disabled={disableMaxSupportingCost} 
            />

                </Box>
                <TextField
                    select
                    label="Sort By"
                    value={sortOption}
                    onChange={handleSortChange}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: '20px', width: '100%' }} // Adjusted width
                >
                    <MenuItem value="ALPHABETICAL_ASC">Alphabetical (A-Z)</MenuItem>
                    <MenuItem value="ALPHABETICAL_DESC">Alphabetical (Z-A)</MenuItem>
                    <MenuItem value="COST_ASC">Cost (Low to High)</MenuItem>
                    <MenuItem value="COST_DESC">Cost (High to Low)</MenuItem>
                    <MenuItem value="CREATED_DESC">Creation Date (Newest First)</MenuItem>
                    <MenuItem value="CREATED_ASC">Creation Date (Oldest First)</MenuItem>
                </TextField>
            </div>

        
            </Box>
            <Grid container>
            <Card sx={{ width: '75%', margin: 'auto',  marginTop: '2%', boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <CardContent>
                {filteredPetitions.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                        No results found.
                    </Typography>
                ) : (
                    <Grid container>
                        {filteredPetitions.slice(startIndex, endIndex).map(petition => (
                            <Grid item lg={4} xs={12} sm={6} xl={4} style={{ paddingLeft: "3vw", paddingTop: '2vh'}} key={petition.petitionId}>
                                <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
                                    <CardContent>
                                        <img src={getImage(petition.petitionId)} style={{ display: 'flex', objectFit: 'cover', justifyContent: 'center', alignItems: 'center', height: "32vh" }} alt="Profile" />
                                        <Typography gutterBottom variant="h5" component="div">
                                            {petition.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Creation Date: {formatDate(petition.creationDate)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Category: {getCategory(petition.categoryId)}
                                        </Typography>
                                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20%' }}>
                                            <Avatar src={path +`/api/v1/users/${petition.ownerId}/image`} sx={{ marginRight: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {petition.ownerFirstName} {petition.ownerLastName}
                                            </Typography>
                                        </div>
                                        <Typography variant="body2" color="text.secondary">
                                            Support cost: {petition.supportingCost}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={() => viewPetitionDetails(petition.petitionId)}>View Details</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </CardContent>
        </Card>
            </Grid>
            <div>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' , marginBottom: '10px' }}>
                    <div>
                        <Button onClick={() => handleEndChange(1)} disabled={currentPage === 1}>
                            First
                        </Button>
                    </div>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        siblingCount={1}
                        boundaryCount={1}
                        variant="outlined"
                        shape="rounded"
                    />
                    <div>
                    <Button
                        onClick={() => handleEndChange(totalPages)}
                        disabled={currentPage === totalPages || totalPetitions === 0}
                    >
                        Last
                    </Button>
                    </div>
                </Box>
            </div>
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default Petitions;

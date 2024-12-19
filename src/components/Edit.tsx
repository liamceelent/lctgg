import axios from 'axios';
import React from 'react';
import Cookies from 'js-cookie';
import {useNavigate, useParams } from "react-router-dom";
import { Avatar, Box, Button, Card, Container, Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Edit = () => {
    const { id } = useParams();
    const [Lname, setLname] = React.useState('');
    const [Fname, setFname] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState<string>('');
    const [retypePassword, setRetypePassword] = React.useState<string>('');
    const [image, setImage] = React.useState<File>();
    const [fileName, setFileName] = React.useState(''); 
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const navigate = useNavigate();
    const [isDefaultAvatar, setIsDefaultAvatar] = React.useState(true);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showPassword2, setShowPassword2] = React.useState(false);

    React.useEffect(() => {
        if(Cookies.get('id') !== id){
            navigate(`/users/login`);
        }

        const fetchUserProfile = async () => {
            axios.get(`http://localhost:4941/api/v1/users/${id}`, {headers: {'X-Authorization': Cookies.get('X-Authorization')}}).then((response) =>{
                
                setLname(response.data.lastName);
                setEmail(response.data.email)
                setFname(response.data.firstName);
                axios.get(`http://localhost:4941/api/v1/users/${id}/image`, {headers: {'X-Authorization': Cookies.get('X-Authorization')}}).then((response) =>{
                    setIsDefaultAvatar(false)
                }, (error) => {
                    setIsDefaultAvatar(true)
                })
            }, (error) => {
                setSnackbarMessage(error.response.statusText);
                setSnackbarOpen(true);
            })
        };
        fetchUserProfile();
    }, [navigate, id]);

    const deleteImage = () => {
        setImage(undefined)
        setFileName('')
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if(retypePassword !== '' && password === ''){
            setSnackbarMessage('please supply both old and new password');
            setSnackbarOpen(true);
        }
        else if(password !== '' && retypePassword !== ''){
            axios.patch(`http://localhost:4941/api/v1/users/${id}`, {lastName: Lname ,firstName: Fname , email: email, password: password, currentPassword: retypePassword}, {headers: { 'X-Authorization': Cookies.get('X-Authorization') }}).then((response) =>{
                if (image) {
                    axios.put(`http://localhost:4941/api/v1/users/${id}/image`, image,  {headers: { 'Content-Type': image.type, 'X-Authorization': Cookies.get('X-Authorization') }}).then((response) =>{
                        setSnackbarMessage('Details updated successfully');
                        setSnackbarOpen(true);
                        navigate(`/users/${id}`);
                    }, (error) => {
                        setSnackbarMessage(error.response.statusText);
                        setSnackbarOpen(true);
                    })
                }
                setSnackbarMessage('Details updated successfully');
                setSnackbarOpen(true);
                navigate(`/users/${id}`);
            }, (error) => {
                setSnackbarMessage(error.response.statusText);
                setSnackbarOpen(true);
            })
        } else {

            axios.patch(`http://localhost:4941/api/v1/users/${id}`, {lastName: Lname ,firstName: Fname , email: email}, {headers: { 'X-Authorization': Cookies.get('X-Authorization') }}).then((response) =>{
                if (image) {
                    axios.put(`http://localhost:4941/api/v1/users/${id}/image`, image,  {headers: { 'Content-Type': image.type, 'X-Authorization': Cookies.get('X-Authorization') }}).then((response) =>{
                        setSnackbarMessage('Details updated successfully');
                        setSnackbarOpen(true);
                        window.location.href = `http://localhost:8080/users/${id}`
                    }, (error) => {
                        setSnackbarMessage(error.response.statusText);
                        setSnackbarOpen(true);
                    })
                }
                setSnackbarMessage('Details updated successfully');
                setSnackbarOpen(true);
                navigate(`/users/${id}`);
            }, (error) => {
                setSnackbarMessage(error.response.statusText);
                setSnackbarOpen(true);
            })
        }
    };

    const handleLastNameChange = (event: { target: { value: any; }; }) => {
        setLname(event.target.value);
    };

    const handleFirstNameChange = (event: { target: { value: any; }; }) => {
        setFname(event.target.value);
    };

    const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(event.target.value);
    };

    const handleRetypePasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setRetypePassword(event.target.value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
                
                setImage(file);
                setFileName(file.name)
            }else {
                setSnackbarMessage("wrong file type, please only .png, .jpeg, .gif");
                setSnackbarOpen(true);
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleClose = () => {
        navigate(`/users/${id}`)
    };

    const handleDeleteImage = () => {
        axios.delete(`http://localhost:4941/api/v1/users/${id}/image`, {headers: {'X-Authorization': Cookies.get('X-Authorization')}}).then((response) =>{
            setIsDefaultAvatar(true)
            console.log("test")
            window.location.href = `http://localhost:8080/users/edit/${id}`
        }, (error) => {
            setIsDefaultAvatar(false)
        })
    }

    return (
        <Container sx={{marginTop: "5%"}}>
            <Card sx={{width: "50%", margin: "auto", padding: "5%", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Typography variant="h4">Edit Profile</Typography>
                    
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Avatar src={`http://localhost:4941/api/v1/users/${id}/image`} sx={{ width: 150, height: 150, margin: 'auto' }} />

                {!isDefaultAvatar && (
                    <Button variant="contained"  onClick={handleDeleteImage} sx={{ marginTop: '1rem' }}>Delete Profile Picture</Button>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="First Name"
                        value={Fname}
                        onChange={handleFirstNameChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                    label="Last Name"
                    value={Lname}
                    onChange={handleLastNameChange}
                    fullWidth
                    margin="normal"
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        fullWidth
                        margin="normal"
                        autoComplete="username"
                    />
                    <TextField
                        label="Old Password"
                        type={showPassword2 ? 'text' : 'password'} 
                        value={retypePassword}
                        onChange={handleRetypePasswordChange}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={togglePasswordVisibility2} sx={{ p: 0 }}>
                                    {showPassword2 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </Button>
                            )
                        }}
                        fullWidth
                        margin="normal"
                        autoComplete="new-password"
                    />
                    <TextField
                        label="New Password"
                        type={showPassword ? 'text' : 'password'} 
                        value={password}
                        onChange={handlePasswordChange}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <Button onClick={togglePasswordVisibility} sx={{ p: 0 }}>
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </Button>
                            )
                        }}
                        margin="normal"
                        autoComplete="new-password"
                    />
                    
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                color="primary"
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
                                <Button
                                    variant="contained"
                                    fullWidth
                                    color="error"
                                    onClick={deleteImage}
                                    sx={{ marginTop: '10px', marginBottom: "20px"}}
                                >
                                    Delete Image
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
                        </Grid>
                    </Grid>
                </form>
            </Card>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose}  severity="error">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
            
        </Container>
    );
}

export default Edit;
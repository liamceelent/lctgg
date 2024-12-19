import React from 'react';
import { Container, Card, TextField, Button, Grid, Snackbar, Box } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 

const Register = () => {
    const [data, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        image: ''
    });

    const [image, setImage] = React.useState<File>();
    const [fileName, setFileName] = React.useState(''); 
    const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!checkLogin()) {
            navigate("/");
        }
    });

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };

    const registerUser = () => {
        axios.post('http://localhost:4941/api/v1/users/register', {firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password}).then((response) => {
            axios.post('http://localhost:4941/api/v1/users/login', {email: data.email, password: data.password}).then((response) =>{
                Cookies.set("id", response.data.userId)
                Cookies.set("X-Authorization", response.data.token)
                if (image) {
                    axios.put(`http://localhost:4941/api/v1/users/${Cookies.get('id')}/image`, image,  {headers: { 'Content-Type': image.type, 'X-Authorization': Cookies.get('X-Authorization') }}).then((response) =>{
                        window.location.href = `http://localhost:8080/petitions`
                    })
                } else {
                    window.location.href = `http://localhost:8080/`
                }
            })
        }, (error) => {
            setSnackbarMessage(error.response.statusText);
            setIsSnackbarOpen(true);
        })
    };
 
    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setFormData({ ...data, [name]: value });
    };

    const checkLogin = () => {
        if(Cookies.get('X-Authorization') === undefined){
            return true;
        }
        return false;
    }

    const login = () => {
        navigate("/users/login");
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
    
        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
                setImage(file);
                setFileName(file.name)
            } else {
                setSnackbarMessage("wrong file type, please only .png, .jpeg, .gif");
                setIsSnackbarOpen(true);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const deleteImage = () => {
        setImage(undefined)
        setFileName('')
    }

    
    return (
        <div>
            <Container sx={{ width: "40%", marginTop: "10%"}}>
                <Card sx={{ padding: "5%",  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                    <h1>Register</h1>
                    <TextField
                        label="First Name"
                        type="text"
                        name="firstName"
                        value={data.firstName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <br />
                    <TextField
                        label="Last Name"
                        type="text"
                        name="lastName"
                        value={data.lastName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <br />
                    <TextField
                        label="Email Address"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <br />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'} // Toggle password visibility
                        name="password"
                        value={data.password}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ // Add icon button to toggle password visibility
                            endAdornment: (
                                <Button onClick={togglePasswordVisibility} sx={{ p: 0 }}>
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </Button>
                            )
                        }}
                        sx={{marginBottom:'3%'}}
                        autoComplete='password'
                    />
                    <br />
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
                            <Grid item xs={6} sx={{ marginTop: '10px' }}>
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
                    <Box sx={{marginTop:"5%"}}>
                        <Button onClick={login}>Already have a account?</Button>
                        <Button type="submit" onClick={registerUser} variant="contained" color="primary">Submit</Button>
                    </Box>
                </Card>
            </Container>
            <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="error">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}

export default Register;

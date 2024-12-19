import axios from 'axios';
import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Container, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Login = () => {
    const [data, setFormData] = React.useState({
        email: '',
        password: '',
      });

    const navigate = useNavigate();
    const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    
    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setFormData({ ...data, [name]: value });
    };

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };
    const checkLogin = () => {
        if(Cookies.get('X-Authorization') === undefined){
            return true;
        }
        return false;
    }

    React.useEffect(() => {
        if (!checkLogin()) {
            navigate("/");
        }
    }, [navigate]);

    const loginUser = () => {
        
        axios.post('http://localhost:4941/api/v1/users/login', {email: data.email, password: data.password}).then((response) =>{
            Cookies.set("id", response.data.userId);
            Cookies.set("X-Authorization", response.data.token);
            window.location.href = `http://localhost:8080/`
        }, (error) => {
            setSnackbarMessage(error.response.statusText);
            setIsSnackbarOpen(true);
        })

    };
    
    const createAccount = () => {
        navigate("/users/register");
    }


    return (
        <div>
            <Container sx={{ width: "40%", marginTop: "12%" }}>
                <Card sx={{ padding: "5%", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                    <h1> login</h1>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <TextField
                                label="Email Address"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                autoComplete="email"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <TextField
                                label="Password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                autoComplete="password"
                            />
                            <br />
                        </Box>
                        <Button onClick={createAccount}>create account</Button>
                        <Button type="submit" variant="contained" color="primary" onClick={loginUser}>Submit</Button>
                </Card>
            </Container>
            <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose}  severity="error">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default Login;
import axios from 'axios';
import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Box, Button, Card, Container, Typography } from '@mui/material';


const MyProfile = () => {
    const [Lname, setLname] = React.useState(null);
    const [Fname, setFname] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    React.useEffect(() => {

        if(Cookies.get('id') !== id){
            navigate(`/users/login`);
        }

        const fetchUserProfile = () => {
            
            axios.get(`http://localhost:4941/api/v1/users/${id}`, {headers: {'X-Authorization': Cookies.get('X-Authorization')}}).then((response) =>{
                setLname(response.data.lastName);
                setEmail(response.data.email)
                setFname(response.data.firstName);
            }).catch((error) => {
                console.error('Error fetching petitions:', error);
            });
        }

        fetchUserProfile();
    }, [navigate, id]);

    const goEdit = () =>{
        navigate(`/users/edit/${id}`);
    }

    return (
        <Container sx={{marginTop: "10%"}}>
            <Card sx={{width: "50%", margin: "auto", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                <Box sx={{ textAlign: 'center', padding: "6%"}}>

                    <Avatar src={`http://localhost:4941/api/v1/users/${id}/image`} sx={{ width: 150, height: 150, margin: 'auto' }} />
                    <Typography variant="h3" gutterBottom>
                        {Fname} {Lname}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        {email}
                    </Typography>
                    {id === Cookies.get('id') && (
                        <Button onClick={goEdit} variant="contained" color="primary" sx={{ mt: 2 }}>
                            Edit
                        </Button>
                    )}
                </Box>
            </Card>
        </Container>
    );
}

export default MyProfile;
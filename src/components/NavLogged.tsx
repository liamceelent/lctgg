import React, { useState } from 'react';
import { AppBar, Avatar, Box, Button, Fade, IconButton, Menu, MenuItem, Modal, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NavLogged = () => {
    const [statusMenu, setStatusMenu] = useState<null | HTMLElement>(null);
    const [statusAccount, setStatusAccount] = useState<null | HTMLElement>(null);
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const userId = Cookies.get('id');
    const navigate = useNavigate();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setStatusMenu(event.currentTarget);
    };
    
    const handleClickAccount = (event: React.MouseEvent<HTMLButtonElement>) => {
        setStatusAccount(event.currentTarget);
    };

    const handleMenuClick = (path: string) => {
        navigate(path);
    };

    const handleAccountClose = () => {
        setStatusAccount(null); 
    };

    const handleClose = () => {
        setStatusMenu(null);
    };

    const handleLogout = () => {
        setOpenLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        
        axios.post('http://localhost:4941/api/v1/users/logout',{}, {headers: { 'X-Authorization': Cookies.get('X-Authorization')}}).then((response) =>{
            Cookies.remove("id");
            Cookies.remove("X-Authorization");
            window.location.href = 'http://localhost:8080/';
            setOpenLogoutModal(false);
        })
    };

    const handleLogoutCancel = () => {
        setOpenLogoutModal(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        classes={{ root: 'menu-icon-button' }} // Explicitly specifying classes
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        PetitionHub
                    </Typography>
                    <IconButton
                        classes={{ root: 'account-icon-button' }} // Explicitly specifying classes
                        color="inherit"
                        aria-label="profile"
                        aria-controls="profile-menu"
                        aria-haspopup="true"
                        onClick={handleClickAccount}
                    >
                        <Avatar src={`http://localhost:4941/api/v1/users/${userId}/image`} sx={{ margin: 'auto' }} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Menu
                id="account-menu"
                anchorEl={statusAccount}
                open={Boolean(statusAccount)}
                onClose={handleAccountClose}
            >
                <MenuItem onClick={() => handleMenuClick(`/users/${userId}`)}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            <Menu
                id="menu"
                anchorEl={statusMenu}
                open={Boolean(statusMenu)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuClick("/")}>Home</MenuItem>
                <MenuItem onClick={() => handleMenuClick("/petitions")}>Petitions</MenuItem>
                <MenuItem onClick={() => handleMenuClick("/create-petition")}>Create Petition</MenuItem>
                <MenuItem onClick={() => handleMenuClick("/my-petitions")}>My Petitions</MenuItem>
            </Menu>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openLogoutModal}
                onClose={handleLogoutCancel}
                closeAfterTransition
            >
                <Fade in={openLogoutModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '40%',
                            left: '40%',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            textAlign: 'center',
                        }}
                    >
                        <Typography id="transition-modal-title" variant="h6" component="h2" gutterBottom>
                            Are you sure you want to logout?
                        </Typography>
                        <Button variant="contained" onClick={handleLogoutConfirm} sx={{ mr: 2 }}>
                            Logout
                        </Button>
                        <Button variant="contained" onClick={handleLogoutCancel}>
                            Cancel
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
}

export default NavLogged;

import React, { useState } from 'react';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const NavGuest = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (path: string) => {
        navigate(path);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
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
                    <Button color="inherit" onClick={() => handleMenuClick("/users/login")}>Login</Button>
                    <Button color="inherit" onClick={() => handleMenuClick("/users/register")}>Register</Button>
                </Toolbar>
            </AppBar>
            <Menu
                id="menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuClick("/")}>Home</MenuItem>
                <MenuItem onClick={() => handleMenuClick("/petitions")}>Petitions</MenuItem>
            </Menu>
        </Box>
    );
}

export default NavGuest;

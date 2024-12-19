import React from 'react';
import './App.css';

import NotFound from "./components/NotFound";
import Register from './components/Register';
import Home from './components/Home';
import Login from './components/Login';
import MyProfile from './components/MyProfile';
import Edit from './components/Edit';
import Petitions from './components/Petitions';
import SpecificPetition from './components/SpecificPetition';
import CreatePetition from './components/CreatePetition';
import MyPetitions from './components/MyPetitions';
import EditPetition from './components/EditPetition';
import NavGuest from './components/NavGuest';
import NavLogged from './components/NavLogged';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Cookies from 'js-cookie';
function App() {

  return (
    <div className="App">
      <Router>

        {Cookies.get('X-Authorization') != null ? <NavLogged /> : <NavGuest />}
        
        <div>
          <Routes>
            <Route path="/users/register" element={<Register />} />
            <Route path="/users/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/users/:id" element={<MyProfile />} />
            <Route path="/users/edit/:id" element={<Edit />} />
            <Route path="/petitions" element={<Petitions />} />
            <Route path="/petitions/:id" element={<SpecificPetition />} />
            <Route path="/create-petition" element={<CreatePetition />} />
            <Route path="/my-petitions" element={<MyPetitions />} />
            <Route path="/edit-petition/:id" element={<EditPetition />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;


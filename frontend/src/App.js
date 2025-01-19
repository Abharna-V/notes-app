import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NotesList from "./components/NotesList";

function App() {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null); 

  return (
    <div className="container">
    <Router>
      <Routes>
        <Route path="/" element={<Login users={users} setLoggedInUser={setLoggedInUser}/>}/>
        <Route path="/login" element={<Login users={users} setLoggedInUser={setLoggedInUser} />}/>
        <Route path="/signup" element={<Signup setUsers={setUsers} />}/>
        <Route path="/noteslist" element={<NotesList userId={loggedInUser} />} />
      </Routes>
    </Router>
    </div>
  );
  
}

export default App;

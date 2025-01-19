import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ users, setLoggedInUser }) {
  const navigate = useNavigate();
  const [eemail, setEmail] = useState("");
  const [epassword, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUInput = (e) => {
    setEmail(e.target.value);
  };

  const handlePInput = (e) => {
    setPassword(e.target.value);
  };

  const checkUser = () => {
    const userFound = users.find(
      (user) => user.email === eemail && user.password === epassword
    );

    if (userFound) {
      console.log("Successful");
      setLoggedInUser(userFound.email);
      navigate("/noteslist");
    } else {
      console.log("Failed");
      setErrorMessage("Please Sign Up before login")
    }
  };

  return (
    <div className="login_div">
      <h1>Login</h1>
      {!errorMessage && <p></p>}
      {errorMessage && <p>{errorMessage}</p>}
      <div className="login_input">
        <input
          type="email"
          placeholder="email"
          className="login"
          onChange={handleUInput}
          value={eemail}
        />
        <input
          type="password"
          placeholder="Password"
          className="login"
          onChange={handlePInput}
          value={epassword}
        />
        <button id="login_button" onClick={checkUser} disabled={!eemail || !epassword}>
          Login
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

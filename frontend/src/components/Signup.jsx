import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup({ setUsers }) {
  const navigate = useNavigate();
  const [eemail, setEemail] = useState("");
  const [epassword, setPassword] = useState("");

  const handleUInput = (e) => {
    setEemail(e.target.value);
  };

  const handlePInput = (e) => {
    setPassword(e.target.value);
  };

  const addUser = () => {
    setUsers((prevUsers) => [
      ...prevUsers,
      { email: eemail, password: epassword },
    ]);
    navigate("/");
  };

  return (
    <div className="signup_div">
      <h1>Sign Up</h1>
      <div className="singup_input">
        <input
          type="email"
          placeholder="email"
          className="signup"
          onChange={handleUInput}
          value={eemail}
        />
        <input
          type="password"
          placeholder="Password"
          className="signup"
          onChange={handlePInput}
          value={epassword}
        />
        <button id="signup_button" onClick={addUser} disabled={!eemail || !epassword}>
          Sign Up
        </button>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

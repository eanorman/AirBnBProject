import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleClick = (e) => {
   e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    
  }
  let disabled = false;
  if(credential.length < 4 || password.length < 6) disabled = true;

  return (
    <div className="login-form-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          {errors ? (
            <p className="error">{errors.message}</p>
          ):
          <p className="hidden"></p>}
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or Email"
            required
          />
        </label>
        <label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={disabled}>Log In</button>
      </form>
      <button type='button' className="demo-user" onClick={handleClick}>Demo User</button>
    </div>
  );
}

export default LoginFormModal;

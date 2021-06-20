import React, { useState } from "react";
import { auth } from "../../FireStore";

const SignupComponent = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          userCredential.user.sendEmailVerification();
          alert("An email verification code has been sent to your account");
        })
        .then(() => {
          const user = auth.currentUser;
          user
            .updateProfile({
              displayName: displayName,
            })
            .then(() => {
              console.log("success");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .then(() => {
          setDisplayName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
          // ..
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "displayName") {
      setDisplayName(value);
    }
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  return (
    <div className="sign-up">
      <h2 className="title">I don't have an account</h2>
      <span className="span">Sign Up with your email and password</span>
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div>
          <p>Name</p>
          <input
            type="text"
            name="displayName"
            value={displayName}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Email</p>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div>
          <p>Password</p>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Confirm Password</p>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div>
          <button type="submit" onClick={handleSubmit}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupComponent;

import React, { useState } from "react";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Box, Button, TextField } from "@mui/material";

import { auth, db } from "../firebase-config";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore/lite";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegistration = async () => {
    setLoading(true);
    try {
      if (email === "" || password === "" || displayName === "") {
        alert("Please fill all the fields");
        setLoading(false);
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await Promise.all([
        updateProfile(userCredential.user, { displayName }),
        setDoc(doc(db, "users", userCredential.user.uid), {
          name: displayName,
        }),
      ]);

      alert("Registration successful");

      // const authToken = await userCredential.user.getIdToken();
      // console.log(authToken);
    } catch (error) {
      console.error("Registration error:", error.message);
      alert(error);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "450px",
          border: "1px solid #0000003b",
          padding: "20px",
          borderRadius: "4px",
        }}
      >
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          value={email}
          size="small"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          margin="normal"
          value={password}
          fullWidth
          size="small"
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Display Name"
          type="text"
          variant="outlined"
          value={displayName}
          margin="normal"
          fullWidth
          size="small"
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <Button
          sx={{ marginTop: "15px" }}
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          onClick={handleRegistration}
        >
          {loading ? "Loading..." : "Register"}
        </Button>

        <Box sx={{ marginTop: "15px", textAlign: "center" }}>
          Do you have an account? <Link to="/login">Login</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Registration;

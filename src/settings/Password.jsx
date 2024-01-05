import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import { useState } from "react";

export default function Password() {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // Re-authenticate the user
  const reauthenticate = async (currentPassword) => {
    const auth = getAuth();
    const user = auth.currentUser;
    try {
      await signInWithEmailAndPassword(auth, user.email, currentPassword);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (values.newPassword !== values.confirmPassword) {
      alert("New Password and Confirm Password must be same");
      setLoading(false);
      return;
    }

    // Re-authenticate the user with the current password
    const isReauthenticated = await reauthenticate(values.currentPassword);
    if (!isReauthenticated) {
      alert("Current password is incorrect");
      setLoading(false);
      return;
    }

    // Update the password
    const auth = getAuth();
    try {
      await updatePassword(auth.currentUser, values.newPassword);
      alert("Password updated successfully");
      setValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to update password");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ mt: "20" }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="left">
                Change Password
              </Typography>
              <Divider sx={{ mt: 2 }} />
              <Grid container spacing={2} sx={{ mt: "20" }}>
                <Grid item xs={6}>
                  <TextField
                    id="current-password"
                    type="password"
                    label="Current Password"
                    name="currentPassword"
                    value={values.currentPassword}
                    onChange={handleChange}
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: "20" }}>
                <Grid item xs={6}>
                  <TextField
                    id="new-password"
                    type="password"
                    label="New Password"
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="password"
                    id="confirm-password"
                    label="Confirm Password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ mt: "3rem" }}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </Button>
    </form>
  );
}

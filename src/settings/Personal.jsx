import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import { useAuth } from "../context/UserContext";
import { useState } from "react";

import { getAuth } from "firebase/auth";
import { db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore/lite";

const locations = [
  {
    value: "United State",
    label: "United State",
  },
  {
    value: "India",
    label: "India",
  },
  {
    value: "Germany",
    label: "Germany",
  },
];

export default function Personal() {
  const [loading, setLoading] = useState(false);
  const { userData, updateUser } = useAuth();
  const [values, setValues] = useState({
    name: userData?.name || "",
    location: userData?.location || "",
    bio: userData?.bio || "",
    userType: userData?.userType || "",
    phone: userData?.phone || "",
    email: userData?.email || "",
    profileUrl: userData?.profileUrl || "",
    address: userData?.address || "",
    fatherName: userData?.fatherName || "",
    zipCode: userData?.zipCode || "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    // Check if any value is empty
    // for (let key in values) {
    //   if (values[key] === "") {
    //     alert(`Please fill in the ${key}`);
    //     setLoading(false);
    //     return;
    //   }
    // }

    // Update user data in context
    updateUser(values);

    // // Update user data in Firestore
    const auth = getAuth();
    const userRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(userRef, values, { merge: true });

    alert("Personal details updated successfully!");
    setLoading(false);
  };

  const utypes = [
    {
      value: "Super Admin",
      label: "Super Admin",
    },
    {
      value: "Admin",
      label: "Admin",
    },
    {
      value: "Manager",
      label: "Manager",
    },
    {
      value: "User",
      label: "User",
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ mt: "200" }}>
        <Grid item xs={6}>
          <Grid container spacing={2} sx={{ mt: "20" }}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="left">
                    Personal Information
                  </Typography>
                  <Divider sx={{ mt: 2 }} />
                  <Grid container spacing={2} sx={{ mt: "20" }}>
                    <Grid item xs={6}>
                      <TextField
                        label="Name"
                        value={values.name}
                        onChange={handleChange}
                        name="name"
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Location"
                        name="location"
                        select
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                        variant="outlined"
                        value={values.location}
                        onChange={handleChange}
                      >
                        {locations.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  {/* WIP */}
                  <Grid container spacing={2} sx={{ mt: "20" }}>
                    <Grid item xs={6}>
                      <TextField
                        label="Father Name"
                        value={values.fatherName}
                        onChange={handleChange}
                        name="fatherName"
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Zip Code"
                        name="zipCode"
                        value={values.zipCode}
                        onChange={handleChange}
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  {/* WIP */}

                  <Grid container spacing={2} sx={{ mt: "20" }}>
                    <Grid item xs={12}>
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Bio"
                        name="bio"
                        value={values.bio}
                        onChange={handleChange}
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{ mt: "20" }}>
                    <Grid item xs={6}>
                      <TextField
                        label="User Type"
                        name="userType"
                        value={values.userType}
                        onChange={handleChange}
                        select
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                        variant="outlined"
                      >
                        {utypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2} sx={{ mt: "200" }}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="left">
                    Contact Information
                  </Typography>
                  <Divider sx={{ mt: 2 }} />
                  <Grid container spacing={2} sx={{ mt: "20" }}>
                    <Grid item xs={6}>
                      <TextField
                        label="Contact Phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        type="number"
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                        variant="outlined"
                        onWheel={(e) => e.target.blur()}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Email"
                        name="email"
                        value={values.email}
                        disabled
                        type="email"
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{ mt: "20" }}>
                    <Grid item xs={12}>
                      <TextField
                        label="Profile URL"
                        name="profileUrl"
                        value={values.profileUrl}
                        onChange={handleChange}
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{ mt: "20" }}>
                    <Grid item xs={12}>
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Address"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
        sx={{ mt: "3rem" }}
      >
        {loading ? "Updating..." : "Update"}
      </Button>

      <Box height={20} />
    </form>
  );
}

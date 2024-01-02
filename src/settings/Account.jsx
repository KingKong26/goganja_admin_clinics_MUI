import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import { useAuth } from "../context/UserContext";
import { Button, MenuItem } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore/lite";
import { auth, db } from "../firebase-config";

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

export default function Account() {
  const [loading, setLoading] = useState(false);
  const { userData, updateUser } = useAuth();
  const user = auth.currentUser;

  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: true,
  });

  const [values, setValues] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    userType: userData?.userType || "",
    location: userData?.location || "",
  });

  const onValueChangeHandler = (event) => {
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const onSubmitHandler = async (event) => {
    try {
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

      await updateDoc(doc(db, "users", user.uid), values);
      updateUser(values);
      alert("Account details updated successfully!");
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <Grid container spacing={2} sx={{ mt: "20" }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="left">
                General Setting
              </Typography>
              <Divider sx={{ mt: 2 }} />
              <Grid container spacing={2} sx={{ mt: "20" }}>
                <Grid item xs={6}>
                  <TextField
                    label="Username"
                    name="username"
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                    variant="outlined"
                    onChange={onValueChangeHandler}
                    value={values.username}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Account Email"
                    type="email"
                    name="email"
                    disabled={true}
                    value={values.email}
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: "20" }}>
                <Grid item xs={6}>
                  <TextField
                    label="User Type"
                    name="userType"
                    value={values.userType}
                    select
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                    variant="outlined"
                    onChange={onValueChangeHandler}
                  >
                    {utypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Location"
                    name="location"
                    select
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                    variant="outlined"
                    value={values.location}
                    onChange={onValueChangeHandler}
                  >
                    {locations.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
            <Button
              sx={{ margin: "16px" }}
              disabled={loading}
              variant="contained"
              type="submit"
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </Card>
        </Grid>
      </Grid>
      <Box height={20} />
      <Grid container spacing={2} sx={{ mt: "200" }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="left">
                Advance Setting
              </Typography>
              <Divider sx={{ mt: 2 }} />
              <Grid container spacing={2} sx={{ mt: "20" }}>
                <Grid item xs={6}>
                  <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend">
                      Assign responsibility
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={state.gilad}
                            onChange={handleChange}
                            name="gilad"
                          />
                        }
                        label="Gilad Gray"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={state.jason}
                            onChange={handleChange}
                            name="jason"
                          />
                        }
                        label="Jason Killian"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={state.antoine}
                            onChange={handleChange}
                            name="antoine"
                          />
                        }
                        label="Antoine Llorca"
                      />
                    </FormGroup>
                    <FormHelperText>Be careful</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
}

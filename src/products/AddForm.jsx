import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";

function AddForm({ closeEvent }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    initialConsultFee: "",
    featuredImage: null,
    additionalImages: [],
  });

  const [showAddButton, setShowAddButton] = useState(true);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [featuredImage, setFeaturedImage] = useState();
  const [image, setImage] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFeaturedImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, featuredImage: file }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, additionalImages: [...prevData.additionalImages, file] }));
    setShowAddButton(false);
  };

  const handleAddImage = () => {
    setShowAddButton(true);
  };

  const handleDeleteImage = (index) => {
    const newImages = [...formData.additionalImages];
    newImages.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, additionalImages: newImages }));
  };

  const handleServiceChange = (e) => {
    setNewService(e.target.value);
  };
  
  const handleAddService = () => {
    if (newService.trim() !== "") {
      setServices((prevServices) => [...prevServices, newService]);
      setNewService("");
    }
  };

  const handleDeleteService = (index) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };
  
  const createClinic = () => {

  }

  return (
    <div>
      <Navbar />
      <Box height={70}/>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          padding: 2,
        }}
      >
        <Sidenav />
        <Box sx={{ flexGrow: 1, maxWidth: "1000px", width: "100%" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Add Clinic
          </Typography>
          <Grid container spacing={2} >
            <Grid item xs={12}>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="address"
                label="Address"
                variant="outlined"
                fullWidth
                value={formData.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="initialConsultFee"
                label="Initial Consult Fee"
                variant="outlined"
                fullWidth
                value={formData.initialConsultFee}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="featured-image"
                label="Featured Image"
                variant="outlined"
                value={formData.featuredImage ? formData.featuredImage.name : ""}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="featured-image-upload"
                type="file"
                onChange={handleFeaturedImageUpload}
              />
              <label htmlFor="featured-image-upload">
                <Button variant="outlined" component="span" fullWidth>
                  Upload Featured Image
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="general-images"
                label="General Images"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
              {formData.additionalImages.map((image, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={image.name}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Button onClick={() => handleDeleteImage(index)}>
                    <span role="img" aria-label="delete">❌</span>
                  </Button>
                </div>
              ))}
            </Grid>
            <Grid item xs={12}>
              {showAddButton && (
                <div>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      Upload Images
                    </Button>
                  </label>
                </div>
              )}
              {!showAddButton && (
                <Button variant="outlined" onClick={handleAddImage} fullWidth>
                  Add Another Image
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{mt:2}}>
  <TextField
    id="services"
    label="Services"
    variant="outlined"
    fullWidth
    value={newService}
    onChange={handleServiceChange}
  />
  <Button variant="outlined" onClick={handleAddService} fullWidth sx={{mt:2}}>
    Add Service
  </Button>
  {services.map((service, index) => (
    <div key={index} style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
      <TextField
        variant="outlined"
        fullWidth
        value={service}
        InputProps={{
          readOnly: true,
        }}
        
      />
      <Button onClick={() => handleDeleteService(index)}>
        <span role="img" aria-label="delete">❌</span>
      </Button>
    </div>
  ))}
</Grid>
<Grid item xs={12} sx={{mt:3}}>
  <Typography variant="h5" align="center">
    <Button variant="contained" onClick={createClinic}>
      Submit
    </Button>
  </Typography>
  
  <Box sx={{m:4}} />
</Grid>
        </Box>
        
      </Box>
    </div>
  );
}

export default AddForm;

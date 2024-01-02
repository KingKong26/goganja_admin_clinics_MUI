import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import SvgIcon from "@mui/material/SvgIcon";
import ThailandBahtIcon from "../components/CustomIcons";
import { db, storage } from "../firebase-config";
import Swal from "sweetalert2";
import { addDoc, collection, getDocs } from "firebase/firestore/lite";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function AddForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    initialConsultFee: "",
    featuredImage: null,
    additionalImages: [],
    services: [],
    openingHours: {
      monday: { opening: null, closing: null },
      tuesday: { opening: null, closing: null },
      wednesday: { opening: null, closing: null },
      thursday: { opening: null, closing: null },
      friday: { opening: null, closing: null },
      saturday: { opening: null, closing: null },
      sunday: { opening: null, closing: null },
    },
  });
  const [showAddButton, setShowAddButton] = useState(true);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const empCollectionRef = collection(db, "clinics");

  const createClinic = async () => {
    const {
      name,
      initialConsultFee,
      featuredImage,
      additionalImages,
      address,
      city,
    } = formData;

    // Upload the featured image to Firebase Storage
    const featuredImageRef = ref(
      storage,
      `clinic_images/${featuredImage.name}`
    );
    await uploadBytes(featuredImageRef, featuredImage);

    // Get the download URL for the featured image
    const featuredImageUrl = await getDownloadURL(featuredImageRef);

    // Upload additional images to Firebase Storage
    const additionalImageUrls = await Promise.all(
      formData.additionalImages.map(async (image) => {
        const imageRef = ref(storage, `clinic_images/${image.name}`);
        await uploadBytes(imageRef, image);
        return getDownloadURL(imageRef);
      })
    );

    // Save clinic data with image URLs to Firestore
    await addDoc(empCollectionRef, {
      name,
      initialConsultFee: Number(initialConsultFee),
      address,
      city,
      featuredImageUrl,
      additionalImageUrls,
      date: String(new Date()),
    });

    getClinics();
    Swal.fire("Submitted!", "Your file has been submitted.", "success");
  };
  const getClinics = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // const [name, setName] = useState();
  // const [address, setAddress] = useState();
  // const [city, setCity] = useState();
  // const [featuredImageUpload , setFeaturedImageUpload] = useState();
  // const [image, setImage] = useState([]);

  // const handleNameChange = (e) => {
  //   setName(e.target.value);
  // };
  // const handleAddressChange = (e) => {
  //   setAddress(e.target.value);
  // }
  // const handleCityChange = (e) => {
  //   setCity(e.target.value);
  // }
  // const handleNameChange = (e) => {
  //   setName(e.target.value);
  // }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "city") {
      setSelectedCity(value);
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFeaturedImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, featuredImage: file }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      additionalImages: [...prevData.additionalImages, file],
    }));
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

  const handleTimeChange = (day, timeType, time) => {
    setFormData((prevData) => ({
      ...prevData,
      openingHours: {
        ...prevData.openingHours,
        [day]: {
          ...prevData.openingHours[day],
          [timeType]: time,
        },
      },
    }));
  };

  const cities = [
    {
      value: "Bangkok",
      label: "Bangkok",
    },
    {
      value: "Pattaya",
      label: "Pattaya",
    },
    {
      value: "KoSamui",
      label: "Ko Samui",
    },
    {
      value: "ChiangMai",
      label: "Chiang Mai",
    },
    {
      value: "Phuket",
      label: "Phuket",
    },
  ];

  return (
    <div>
      <Navbar />
      <Box height={100} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "auto", // or use a fixed height like "600px"
          padding: 2,
        }}
      >
        <Sidenav />
        <Box sx={{ flexGrow: 1, maxWidth: "1000px", width: "100%" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Add Clinic
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="name"
                name="name"
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
                name="address"
                variant="outlined"
                fullWidth
                value={formData.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="city"
                label="City/Province"
                select
                name="city"
                variant="outlined"
                fullWidth
                value={selectedCity}
                onChange={(e) => handleInputChange(e)}
              >
                {cities.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="initialConsultFee"
                name="initialConsultFee"
                label="Initial Consult Fee"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.initialConsultFee}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <ThailandBahtIcon color="primary" fontSize="default" />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
            <h3>Business Hours</h3>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={3} >
                  
                  {Object.keys(formData.openingHours).map((day) => (
                    <Grid item xs={6} key={day} >
                      <FormControl fullWidth sx={{'margin-bottom':'10px'}}>
                        <InputLabel id={`${day}-opening-picker-label`} sx={{ margin: "0 100px" }}>
                          {day} Opening
                        </InputLabel>
                        <TimePicker
                          labelId={`${day}-opening-picker-label`}
                          value={formData.openingHours[day].opening}
                          onChange={(time) => handleTimeChange(day, "opening", time)}
                          renderInput={(params) => (
                            <TextField {...params} size="small" variant="outlined" />
                          )}
                        />
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id={`${day}-closing-picker-label`} sx={{ margin: "0 100px" }}>
                          {day} Closing
                        </InputLabel>
                        <TimePicker
                          labelId={`${day}-closing-picker-label`}
                          value={formData.openingHours[day].closing}
                          onChange={(time) => handleTimeChange(day, "closing", time)}
                          renderInput={(params) => (
                            <TextField {...params} size="small" variant="outlined" />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  ))}
                </Grid>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="featured-image"
                label="Featured Image"
                variant="outlined"
                value={
                  formData.featuredImage ? formData.featuredImage.name : ""
                }
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
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={image.name}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Button onClick={() => handleDeleteImage(index)}>
                    <span role="img" aria-label="delete">
                      ❌
                    </span>
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
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              id="services"
              label="Services"
              variant="outlined"
              fullWidth
              value={newService}
              onChange={handleServiceChange}
            />
            <Button
              variant="outlined"
              onClick={handleAddService}
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Service
            </Button>
            {services.map((service, index) => (
              <div
                key={service}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  value={service}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Button onClick={() => handleDeleteService(index)}>
                  <span role="img" aria-label="delete">
                    ❌
                  </span>
                </Button>
              </div>
            ))}
          </Grid>
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography variant="h5" align="center">
              <Button
                variant="contained"
                onClick={() => {
                  console.log(formData);
                  createClinic();
                }}
              >
                Submit
              </Button>
            </Typography>

            <Box sx={{ m: 4 }} />
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

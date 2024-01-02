import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { db } from "../firebase-config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore/lite";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export const StyleWrapper = styled.div`
  .fc .fc-scrollgrid-section table,
  .fc .fc-scrollgrid-section-body table tbody tr,
  .fc .fc-scrollgrid-section-body table,
  .fc .fc-daygrid-body,
  .fc .fc-scrollgrid-section-body table {
    width: 100% !important;
  }
  .fc .fc-toolbar-title,
  .fc .fc-col-header-cell-cushion {
    font-family: "montserrat";
  }
  .fc .fc-button-bg-color {
    background-color: #314435;
  }
`;

const CalendarComponent = () => {
  // State to manage events
  const [events, setEvents] = useState([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventAction, seteventAction] = useState(null);
  const [initialTime, setInitialTime] = useState(null);

  useEffect(() => {
    const eventCollectionRef = collection(db, "events");
    const fetchEvents = async () => {
      try {
        const eventsCollection = await getDocs(eventCollectionRef);
        if (!eventsCollection.empty) {
          const eventsData = eventsCollection.docs
            ? eventsCollection.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                time: doc.data().formData["clinic time"],
              }))
            : [];
          setEvents(eventsData);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const UpdateEventModal = ({ isOpen, onClose, onConfirm, onDelete }) => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
      firstName: selectedEvent?.extendedProps?.formData?.firstName || "",
      lastName: selectedEvent?.extendedProps?.formData?.lastName || "",
      emailAddress: selectedEvent?.extendedProps?.formData?.emailAddress || "",
      phoneNumber: selectedEvent?.extendedProps?.formData?.phoneNumber || "",
      clinicPlace: selectedEvent?.extendedProps?.formData?.clinicPlace || "",

      "clinic time":
        selectedEvent?.extendedProps?.formData["clinic time"] || null,
    });

    const handleConfirm = (e) => {
      e.preventDefault();
      const newErrors = {};
      if (!formData.clinicPlace.trim()) {
        newErrors.clinicPlace = "Clinic place is required";
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "phone number is required";
      }
      if (!formData.emailAddress.trim()) {
        newErrors.emailAddress = "email address is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "last name is required";
      }
      if (!formData.firstName.trim()) {
        newErrors.firstName = "first  name is required";
      }
      if (!formData["clinic time"]) {
        newErrors.clinicTime = "Clinic time is required";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        onConfirm(formData);
      }
    };

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleTimeChange = (time) => {
      if (time != null) {
        setErrors({ ...errors, clinicTime: "" });
      }
      const timestamp = time ? new Date(time).toLocaleTimeString() : null;

      setFormData((prevData) => ({
        ...prevData,
        ...{ "clinic time": timestamp },
      }));
    };

    const handleDelete = () => {
      onDelete();
      onClose();
    };
    return (
      isOpen && (
        <Modal
          open={isOpen}
          onClose={onClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#ffffff",
              width: "40%",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span
              onClick={onClose}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "10px",
              }}
            >
              <CloseIcon style={{ fontSize: "20px", color: "black" }} />
            </span>
            <Typography
              variant="h5"
              id="modal-title"
              sx={{ fontWeight: 500, marginBottom: "10px" }}
            >
              {eventAction === "edit" ? "Update Event" : "Add Event"}
            </Typography>
            <form onSubmit={handleConfirm}>
              <TextField
                type="text"
                label={
                  eventAction === "edit"
                    ? selectedEvent.extendedProps?.formData?.firstName
                    : "Enter your first name"
                }
                variant="outlined"
                placeholder={
                  eventAction === "edit"
                    ? selectedEvent.extendedProps?.formData?.firstName
                    : "Enter your first name"
                }
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "15px" }}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
              />

              <TextField
                type="text"
                label={
                  eventAction === "edit"
                    ? selectedEvent.extendedProps?.formData?.lastName
                    : "Enter your last name"
                }
                variant="outlined"
                placeholder={
                  eventAction === "edit"
                    ? selectedEvent.extendedProps?.formData?.lastName
                    : "Enter your last name"
                }
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "15px" }}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
              />
              <TextField
                type="text"
                label={
                  eventAction === "edit"
                    ? selectedEvent.extendedProps?.formData?.emailAddress
                    : "Enter your email address"
                }
                variant="outlined"
                placeholder={
                  eventAction === "edit"
                    ? selectedEvent.extendedProps?.formData?.emailAddress
                    : "Enter your email address"
                }
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "15px" }}
                error={Boolean(errors.emailAddress)}
                helperText={errors.emailAddress}
              />
              <TextField
                type="text"
                label={
                  eventAction === "edit"
                    ? selectedEvent.extendedProps?.formData?.phoneNumber
                    : "Enter your Phone number"
                }
                variant="outlined"
                placeholder={
                  eventAction === "edit"
                    ? selectedEvent.extendedProps?.formData?.phoneNumber
                    : "Enter your Phone number"
                }
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "15px" }}
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber}
              />
              <TextField
                type="text"
                label={
                  eventAction === "edit"
                    ? selectedEvent.extendedProps?.formData?.clinicPlace
                    : "Enter your clinic place"
                }
                variant="outlined"
                placeholder={
                  eventAction === "edit"
                    ? selectedEvent.extendedProps?.formData?.clinicPlace
                    : "Enter your clinic place"
                }
                name="clinicPlace"
                value={formData.clinicPlace}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "15px" }}
                error={Boolean(errors.clinicPlace)}
                helperText={errors.clinicPlace}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl fullWidth>
                  <TimePicker
                    id="time-picker"
                    value={initialTime}
                    onChange={handleTimeChange}
                    error={Boolean(errors.clinicTime)}
                    helperText={errors.clinicTime}
                    sx={{
                      "& fieldset": {
                        borderColor: errors.clinicTime ? "#d32f2f" : undefined,
                      },
                    }}
                  />
                  {Boolean(errors.clinicTime) && (
                    <span className="errorText ">{errors.clinicTime}</span>
                  )}
                </FormControl>
              </LocalizationProvider>
            </form>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
                gap: 10,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
              {eventAction === "edit" && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  <DeleteIcon style={{ marginRight: "5px" }} /> Delete
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )
    );
  };

  // Event handler for update an event
  const handleEventUpdate = async (info) => {
    if (info !== null) {
      try {
        // Update the event in Firestore using the document ID
        await updateDoc(doc(db, "events", selectedEvent.id), {
          formData: info,
        });
        // Update the event in the local state
        const updatedEvents = events.map((event) =>
          event.id === selectedEvent.id ? { ...event, formData: info } : event
        );
        setEvents(updatedEvents);
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
    setUpdateModalOpen(false);
  };

  const handleEventClick = (info, eventAction) => {
    setUpdateModalOpen(true);
    setSelectedEvent(info);

    if (eventAction === "edit") {
      const initialDate = dayjs();
      const timeString = info?.extendedProps?.formData["clinic time"];
      const [hours, minutes, seconds] = timeString
        .split(":")
        .map((part) => parseInt(part, 10));

      const updatedDate = initialDate
        .set("hour", hours)
        .set("minute", minutes)
        .set("second", seconds);
      setInitialTime(updatedDate);
    } else {
      setInitialTime(null);
    }
    seteventAction(eventAction);
  };

  // Event handler for adding a new event
  const handleAddEvent = async (info) => {
    if (info !== null) {
      try {
        const newEvent = { formData: info, date: selectedEvent.dateStr };
        const docRef = await addDoc(collection(db, "events"), newEvent);
        setEvents([...events, { id: docRef.id, ...newEvent }]);
      } catch (error) {
        console.error("Error adding event:", error);
      }
    }
  };

  // Event handler for deleting an event
  const handleDeleteEvent = async (info, event) => {
    try {
      await deleteDoc(doc(db, "events", selectedEvent.id));
      const updatedEvents = events.filter(
        (event) => event.id !== selectedEvent.id
      );
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <StyleWrapper>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={(info) => handleEventClick(info, "add")}
              eventClick={(info) => handleEventClick(info.event, "edit")}
              eventContent={(eventContent) => (
                <>
                  <span>{eventContent.timeText}</span>
                  <span>
                    {eventContent.event.extendedProps?.formData?.firstName} -
                  </span>
                  <span className="paddingall">
                    {eventContent.event.extendedProps?.formData?.lastName} -
                  </span>
                  <span>
                    {eventContent.event.extendedProps?.formData["clinic time"]
                      .split("")
                      .filter(
                        (_, index) => index !== 5 && index !== 6 && index !== 7
                      )
                      .join("")}
                  </span>
                </>
              )}
            />
            <UpdateEventModal
              isOpen={updateModalOpen}
              onClose={() => setUpdateModalOpen(false)}
              onConfirm={
                eventAction === "edit" ? handleEventUpdate : handleAddEvent
              }
              onDelete={handleDeleteEvent}
            />
          </StyleWrapper>
        </CardContent>
      </Card>
    </>
  );
};

export default CalendarComponent;

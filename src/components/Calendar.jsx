import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

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
  Modal,
  TextField,
} from "@mui/material";
import styled from "@emotion/styled";

export const StyleWrapper = styled.div`
  .fc .fc-scrollgrid-section table,
  .fc .fc-scrollgrid-section-body table tbody tr,
  .fc .fc-scrollgrid-section-body table,
  .fc .fc-daygrid-body ,
  .fc .fc-scrollgrid-section-body table {
    width: 100% !important;
  }
`;

const CalendarComponent = () => {
  // State to manage events
  const [events, setEvents] = useState([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventAction, seteventAction] = useState(null);

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
    const [newTitle, setNewTitle] = useState("");

    const handleConfirm = () => {
      onConfirm(newTitle);
      setNewTitle("");
      onClose();
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
            <h2 id="modal-title">
              {eventAction === "edit" ? "Update Event" : "Add Event"}
            </h2>
            <TextField
              type="text"
              label={
                eventAction === "edit" ? selectedEvent.title : "Enter new title"
              }
              variant="outlined"
              placeholder={
                eventAction === "edit" ? selectedEvent.title : "Enter new title"
              }
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              fullWidth
              style={{ marginBottom: "15px" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                style={{ marginRight: "10px" }}
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
  const handleEventUpdate = async (newTitle) => {
    if (newTitle !== null) {
      try {
        // Update the event in Firestore using the document ID
        await updateDoc(doc(db, "events", selectedEvent.id), {
          title: newTitle,
        });
        // Update the event in the local state
        const updatedEvents = events.map((event) =>
          event.id === selectedEvent.id ? { ...event, title: newTitle } : event
        );
        setEvents(updatedEvents);
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
    setUpdateModalOpen(false); // Close the modal after updating
  };

  const handleEventClick = (info, eventAction) => {
    setUpdateModalOpen(true);
    setSelectedEvent(info);
    seteventAction(eventAction);
  };

  // Event handler for adding a new event
  const handleAddEvent = async (newTitle) => {
    if (newTitle !== null) {
      try {
        const newEvent = { title: newTitle, date: selectedEvent.dateStr };
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
      await deleteDoc(doc(db, "events", selectedEvent.id)); // Fix this line
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
                dateClick={(info) => handleEventClick(info, "add")} // Clicking on a date to add a new event
                eventClick={(info) => handleEventClick(info.event, "edit")} // Clicking on an event to update
                eventContent={(eventContent) => (
                  <>
                    <span>{eventContent.timeText}</span>
                    <span>{eventContent.event.title}</span>
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

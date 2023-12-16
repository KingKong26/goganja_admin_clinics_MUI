import Navbar from "../components/Navbar";
import { Box } from "@mui/material";
import Sidenav from "../components/Sidenav";
import CalendarComponent from "../components/Calendar";
export default function Bookings() {
  return (
    <div className="bgcolor">
      <Navbar />
      <Box height={70} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <CalendarComponent />
        </Box>
      </Box>
    </div>
  );
}

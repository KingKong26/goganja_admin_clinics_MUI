import React from "react";
import Sidenav from "../components/Sidenav";
import DashAccordion from "../components/DashAccordion";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import "../Dashboard.css";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VBarChart from "../charts/VBarChart";
import CountUp from "react-countup";

export default function Home() {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={65} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Stack direction="row" spacing={2}>
                  <Card
                    className="gradient"
                    sx={{ minWidth: 49 + "%", height: 140 }}
                  >
                    <div className="iconstylewhite">
                      <CreditCardIcon />
                    </div>
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ color: "#f0fcfc" }}
                      >
                        $<CountUp delay={0.2} end={500} duration={0.3} />
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ color: "#ccd1d1" }}
                      >
                        Total Earning
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card
                    className="gradientlight"
                    sx={{ minWidth: 49 + "%", height: 140 }}
                  >
                    <div className="iconstylewhite">
                      <ShoppingBagIcon />
                    </div>
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ color: "#f0fcfc" }}
                      >
                        $<CountUp delay={0.2} end={900} duration={0.4} />
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ color: "#ccd1d1" }}
                      >
                        Total Order
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={2} direction={"column"}>
                  <Card className="gradientlight" sx={{ padding: "10px" }}>
                    <Stack
                      spacing={2}
                      direction="row"
                      alignItems={"center"}
                    >
                      <StorefrontIcon color="background" />
                      <div>
                        <Typography variant="subtitle2" color="Background">$203k</Typography>
                        <Typography variant="caption" color="Background">Total Income</Typography>
                      </div>
                    </Stack>
                  </Card>
                  <Card sx={{ padding: "10px" }}>
                    <Stack
                      spacing={2}
                      direction="row"
                      alignItems={"center"}
                    >
                      <StorefrontIcon />
                      <div>
                        <Typography variant="subtitle2">$130k</Typography>
                        <Typography variant="caption">Total Expenses</Typography>
                      </div>
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{mt: 0}}>
              <Grid item xs={8}>
                <Card sx={{ height: 60 + "vh" }}>
                  <CardContent>
                    <VBarChart />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ height: 60 + "vh" }}>
                  <CardContent>
                    <div className="paddingall">
                      <span className="pricetitle">Popular Products</span>
                    </div>
                    <Box height={10} />
                    <DashAccordion />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    </>
  );
}

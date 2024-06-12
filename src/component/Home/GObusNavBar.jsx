import * as React from "react";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RestoreIcon from "@mui/icons-material/Restore";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useLocation } from "react-router-dom";

export const GObusNavBar = () => {
  // untuk routing
  const navigate = useNavigate();
  const [value, setValue] = React.useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  // untuk mengambil path di URL
  const location = useLocation();

  switch (location.pathname.split("/")[1]) {
    case "profile":
      if (value !== "profile") {
        setValue("profile");
      }
      break;
    case "history":
      if (value !== "history") {
        setValue("history");
      }
      break;
    case "":
      if (value !== "") {
        setValue("");
      }
      break;
  }
  return (
    <Box sx={{ pb: 7 }}>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation showLabels value={value} onChange={handleChange}>
          <BottomNavigationAction
            value="history"
            label="Riwayat"
            icon={<RestoreIcon />}
          />
          <BottomNavigationAction
            value=""
            label="Beranda"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            value={"profile"}
            label="Profil"
            icon={<AccountCircleIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

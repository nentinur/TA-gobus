import React from "react";
import GObusAppBar from "../Home/GObusAppBar";
import DirectionsBus from "@mui/icons-material/DirectionsBus";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Paper,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { LoginButton } from "../Login/LoginButton";
import { useNavigate } from "react-router-dom";
import { EditBus } from "./EditBus";

export const ProfilePageDriver = () => {
  return (
    <div>
      <GObusAppBar />
      <IsLogin />
    </div>
  );
};

const IsLogin = () => {
  const [open, setOpen] = React.useState(false);

  const login = localStorage.getItem("login");
  const user = localStorage.getItem("user");
  const dataUser = JSON.parse(user);
  const bus = localStorage.getItem("bus");
  const dataBus = JSON.parse(bus);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const navigate = useNavigate();
  const handleClickEdit = () => {
    navigate("edit");
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    setOpen(false);
    localStorage.setItem("login", false);
  };

  if (login == "false") {
    return (
      <Paper elevation={3} sx={{ margin: 3 }}>
        <LoginButton />
      </Paper>
    );
  } else {
    return (
      <div>
        <Paper elevation={3} sx={{ margin: 3 }}>
          <Card sx={{ maxWidth: "100%" }}>
            <CardHeader
              avatar={<Avatar>P</Avatar>}
              title={dataUser.nama}
              subheader={dataUser.kontak}
            />
            <CardContent>
              <Button
                sx={{ margin: 1 }}
                startIcon={<LogoutIcon />}
                variant="outlined"
                size="small"
                onClick={handleClickEdit}
              >
                Edit Profil
              </Button>
              <Button
                sx={{ margin: 1 }}
                startIcon={<LogoutIcon />}
                variant="outlined"
                size="small"
                onClick={handleClickOpen}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Paper>
        <Paper elevation={3} sx={{ margin: 3 }}>
          <Card sx={{ maxWidth: "100%" }}>
            <CardHeader
              avatar={
                <Avatar>
                  <DirectionsBus />
                </Avatar>
              }
              title={dataBus.no_bus}
              subheader={dataBus.jurusan + " - " + dataBus.jam}
            />
            <CardContent>
              <EditBus />
            </CardContent>
          </Card>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle id="alert-dialog-title">Keluar</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Yakin mau keluar?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Batal</Button>
              <Button onClick={handleLogout} autoFocus>
                Ya
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </div>
    );
  }
};

import React, { useState, useEffect } from "react";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import {
  TextField,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginButton } from "../Login/LoginButton";
import BookingMap from "../GObusMaps/BookingMap";

export const Booking = () => {
  const [open, setOpen] = useState();
  const handleOk = () => {
    navigate("/history");
  };

  const close = () => {
    setOpen(false);
  };

  // menangkap id_jadwal yang dikirim melalui router
  const { state } = useLocation();
  const { id } = state;

  // mengambil data bus berdasarkan dipilih
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3100/bus/jadwal", {
        params: {
          id_jadwal: id,
        },
      })
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, []);

  // handle klik booking
  const handleBooking = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3100/pesanan", {
        id_user: values.id_user,
        id_jadwal: values.id_jadwal,
        tanggal: values.tanggal,
        nama: values.nama,
        kontak: values.kontak,
        jumlah_kursi: values.jumlah_kursi,
        lat_naik: values.lat_awal,
        lon_naik: values.lon_awal,
        tarif: values.total_tarif,
      })
      .then((res) => {
        console.log(res);
        setOpen(true);
        updateBus();
      })
      .catch((err) => console.error(err));
  };

  // mengambil data dari local storage
  const login = localStorage.getItem("login");
  const user = localStorage.getItem("user");
  let dataUser = {
    id_user: "",
    nama: "",
    kontak: "",
    pass: "",
    role: "",
  };
  if (user !== null) {
    dataUser = JSON.parse(user);
  }

  // mendapatkan tanggal sekarang
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  // data pesanan

  const [values, setValues] = useState({
    id_user: dataUser.id_user,
    id_jadwal: id,
    tanggal: date,
    nama: "",
    kontak: "",
    jumlah_kursi: 0,
    total_tarif: 0,
    lat_naik: "",
    lon_naik: "",
  });

  console.log(values);

  const handleClickKursi = (e) => {
    setValues({
      ...values,
      jumlah_kursi: e.target.value,
      total_tarif: e.target.value * data.tarif,
    });
  };

  const handleTitikNaikChange = (newTitikNaik) => {
    setValues({
      ...values,
      lat_naik: newTitikNaik.lat,
      lon_naik: newTitikNaik.lng,
    });
  };

  // Update sisa kursi
  const sisaKursi = data.kursi_kosong - values.jumlah_kursi;
  console.log("sisa kursi: " + sisaKursi);
  const updateBus = () => {
    axios
      .post("http://localhost:3100/bus/update", {
        kursi: sisaKursi,
        id: values.id_jadwal,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  };
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };

  if (login == "false" || login == null) {
    return (
      <Paper elevation={3} sx={{ margin: 3 }}>
        <LoginButton />
      </Paper>
    );
  } else {
    return (
      <div>
        <form onSubmit={handleBooking}>
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Booking Kursi
              </Typography>
              <Button type="submit" autoFocus color="inherit">
                Booking
              </Button>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "90%" },
            }}
          >
            <ListItem key={data.id_jadwal} value={data.id_jadwal}>
              <ListItemAvatar>
                <Avatar>
                  <DirectionsBusIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={data.jurusan}
                secondary={
                  "Jam: " + data.jam + " | Kursi Kosong: " + data.kursi_kosong
                }
              />
            </ListItem>

            <TextField
              id="outlined-number"
              label="Jumlah Kursi"
              type="number"
              onChange={handleClickKursi}
            />
            <TextField
              id="outlined"
              label="Nama"
              type="text"
              onChange={(e) => setValues({ ...values, nama: e.target.value })}
            />
            <TextField
              id="outlined"
              label="Nomor HP/WA"
              type="text"
              onChange={(e) => setValues({ ...values, kontak: e.target.value })}
            />
            <Typography sx={{ ml: 2, flex: 1 }}>
              Pilih Titik Anda Naik:
            </Typography>
          </Box>
          <BookingMap onChange={handleTitikNaikChange} />
          <AppBar
            position="fixed"
            color="primary"
            sx={{ top: "auto", bottom: 0 }}
          >
            <Toolbar>
              <Typography>Total: Rp.{values.total_tarif}</Typography>
              {/* <PaymentForm /> */}
            </Toolbar>
          </AppBar>
        </form>
        <Dialog open={open} onClose={close}>
          <DialogTitle id="alert-dialog-title">
            Pemesanan Tiket Berhasil
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Lihat rincian pemesanan?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOk}>Ya</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
};

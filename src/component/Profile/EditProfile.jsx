import React from "react";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  AppBar,
  Toolbar,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const EditProfile = () => {
  // mengambil info user dari local storage
  const user = localStorage.getItem("user");
  const dataUser = JSON.parse(user);

  // post data yang diubah
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3100/user/update", {
        nama: values.nama,
        kontak: values.kontak,
        pass: values.pass,
        id_user: dataUser.id_user,
      })
      .then(function (response) {
        console.log(response);
        getUser();
        navigate(-1);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getUser = () => {
    axios
      .get("http://localhost:3100/user", {
        params: {
          id_user: dataUser.id_user,
        },
      })
      .then(function (response) {
        console.log(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  // show password
  const handlePassVisibilty = () => {
    setValues({
      ...values,
      showPass: !values.showPass,
    });
  };

  // state untuk menampung value form login
  const [values, setValues] = useState({
    nama: "",
    kontak: "",
    pass: "",
  });
  console.log(values);

  // menutup dialog
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
              Edit Profile
            </Typography>
            <Button type="submit" autoFocus color="inherit">
              SIMPAN
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            "& .MuiTextField-root": { m: 2, width: "90%" },
          }}
        >
          <TextField
            sx={{ mt: 2 }}
            type="text"
            fullWidth
            label="Nama"
            placeholder="nama"
            variant="outlined"
            required
            onChange={(e) => setValues({ ...values, nama: e.target.value })}
          />
          <TextField
            sx={{ mt: 2 }}
            type="text"
            fullWidth
            label="No. Telpon"
            placeholder="kontak"
            variant="outlined"
            required
            onChange={(e) => setValues({ ...values, kontak: e.target.value })}
          />
          <TextField
            sx={{ mt: 2 }}
            type={values.showPass ? "text" : "password"}
            fullWidth
            label="Password"
            placeholder="Password"
            variant="outlined"
            required
            onChange={(e) => setValues({ ...values, pass: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handlePassVisibilty}
                    aria-label="toggle password"
                    edge="end"
                  >
                    {values.showPass ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </form>
    </div>
  );
};

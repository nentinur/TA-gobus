import React from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import DirectionsBus from "@mui/icons-material/DirectionsBus";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const EditBus = () => {
  // state untuk menampung data bus
  const [data, setData] = useState([]);
  const [jurusan, setJurusan] = React.useState("");

  console.log(jurusan);
  useEffect(() => {
    axios
      .get("http://localhost:3100/bus")
      .then(function (response) {
        // handle success
        console.log("data: ", response.data);
        setData(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, []);

  const handleClickBus = () => {
    axios
      .get("http://localhost:3100/bus/jadwal", {
        params: {
          id_jadwal: jurusan,
        },
      })
      .then(function (response) {
        // handle success
        localStorage.setItem("bus", JSON.stringify(response.data));
        console.log("bus: ", response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    handleClose();
  };

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* Dialog ubah profil */}
      <Button
        sx={{ margin: 1 }}
        startIcon={<EditIcon />}
        variant="outlined"
        size="small"
        onClick={handleClickOpen}
      >
        Ubah Profil
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Pilih Bus</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 2, width: "90%" },
            }}
          >
            <TextField
              id="pilih-jurusan"
              select
              label="Pilih Jurusan Bus"
              value={jurusan}
              onChange={(event) => setJurusan(event.target.value)}
            >
              {data?.map((option) => (
                <MenuItem key={option.id_jadwal} value={option.id_jadwal}>
                  {option.jurusan + " - " + option.jam}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <div>
            <DialogActions>
              <Button
                onClick={handleClickBus}
                type="submit"
                autoFocus
                color="primary"
              >
                SIMPAN
              </Button>
            </DialogActions>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

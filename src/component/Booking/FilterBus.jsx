import * as React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Avatar,
  TextField,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";

import DirectionsBus from "@mui/icons-material/DirectionsBus";
import { BackButton } from "../Home/BackButton";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const FilterBus = () => {
  const [jurusan, setJurusan] = React.useState("");
  const PilihJurusan = (event) => {
    setJurusan(event.target.value);
  };

  // state untuk menampung data bus
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3100/bus")
      .then(function (response) {
        // handle success
        console.log(response.data);
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

  // pilihan jurusan
  const jurusanBus = [
    {
      value: "cbr-lwp",
      label: "Cibiru - Leuwipanjang",
    },
    {
      value: "lwp-cbr",
      label: "Leuwipanjang - Cibiru",
    },
  ];

  // filter jurusan bus
  const dataJurusan = data.filter((bus) => bus.kode_jurusan === jurusan);
  return (
    <div>
      <BackButton />
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 2, width: "90%" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="pilih-jurusan"
          select
          label="Pilih Jurusan Bus"
          value={jurusan}
          onChange={PilihJurusan}
        >
          {jurusanBus.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <FilteredBus data={dataJurusan} />
      </Box>
    </div>
  );
};

const FilteredBus = (props) => {
  const [bus, setBus] = useState("");

  const navigate = useNavigate();
  const handleClick = (event, index) => {
    setBus(index);
    navigate("/booking", { state: { id: index } });
  };
  console.log("data bus: ", props.data);

  return (
    <div>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {props.data?.map((ListBus) => (
          <>
            <ListItem key={ListBus.id_jadwal} value={ListBus.id_jadwal}>
              <ListItemButton
                selected={bus == ListBus.id_jadwal}
                onClick={(event) => handleClick(event, ListBus.id_jadwal)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <DirectionsBus />
                  </Avatar>
                </ListItemAvatar>
                <Box
                  component="form"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <ListItemText primary={ListBus.jurusan} />
                  <Typography variant="caption">
                    Jam: {ListBus.jam} WIB
                  </Typography>
                  <Typography variant="caption">
                    Kursi Kosong: {ListBus.kursi_kosong}
                  </Typography>
                  <Typography variant="caption">
                    Tarif: {ListBus.tarif}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </div>
  );
};

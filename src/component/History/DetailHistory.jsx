import {
  Typography,
  Box,
  Link,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  Button,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DirectionsBus from "@mui/icons-material/DirectionsBus";
import HistoryMaps from "../Maps/HistoryMaps";
import { BackButton } from "../Home/BackButton";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DetailHistory() {
  const { state } = useLocation();
  const { id } = state;
  console.log("index: " + id);
  // mengambil data detail pesanan
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3100/pesanan/pesanan-detail", {
        params: {
          id_pesanan: id,
        },
      })
      .then(function (response) {
        console.log(response.data);
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:3100/posisi/kecepatan", {
        params: {
          id_pesanan: id,
        },
      })
      .then(function (response) {
        console.log(response.data);
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, []);

  return (
    <div>
      <BackButton />
      <div>
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          aria-label="contacts"
        >
          <ListItem>
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
              <Typography variant="h6">{data.jurusan}</Typography>
              <Typography variant="body2">Jam: {data.jam} WIB</Typography>
              <Typography variant="body2">No. Bus: {data.no_bus}</Typography>
              <br />
              <Button variant="outlined" startIcon={<WhatsAppIcon />}>
                <Link href="http://wa.me/6287745677969">Hubungi Sopir</Link>
              </Button>
            </Box>
          </ListItem>
        </List>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6">Estimasi waktu kedatangan: </Typography>
        </Box>
      </div>
      <div>
        <HistoryMaps no_bus={data.no_bus} />
      </div>
    </div>
  );
}

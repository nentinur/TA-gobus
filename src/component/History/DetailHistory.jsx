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

  // State untuk data dan prediksi
  const [data, setData] = useState({});
  const [prediction, setPrediction] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Mengambil data detail pesanan
    setLoading(true);
    axios
      .get("http://localhost:3100/pesanan/pesanan-detail", {
        params: {
          id_pesanan: id,
        },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Set loading ke false meski ada error
      });
  }, [id]);

  useEffect(() => {
    const estimate = () => {
      if (data.lat_naik && data.lon_naik) {
        // Mengambil prediksi posisi
        axios
          .post("http://localhost:3100/posisi/predict", {
            lat_naik: data.lat_naik,
            lon_naik: data.lon_naik,
            jurusan: data.jurusan,
          })
          .then((response) => {
            setPrediction(response.data);
            console.log("estimasi waktu: ", prediction);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    setInterval(estimate, 5000);
  }, [data]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>; // Render indikator loading
  }

  if (!data.jurusan) {
    return <Typography variant="h6">Data tidak ditemukan</Typography>; // Render jika data tidak ditemukan
  }

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
          <Typography variant="h6"></Typography>
          <Typography variant="h6">
            Estimasi waktu kedatangan: {prediction.result || "Loading.."}
          </Typography>
        </Box>
      </div>
      <div>
        <HistoryMaps
          no_bus={data.no_bus}
          lat_naik={data.lat_naik}
          lon_naik={data.lon_naik}
        />
      </div>
    </div>
  );
}

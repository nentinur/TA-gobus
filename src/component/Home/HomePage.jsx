import { Typography, Box, Button } from "@mui/material";
import GObusMaps from "../Maps";
import GObusAppBar from "../../../src/component/Home/GObusAppBar";
import { useNavigate } from "react-router-dom";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

export const HomePage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("filter-bus");
  };
  const user = localStorage.getItem("user");
  const login = localStorage.getItem("login");
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

  return (
    <div>
      <GObusAppBar />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {/* kalau user belum login, tampilkan "pengguna", kalau sudah tampilkan nama user */}
        <Typography variant="h5">
          Halo, {login == "true" ? dataUser.nama : "Pengguna"}
        </Typography>
        <Typography variant="h6">mau kemana hari ini?</Typography>
      </Box>
      <div>
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Button
            onClick={handleClick}
            variant="outlined"
            size="large"
            startIcon={<BookOnlineIcon />}
          >
            Booking Tiket
          </Button>
        </Box>
        <GObusMaps />
      </div>
    </div>
  );
};

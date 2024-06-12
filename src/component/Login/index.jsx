import React from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();
  // mengirimkan value form login
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3100/login", {
        kontak: values.kontak,
        pass: values.pass,
      })
      .then((response) => {
        console.log(response);
        // user penumpang arahkan ke home page penumpang
        if (response.status === 200 && response.data.role === "penumpang") {
          navigate("/");
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("login", true);
        }
        // user sopir arahkan ke home page sopir
        if (response.status === 200 && response.data.role === "driver") {
          navigate("/driver");
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("login", true);
        }
      })
      .catch((err) => console.error(err));
  };

  // show password
  const handlePassVisibilty = () => {
    setValues({
      ...values,
      showPass: !values.showPass,
    });
  };

  //untuk pindah ke halaman sign up
  const handleClick = () => {
    navigate("signup");
  };

  // state untuk menampung value form login
  const [values, setValues] = useState({
    kontak: "",
    pass: "",
    showPass: false,
  });
  console.log(values);

  return (
    <div>
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Paper sx={{ padding: 5 }}>
          <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  type="text"
                  fullWidth
                  label="No. Telpon"
                  placeholder="kontak"
                  variant="outlined"
                  required
                  onChange={(e) =>
                    setValues({ ...values, kontak: e.target.value })
                  }
                />
              </Grid>

              <Grid item>
                <TextField
                  type={values.showPass ? "text" : "password"}
                  fullWidth
                  label="Password"
                  placeholder="Password"
                  variant="outlined"
                  required
                  onChange={(e) =>
                    setValues({ ...values, pass: e.target.value })
                  }
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
              </Grid>

              <Grid item>
                <Button type="submit" fullWidth variant="contained">
                  Login
                </Button>
              </Grid>
              <Grid item>
                <Typography>
                  Belum punya akun?
                  <Button onClick={handleClick}>Daftar</Button>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </div>
  );
};

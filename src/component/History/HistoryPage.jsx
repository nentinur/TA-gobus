import * as React from "react";
import { Paper, Typography } from "@mui/material";
import GObusAppBar from "../../../src/component/Home/GObusAppBar";
import History from ".";
import { LoginButton } from "../Login/LoginButton";

export default function HistoryPage() {
  // kalau user belum login tampilkan tombol login
  const login = localStorage.getItem("login");
  if (login == "false") {
    return (
      <Paper elevation={3} sx={{ margin: 3 }}>
        <LoginButton />
      </Paper>
    );
  } else {
    return (
      <div>
        <GObusAppBar />
        <Paper elevation={3} sx={{ margin: 3 }}>
          <Typography sx={{ padding: 2 }} variant="h6">
            Riwayat Perjalanan
          </Typography>
          <History />
        </Paper>
      </div>
    );
  }
}

import * as React from "react";
import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const Profile = (props) => {
  const [open, setOpen] = React.useState(false);
  const { login, setLogin } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Card sx={{ maxWidth: "100%" }}>
        <CardHeader
          avatar={<Avatar>P</Avatar>}
          action={
            <IconButton
              color="primary"
              aria-label="logout"
              onClick={handleClickOpen}
            >
              <LogoutIcon />
            </IconButton>
          }
          title="Pengguna"
          subheader="@pengguna_01"
        />
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
          <Button onClick={setLogin(false)} autoFocus>
            Ya
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Profile;

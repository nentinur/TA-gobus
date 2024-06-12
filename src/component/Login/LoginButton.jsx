import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

export const LoginButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/in/login");
  };
  return (
    <div>
      <Card sx={{ minWidth: 275, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h6">Anda Belum Login!</Typography>
          <Typography variant="body2">Login Sekarang?</Typography>
          <Button
            sx={{ margin: 1 }}
            startIcon={<LoginIcon />}
            variant="contained"
            size="small"
            onClick={handleClick}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

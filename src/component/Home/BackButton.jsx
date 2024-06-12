import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
export const BackButton = (props) => {
  const navigate = useNavigate();
  return (
    <div>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            aria-label="close"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {props.titleBar}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

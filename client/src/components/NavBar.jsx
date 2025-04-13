import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1A1A1A", boxShadow: "none" }}>
      <Toolbar>
        <Button component={Link} to="/" sx={{ color: "#FFFFFF", fontWeight: "bold", fontSize: "1.2rem", '&:hover': { color: "#FFD700" } }}>
          Home
        </Button>
        <Button component={Link} to="/notes" sx={{ color: "#FFFFFF", fontWeight: "bold", fontSize: "1.2rem", '&:hover': { color: "#FFD700" } }}>
          Notes
        </Button>
        <Button component={Link} to="/tasks" sx={{ color: "#FFFFFF", fontWeight: "bold", fontSize: "1.2rem", '&:hover': { color: "#FFD700" } }}>
          To-Do
        </Button>
      </Toolbar>
    </AppBar>
  );
}

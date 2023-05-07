import { useContext } from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { UserContext } from "../configs/MyContext";
import { Link } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 7,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    background: "orange",
  },
}));

export default function CustomizedBadges({ count = 0 }) {
  const [user] = useContext(UserContext);

  return (
    <>
      {user && user.user_role === 0 ? (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "15px",
            border: "2px solid green",
            padding: "8px",
            borderRadius: "50%",
            zIndex: 10,
          }}
        >
          <Link to="/cart">
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={count} color="secondary">
                <ShoppingCartIcon style={{ color: "green" }} />
              </StyledBadge>
            </IconButton>
          </Link>
        </div>
      ) : null}
    </>
  );
}

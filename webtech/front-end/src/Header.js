/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
// Layout
import { useTheme } from "@mui/styles";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Context from "./Context";
import Gravatar from "./Gravatar";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import { NavLink } from "react-router-dom";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import SettingsIcon from "@mui/icons-material/Settings";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import profile1 from "./profilePics/profile1.png";
import profile2 from "./profilePics/profile2.png";
import profile3 from "./profilePics/profile3.png";
import profile4 from "./profilePics/profile4.png";
import profile5 from "./profilePics/profile5.png";
import Input from "@mui/material/Input";
import axios from "axios";

const useStyles = (theme) => ({
  midHead: {
    padding: "10px",
    backgroundColor: "#ffffffda",
    flexShrink: 0,
    textAlign: "center",
    color: "#23303f",
    fontSize: "25px",
  },
  logout: {
    marginLeft: "20px",
    cursor: "pointer",
  },
  home: {
    color: "#23303f",
    fontSize: "30px",
    padding: "10px",
  },
  menu: {
    [theme.breakpoints.up("sm")]: {
      display: "none !important",
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  gravatar: {
    cursor: "pointer",
  },
  field: {
    margin: "20px",
    display: "flex",
    justifyContent: "center",
    "& > img": {
      width: "80px",
      margin: "10px",
    },
  },
  upload: {
    width: "fit-content",
    display: "block",
    margin: "auto",
    textAlign: "center",
  },
  titleUpload: {
    marginTop: "50px",
    marginBottom: "15px",
  },
  saveBtn: {
    color: "white",
  },
  dialogTitle: {
    fontSize: "18px",
  },
  pic: {
    width: "40px",
    cursor: "pointer",
  },
  picUplaod: {
    width: "40px",
    height: "40px",
    cursor: "pointer",
    borderRadius: "50%",
  },
  resetButton: {
    color: "white",
    border: "1px solid white",
    width: "fit-content",
    display: "block",
    margin: "auto",
    marginTop: "50px",
  },
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function Header() {
  const styles = useStyles(useTheme());

  const { oauth, setOauth, drawerVisible, setDrawerVisible } =
    useContext(Context);

  const drawerToggle = (e) => {
    setDrawerVisible(!drawerVisible);
  };

  const logout = (e) => {
    e.stopPropagation();
    setOauth(null);
  };

  const [profilePic, setProfilePic] = useState(0);
  const [upload, setUpload] = useState();

  useEffect(() => {
    oauth && setProfilePic(oauth.profilePic);
    // oauth && setUpload(oauth.upload);
  }, [oauth]);

  // Dialog window
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const uploadPicture = async () => {
    try {
      // upload profile picture
      const data = new FormData();
      data.append("idUser", oauth.id);
      data.append("file", upload);

      await axios.post(`http://localhost:3001/uploads`, data);
    } catch (err) {
      alert(err);
    }
  };

  // Save changes profile picture
  const saveChanges = async () => {
    const { data } = await axios.put(
      `http://localhost:3001/users/${oauth.id}`,
      {
        ...oauth,
        profilePic: profilePic,
      }
    );
    setOauth(data);
  };

  return (
    <div css={styles.header}>
      <div>
        {oauth && (
          <div>
            <Tooltip title="Home" arrow>
              <NavLink to="/">
                <HomeIcon css={styles.home} />
              </NavLink>
            </Tooltip>
            <Tooltip title="Create channel" arrow>
              <NavLink to="/createChannel">
                <AddToPhotosIcon css={styles.home} />
              </NavLink>
            </Tooltip>
            <Tooltip title="Settings" arrow>
              <NavLink to="/settings">
                <SettingsIcon css={styles.home} />
              </NavLink>
            </Tooltip>
          </div>
        )}
      </div>
      <div css={styles.midHead}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={drawerToggle}
          css={styles.menu}
        >
          <MenuIcon />
        </IconButton>
        Chat application
      </div>
      <div css={styles.midHead}>
        {oauth ? (
          <span>
            <span onClick={handleClickOpen} css={styles.gravatar}>
              {profilePic === 0 && <Gravatar />}
              {profilePic === 1 && (
                <img src={profile1} alt="" css={styles.pic} />
              )}
              {profilePic === 2 && (
                <img src={profile2} alt="" css={styles.pic} />
              )}
              {profilePic === 3 && (
                <img src={profile3} alt="" css={styles.pic} />
              )}
              {profilePic === 4 && (
                <img src={profile4} alt="" css={styles.pic} />
              )}
              {profilePic === 5 && (
                <img src={profile5} alt="" css={styles.pic} />
              )}
              {oauth && profilePic === 6 && (
                <img
                  src={require("./uploads/" + oauth.id + ".jpg").default}
                  alt=""
                  css={styles.picUplaod}
                />
              )}
            </span>

            <ExitToAppIcon onClick={logout} css={styles.logout} />
          </span>
        ) : (
          <span />
        )}
      </div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          css={styles.dialogTitle}
        >
          Edit profile picture
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div css={styles.field}>Select a profile picture :</div>
          <div css={styles.field}>
            <img
              src={profile1}
              alt=""
              css={styles.pic}
              onClick={() => {
                setProfilePic(1);
              }}
            />
            <img
              src={profile2}
              alt=""
              css={styles.pic}
              onClick={() => {
                setProfilePic(2);
              }}
            />
            <img
              src={profile3}
              alt=""
              css={styles.pic}
              onClick={() => {
                setProfilePic(3);
              }}
            />
            <img
              src={profile4}
              alt=""
              css={styles.pic}
              onClick={() => {
                setProfilePic(4);
              }}
            />
            <img
              src={profile5}
              css={styles.pic}
              alt=""
              onClick={() => {
                setProfilePic(5);
              }}
            />
          </div>
          <Button
            css={styles.resetButton}
            onClick={() => {
              setProfilePic(0);
            }}
            variant="outlined"
          >
            Reset profile picture with Gravatar
          </Button>
          <div css={styles.upload}>
            <div css={styles.titleUpload}>Upload your own picture :</div>
            <Input
              id="contained-button-file"
              type="file"
              css={styles.d}
              name="fileUp"
              inputProps={{ accept: "image/*" }}
              onChange={(e) => {
                if (e.target.files[0].size < 1500000)
                  setUpload(e.target.files[0]);
                else {
                  document.getElementById("contained-button-file").value = "";
                  alert("Your image has exceeded the maximum size allowed");
                }
              }}
            />
            <Button
              onClick={() => {
                setProfilePic(6);
                uploadPicture();
              }}
              css={styles.saveBtn}
            >
              UPLOAD
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              saveChanges();
            }}
            css={styles.saveBtn}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

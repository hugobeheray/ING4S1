/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from "@mui/styles";
import { useContext, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

// dialog members
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CheckIcon from "@mui/icons-material/Check";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

// confirmation delete
import DialogContentText from "@mui/material/DialogContentText";
import useMediaQuery from "@mui/material/useMediaQuery";
import Context from "../Context";

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

const useStyles = (theme) => ({
  root: {
    overflow: "hidden",
    flex: "1 1 auto",
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
    color: "black",
    marginRight: "40px",
  },
  nameMember: {
    margin: "5px",
    padding: "5px",
    paddingRight: "10px",
    paddingLeft: "10px",
    borderRadius: "10px",
    backgroundColor: "#1b2c3fc5",
    color: "white",
    listStyleType: "none",
  },
  nameMemberDialog: {
    color: "white",
    textAlign: "center",
    padding: "5px",
    width: "80%",
    display: "flex",
    justifyContent: "space-between",
    margin: "auto",
    listStyleType: "none",
  },
  star: {
    fontSize: "13px",
    marginLeft: "5px",
    fill: "yellow",
  },
  edit: {
    color: "rgba(7, 14, 43, 0.840)",
    cursor: "pointer",
  },
  field: {
    margin: "0 20px 20px 30px",
  },
  saveBtn: {
    color: "white",
  },
  dialog: {
    // backgroundColor: "rgba(21, 26, 46, 0.653)",
  },
  btn: {
    cursor: "pointer",
  },
  btnDisabled: {
    fill: "grey",
  },
  dialogTitle: {
    fontSize: "18px",
  },
  deleteWindow: {
    backgroundColor: "rgba(161, 35, 35, 0.568)",
    color: "white",
  },
  deleteWindowBtn: {
    color: "white",
  },
});

export default function Members({ channel }) {
  const styles = useStyles(useTheme());

  const { oauth } = useContext(Context);

  // List members
  const [listMembers, setListMembers] = useState(channel.members);
  const [listMembersDialog, setListMembersDialog] = useState(channel.members);
  const [admin, setAdmin] = useState(channel.admin);

  useEffect(() => {
    setListMembers(channel.members);
    setAdmin(channel.admin);
  }, [channel]);

  const [currentMember, setCurrentMember] = useState("");

  const changeCurrentMember = (e) => {
    setCurrentMember(e.target.value);
  };

  const addToList = () => {
    let tempList = listMembersDialog;
    tempList.push(currentMember);
    setListMembersDialog(tempList);
    setCurrentMember("");
  };

  const removeMember = (memberIndex) => {
    let tempList = listMembersDialog;
    tempList.splice(memberIndex, 1);
    setListMembersDialog(tempList);
    setCurrentMember(" ");
  };

  // Dialog window members
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const saveEdit = async () => {
    await axios
      .put(`http://localhost:3001/channels/${channel.id}`, {
        ...channel,
        members: listMembersDialog,
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Dialog window delete
  const [openDelete, setOpenDelete] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const deleteChannel = async () => {
    await axios.delete(`http://localhost:3001/channels/${channel.id}`);
    window.location = "/";
  };

  return (
    <main css={styles.root}>
      {listMembers.map((member, i) => (
        <li key={i} css={styles.nameMember}>
          {member}
          {member === admin && (
            <Tooltip title="Admin of the channel" arrow>
              <StarIcon css={styles.star} />
            </Tooltip>
          )}
        </li>
      ))}

      {oauth.email === admin && listMembers && listMembers.length > 0 && (
        <Tooltip title="Edit members" arrow>
          <EditIcon onClick={handleClickOpen} css={styles.edit} />
        </Tooltip>
      )}

      {oauth.email === admin && (
        <Tooltip title="Remove channel" arrow>
          <DeleteIcon onClick={handleClickOpenDelete} css={styles.edit} />
        </Tooltip>
      )}

      {/* Members dialog */}
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
          Edit members of the channel
        </BootstrapDialogTitle>
        <DialogContent dividers css={styles.dialog}>
          <FormControl css={styles.field} variant="standard">
            <div>
              <InputLabel htmlFor="input-with-icon-adornment">
                Add a member
              </InputLabel>
              <Input
                onChange={changeCurrentMember}
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                }
              />
              <CheckIcon
                css={styles.btn}
                onClick={() => {
                  addToList();
                }}
              />
            </div>
          </FormControl>
          <br />

          <div css={styles.members}>
            {/* Display list */}
            {listMembersDialog.map((member, i) => (
              <li key={i} css={styles.nameMemberDialog}>
                {member}
                {member === admin ? (
                  <Tooltip title="You cannot remove the admin" arrow>
                    <PersonRemoveIcon css={styles.btnDisabled} />
                  </Tooltip>
                ) : (
                  <PersonRemoveIcon
                    css={styles.btn}
                    onClick={() => {
                      removeMember(i);
                    }}
                  />
                )}
              </li>
            ))}
          </div>
        </DialogContent>
        <DialogActions css={styles.dialog}>
          <Button
            autoFocus
            onClick={() => {
              handleClose();
              saveEdit();
            }}
            css={styles.saveBtn}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* Delete dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent css={styles.deleteWindow}>
          <DialogContentText>
            Do you really want to delete the channel ?
          </DialogContentText>
        </DialogContent>
        <DialogActions css={styles.deleteWindow}>
          <Button
            css={styles.deleteWindowBtn}
            autoFocus
            onClick={handleCloseDelete}
          >
            No
          </Button>
          <Button
            css={styles.deleteWindowBtn}
            onClick={() => {
              handleCloseDelete();
              deleteChannel();
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}

/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from "@mui/styles";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import AccountCircle from "@mui/icons-material/AccountCircle";
import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import { useContext, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Link } from "@mui/material";
import Context from "./Context";

const useStyles = (theme) => ({
  root: {
    overflow: "hidden",
    flex: "1 1 auto",
    backgroundColor: "#23303f",
  },
  title: {
    fontSize: "30px",
    width: "fit-content",
    display: "block",
    margin: "auto",
    marginTop: "30px",
    marginBottom: "30px",
  },
  field: {
    width: "fit-content",
    display: "block",
    margin: "auto",
    marginBottom: "30px",
  },
  btn: {
    cursor: "pointer",
  },
  members: {
    display: "flex",
    justifyContent: "center",
  },
  nameMember: {
    marginTop: "-20px",
    marginLeft: "5px",
    marginRight: "5px",
    marginBottom: "20px",
    backgroundColor: "#60697454",
    padding: "5px",
    paddingRight: "10px",
    paddingLeft: "10px",
    borderRadius: "5px",
    listStyleType: "none",
  },
  val: {
    color: "white",
    marginTop: "30px",
    textDecoration: "none",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
});

export default function CreateChannel() {
  const styles = useStyles(useTheme());
  const { oauth } = useContext(Context);

  const [channelName, setChannelName] = useState("");
  const [currentMember, setCurrentMember] = useState("");
  const [listMembers, setListMembers] = useState([]);

  const changeChannelName = (e) => {
    setChannelName(e.target.value);
  };

  const changeCurrentMember = (e) => {
    setCurrentMember(e.target.value);
  };

  const addToList = () => {
    // remove spaces
    setCurrentMember(currentMember.trim());

    if (currentMember !== " ") {
      let tempList = listMembers;
      tempList.push(currentMember);
      setListMembers(tempList);
      setCurrentMember("");
    }
  };

  const createChannel = async () => {
    if (channelName !== "") {
      await axios.post(`http://localhost:3001/channels`, {
        name: channelName,
        members: listMembers,
        admin: oauth.email,
      });

      window.location = "/";
    } else {
      alert("There must be a name and at least on member on the channel");
    }
  };

  return (
    <main css={styles.root}>
      {/* Add a name */}
      <div css={styles.title}>Create a channel</div>
      <TextField
        css={styles.field}
        required
        id="standard-required"
        label="Name of the channel"
        onChange={changeChannelName}
        variant="standard"
      />
      <br />

      {/* Add a member */}
      <FormControl css={styles.field} variant="standard">
        <div>
          <InputLabel htmlFor="input-with-icon-adornment">
            Add a member (email)
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
            onClick={() => {
              addToList();
            }}
            css={styles.btn}
          />
        </div>
      </FormControl>
      <br />

      <div css={styles.members}>
        {/* Display list */}
        {listMembers.map((member, i) => (
          <li key={i} css={styles.nameMember}>
            {member}
          </li>
        ))}
      </div>

      <div css={styles.actions}>
        {/* Cancel */}
        <Link href={`/`}>
          <Button css={styles.val} variant="text">
            Cancel
          </Button>
        </Link>

        {/* Send form */}
        <Button
          css={styles.val}
          variant="text"
          onClick={() => {
            createChannel();
          }}
        >
          Create
        </Button>
      </div>
    </main>
  );
}

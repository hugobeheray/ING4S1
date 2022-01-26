/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from "@mui/styles";
import ForumIcon from "@mui/icons-material/Forum";
import SettingsIcon from "@mui/icons-material/Settings";
import FaceIcon from "@mui/icons-material/Face";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { NavLink } from "react-router-dom";

const useStyles = () => ({
  root: {
    width: "80%",
    display: "block",
    margin: "auto",
    marginTop: "3px",
  },
  welcome: {
    padding: "30px",
    backgroundColor: "#23303f",
    textAlign: "center",
    borderRadius: "30px 30px 30px 0",
    color: "white",
  },
  title: {
    fontSize: "30px",
  },
  subTitle: {
    fontSize: "20px",
  },
  text: {
    width: "fit-content",
    marginLeft: "65%",
    color: "white",
    padding: "10px",
    fontSize: "18px",
    marginTop: "30px",
    backgroundColor: "#04AA6D",
    borderRadius: "30px 30px 0 30px",
  },
  icons: {
    marginTop: "50px",
    display: "flex",
    justifyContent: "center",
  },
  option: {
    color: "#23303f",
    display: "block",
    margin: "auto",
    textAlign: "center",
    fontSize: "17px",
  },
  icon: {
    fill: "#23303f",
    fontSize: "70px",
  },
  imp: {
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "10px",
  },
  text2: {
    width: "fit-content",
    color: "white",
    padding: "10px",
    fontSize: "18px",
    marginTop: "50px",
    marginLeft: "40px",
    backgroundColor: "#04AA6D",
    borderRadius: "30px 30px 30px 0px",
  },
  nav: {
    color: "white",
  },
  text3: {
    width: "fit-content",
    marginLeft: "73%",
    color: "white",
    padding: "10px",
    fontSize: "18px",
    marginTop: "30px",
    backgroundColor: "#04AA6D",
    borderRadius: "30px 30px 0 30px",
  },
});

export default function Welcome() {
  const styles = useStyles(useTheme());

  return (
    <div css={styles.root}>
      <div css={styles.welcome}>
        <div css={styles.title}>Welcome</div>
        <div css={styles.subTitle}>This is our chat application</div>
      </div>
      <div css={styles.text}>Hey you ! Here is what you can do :</div>
      <div css={styles.icons}>
        <div css={styles.option}>
          <ForumIcon css={styles.icon} /> <br />
          <div css={styles.imp}>Chat with your friends</div>
          Chat with markdown & emojis
          <br />
          Edit messages
          <br />
          Delete messages
          <br />
        </div>
        <div css={styles.option}>
          <SettingsIcon css={styles.icon} /> <br />
          <div css={styles.imp}>Edit your settings</div>
          Change your name
          <br />
          Check your email
          <br />
          Check your ID
          <br />
        </div>
        <div css={styles.option}>
          <FaceIcon css={styles.icon} /> <br />
          <div css={styles.imp}>Change your profile picture</div>
          With a selection of avatars
          <br />
          With Gravatar
          <br />
          With an uploaded picture
          <br />
        </div>
        <div css={styles.option}>
          <AddCircleOutlineIcon css={styles.icon} /> <br />
          <div css={styles.imp}>Create new channels</div>
          Be admin of a channel
          <br />
          Add and remove friends
          <br />
          Delete the channel
          <br />
        </div>
      </div>
      <div css={styles.text2}>
        Start up by creating a channel by clicking{" "}
        <NavLink css={styles.nav} to="/createChannel">
          here
        </NavLink>
      </div>
      <div css={styles.text3}>
        Or by going to{" "}
        <NavLink css={styles.nav} to="/settings">
          Settings
        </NavLink>{" "}
        ?
      </div>
    </div>
  );
}

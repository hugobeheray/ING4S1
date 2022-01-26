/** @jsxImportSource @emotion/react */
import { useContext, useState } from "react";
import axios from "axios";
import InputEmoji from "react-input-emoji";
// Layout
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/styles";
// Context
import Context from "../Context";

const useStyles = (theme) => {
  return {
    form: {
      borderTop: "2px solid #ffffffda",
      paddingTop: ".5rem",
      paddingLeft: ".5rem",
      paddingRight: ".5rem",
      display: "flex",
      backgroundColor: "rgba(16, 23, 53, 0.5)",
    },
    send: {
      border: "none",
      backgroundColor: "transparent",
      color: "white",
      marginTop: "10px",
      ":hover": {
        cursor: "pointer",
        backgroundColor: "transparent",
      },
    },
    content: {
      flex: "1 1 auto",
      marginRight: ".5rem",
      marginBottom: "10px",
      borderRadius: "10px",
    },
  };
};

export default function Form({ addMessage, channel }) {
  const { oauth } = useContext(Context);
  const [content, setContent] = useState("");
  const styles = useStyles(useTheme());
  const onSubmit = async () => {
    const { data: message } = await axios.post(
      `http://localhost:3001/channels/${channel.id}/messages`,
      {
        content: content,
        author: oauth.email,
      }
    );
    addMessage(message);
    setContent("");
  };
  const handleChange = (e) => {
    setContent(e);
    //console.log("enter", e);
  };

  return (
    <form css={styles.form} onSubmit={onSubmit} noValidate>
      {/* <TextField
        id="outlined-multiline-flexible"
        label="Message"
        multiline
        maxRows={4}
        value={content}
        onChange={handleChange}
        variant="outlined"
        css={styles.content}
      /> */}
      <InputEmoji
        value={content}
        multiline
        maxRows={4}
        onChange={handleChange}
        placeholder=""
      />
      <div>
        <Button
          variant="contained"
          color="primary"
          css={styles.send}
          endIcon={<SendIcon />}
          onClick={onSubmit}
        >
          Send
        </Button>
      </div>
    </form>
  );
}

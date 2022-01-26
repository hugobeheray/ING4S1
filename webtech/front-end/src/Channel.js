/** @jsxImportSource @emotion/react */
import { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
// Layout
import { useTheme } from "@mui/styles";
import { Fab } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// Local
import Form from "./channel/Form";
import List from "./channel/List";
import Context from "./Context";
import { useNavigate, useParams } from "react-router-dom";
import Members from "./channel/Members";

const useStyles = (theme) => ({
  root: {
    width: "100%",
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflowX: "auto",
    h3: { textAlign: "center" },
  },
  fab: {
    position: "absolute !important",
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabDisabled: {
    display: "none !important",
  },
  noAccess: {
    width: "100%",
    textAlign: "center",
    marginTop: "100px",
    color: "#23303f",
  },
  noAccessTitle: {
    fontSize: "30px",
    marginBottom: "10px",
  },
  noAccessSubTitle: {
    fontSize: "15px",
  },
});

export default function Channel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { channels, oauth } = useContext(Context);
  const channel = channels.find((channel) => channel.id === id);
  const styles = useStyles(useTheme());
  const listRef = useRef();
  const [scrollDown, setScrollDown] = useState(false);

  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        // get messages of the channel
        const { data: messages } = await axios.get(
          `http://localhost:3001/channels/${id}/messages`,
          {
            headers: {
              // TODO: secure the request
            },
          }
        );
        setMessages(messages);

        if (listRef.current) {
          listRef.current.scroll();
        }
      } catch (err) {
        navigate("/oups");
      }
    };
    fetch();
  }, [id, oauth, navigate]);

  const onScrollDown = (scrollDown) => {
    setScrollDown(scrollDown);
  };

  const onClickScroll = () => {
    listRef.current.scroll();
  };

  // On refresh, context.channel is not yet initialized
  if (!channel) {
    return <div>loading</div>;
  }
  return (
    <div css={styles.root}>
      <Members channel={channel} />
      <List
        channel={channel}
        messages={messages}
        onScrollDown={onScrollDown}
        ref={listRef}
      />
      <Form addMessage={addMessage} channel={channel} />
      <Fab
        color="primary"
        aria-label="Latest messages"
        css={[styles.fab, scrollDown || styles.fabDisabled]}
        onClick={onClickScroll}
      >
        <ArrowDropDownIcon />
      </Fab>
    </div>
  );
}

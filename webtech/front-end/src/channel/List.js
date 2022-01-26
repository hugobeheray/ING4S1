/** @jsxImportSource @emotion/react */
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
// Layout
import { useTheme } from "@mui/styles";
// Markdown
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
// Time
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";
// Context
import Context from "../Context";
// MUI
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

dayjs.extend(calendar);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  calendar: {
    sameElse: "DD/MM/YYYY hh:mm A",
  },
});

const useStyles = (theme) => ({
  root: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "auto",
    padding: "10px",
    borderTop: "3px solid 255, 255, 255, 0.855",
    backgroundColor: "white",
    "& ul": {
      margin: 0,
      padding: 0,
      textIndent: 0,
      listStyleType: 0,
    },
    "& h1": {
      marginTop: 0,
    },
  },
  message: {
    margin: ".2rem",
    marginBottom: "20px",
    padding: "1px",
    paddingRight: "10px",
    paddingLeft: "10px",
    scrollBar: "none",
    backgroundColor: "#04AA6D",
    color: "white",
    borderRadius: "20px 20px 0px 20px",
    width: "50%",
    marginLeft: "47%",
  },
  messageOther: {
    margin: ".2rem",
    marginBottom: "20px",
    padding: "1px",
    paddingRight: "10px",
    paddingLeft: "10px",
    scrollBar: "none",
    backgroundColor: "#04AA6D",
    color: "white",
    borderRadius: "20px 20px 20px 0px",
    width: "50%",
  },
  messageEdit: {
    margin: ".2rem",
    marginBottom: "20px",
    padding: "1px",
    paddingRight: "10px",
    paddingLeft: "10px",
    scrollBar: "none",
    backgroundColor: "#04AA6D",
    color: "white",
    borderRadius: "20px 20px 0px 20px",
    width: "50%",
    marginLeft: "47%",
    border: "2px dashed white",
  },
  input: {
    outline: "none",
    border: "0",
    backgroundColor: "transparent",
    color: "white",
    paddingTop: "10px",
    width: "100%",
  },
  sender: {
    margin: ".2rem",
    marginBottom: "5px",
    padding: "1px",
    paddingRight: "10px",
    paddingLeft: "10px",
    scrollBar: "none",
    color: "black",
    borderRadius: "20px 20px 0px 20px",
    width: "50%",
    marginLeft: "47%",
    display: "flex",
    justifyContent: "space-between",
  },
  senderOther: {
    margin: ".2rem",
    marginBottom: "5px",
    paddingLeft: "5px",
    paddingRight: "5px",
    scrollBar: "none",
    color: "black",
    borderRadius: "20px 20px 20px 0px",
    width: "50%",
    display: "flex",
    justifyContent: "space-between",
  },
  fabWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50px",
  },
  fab: {
    position: "fixed !important",
    top: 0,
    width: "50px",
  },
  trashEdit: {
    fontSize: "16px",
    color: "grey",
    cursor: "pointer",
  },
  hide: {
    display: "none",
  },
  checkBtn: {
    cursor: "pointer",
    marginLeft: "95%",
  },
});

export default forwardRef(({ channel, messages, onScrollDown }, ref) => {
  const styles = useStyles(useTheme());
  // Expose the `scroll` action
  useImperativeHandle(ref, () => ({
    scroll: scroll,
  }));

  const { oauth } = useContext(Context);

  // Scroll
  const rootEl = useRef(null);
  const scrollEl = useRef(null);
  const scroll = () => {
    scrollEl.current.scrollIntoView();
  };
  // See https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
  const throttleTimeout = useRef(null); // react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const rootNode = rootEl.current; // react-hooks/exhaustive-deps
    const handleScroll = () => {
      if (throttleTimeout.current === null) {
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null;
          const { scrollTop, offsetHeight, scrollHeight } = rootNode; // react-hooks/exhaustive-deps
          onScrollDown(scrollTop + offsetHeight < scrollHeight);
        }, 200);
      }
    };
    handleScroll();
    rootNode.addEventListener("scroll", handleScroll);
    return () => rootNode.removeEventListener("scroll", handleScroll);
  });

  // Delete message
  const deleteMessage = async (i) => {
    axios.delete(
      `http://localhost:3001/channels/${channel.id}/messages/${messages[i].creation}`
    );
    window.location.reload();
  };

  const handleChange = (e) => {
    setEditContent(e.target.value);
  };

  const editMessage = async (i) => {
    await axios.put(
      `http://localhost:3001/channels/${channel.id}/messages/${messages[i].creation}`,
      {
        content: editContent,
        author: oauth.email,
      }
    );
    window.location.reload();
  };

  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [editContent, setEditContent] = useState("");

  return (
    <div css={styles.root} ref={rootEl}>
      <h1>Messages for {channel.name}</h1>
      <ul>
        {messages.map((message, i) => {
          const { value } = unified()
            .use(markdown)
            .use(remark2rehype)
            .use(html)
            .processSync(message.content);
          return (
            <li key={i}>
              <p
                css={
                  message.author === oauth.email
                    ? styles.sender
                    : styles.senderOther
                }
              >
                <span>{message.author}</span>
                <span>{dayjs().calendar(message.creation)}</span>
                <span css={message.author !== oauth.email && styles.hide}>
                  <DeleteOutlinedIcon
                    onClick={() => {
                      deleteMessage(i);
                    }}
                    css={styles.trashEdit}
                  />
                  <EditIcon
                    onClick={() => {
                      setEdit(true);
                      setEditIndex(i);
                    }}
                    css={styles.trashEdit}
                  />
                </span>
              </p>
              {edit && editIndex === i ? (
                <div css={styles.messageEdit}>
                  <input
                    css={styles.input}
                    defaultValue={message.content}
                    onChange={handleChange}
                  />
                  <br />
                  <CheckIcon
                    onClick={() => {
                      editMessage(i);
                    }}
                    css={styles.checkBtn}
                  />
                </div>
              ) : (
                <div
                  css={
                    message.author === oauth.email
                      ? styles.message
                      : styles.messageOther
                  }
                  dangerouslySetInnerHTML={{ __html: value }}
                ></div>
              )}
            </li>
          );
        })}
      </ul>
      <div ref={scrollEl} />
    </div>
  );
});

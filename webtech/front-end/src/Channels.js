/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from "react";
import axios from "axios";
// Layout
import { Link } from "@mui/material";
// Local
import Context from "./Context";
import { useNavigate } from "react-router-dom";

const styles = {
  channelList: {
    textAlign: "center",
    paddingTop: "10px",
  },
  channelLink: {
    color: "rgba(255, 255, 255, 0.8)",
    textDecoration: "none",
  },
  barre: {
    width: "50%",
    height: "1px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "block",
    margin: "auto",
    marginTop: "10px",
  },
};

export default function Channels() {
  const { oauth, channels, setChannels } = useContext(Context);

  const naviate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/channelsUser/${oauth.email}`
        );
        setChannels(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, [oauth, channels, setChannels]);

  return (
    <ul>
      {channels.map((channel, i) => (
        <li key={i} css={styles.channelList}>
          <Link
            href={`/channels/${channel.id}`}
            onClick={(e) => {
              e.preventDefault();
              naviate(`/channels/${channel.id}`);
            }}
            css={styles.channelLink}
          >
            {channel.name}
          </Link>
          <div css={styles.barre} />
        </li>
      ))}
    </ul>
  );
}

/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import Context from "./Context";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";

const useStyles = (theme) => ({
  root: {
    backgroundColor: "#23303f",
    overflow: "hidden",
    flex: "1 1 auto",
    alignItems: "center",
  },
  title: {
    fontSize: "30px",
    width: "fit-content",
    display: "block",
    margin: "auto",
    marginTop: "30px",
    marginBottom: "50px",
  },
  field: {
    width: "fit-content",
    display: "block",
    margin: "auto",
    marginTop: "20px",
  },
  tf: {
    marginRight: "10px",
    marginLeft: "10px",
  },
  val: {
    color: "white",
    textDecoration: "none",
    cursor: "pointer",
    border: "1px solid white",
    borderRadius: "10px",
    padding: "10px",
    width: "fit-content",
    display: "block",
    margin: "auto",
    transition: "0.25s",
    backgroundColor: "transparent",
    ":hover": {
      padding: "15px",
      backgroundColor: "#ffffffda",
      border: "0px",
      color: "rgba(16, 23, 53, 0.774)",
      fontWeight: "bold",
    },
  },
});

export default function Settings() {
  const styles = useStyles(useTheme());
  const { oauth, setOauth } = useContext(Context);

  const [language, setLanguage] = useState("en");
  const changeLanguage = (event) => {
    setLanguage(event.target.value);
  };

  const [name, setName] = useState(oauth.name);
  const changeName = (e) => {
    setName(e.target.value);
  };

  const applySettings = async () => {
    const { data } = await axios.put(
      `http://localhost:3001/users/${oauth.id}`,
      {
        ...oauth,
        language: language,
        name: name,
      }
    );
    setOauth(data);
    alert("Your settings have been updated");
  };

  return (
    <main css={styles.root}>
      {/* <div css={styles.title}>{t("settings")}</div> */}
      <div css={styles.title}>Settings</div>
      {/* <div css={styles.field}>
        <Switch {...label} />
        Night mode
      </div> */}
      <div css={styles.field}>
        <Tooltip title="You cannot edit this" arrow>
          {oauth && (
            <TextField
              css={styles.tf}
              disabled
              id="standard-required"
              label="ID"
              defaultValue={oauth.id}
              variant="standard"
            />
          )}
        </Tooltip>
        <Tooltip title="You cannot edit this" arrow>
          <TextField
            disabled
            css={styles.tf}
            id="standard-required"
            label="Email"
            defaultValue={oauth.email}
            variant="standard"
          />
        </Tooltip>
        <TextField
          css={styles.tf}
          id="standard-required"
          label="Name"
          defaultValue={name}
          variant="standard"
          onChange={changeName}
        />
      </div>
      <div css={styles.field}>
        <FormControl disabled variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Language
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            defaultValue={language}
            onChange={changeLanguage}
            label="Age"
          >
            <MenuItem value={"fr"}>Français</MenuItem>
            <MenuItem value={"en"}>English</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Send form */}
      <div css={styles.field}>
        <button
          variant="contained"
          css={styles.val}
          onClick={() => {
            applySettings();
          }}
        >
          Apply settings
        </button>
      </div>
    </main>
  );
}

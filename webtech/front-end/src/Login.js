/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import crypto from "crypto";
import qs from "qs";
import axios from "axios";
// Layout
import { useTheme } from "@mui/styles";
import { Link } from "@mui/material";
// Local
import Context from "./Context";
import { useNavigate } from "react-router-dom";

const base64URLEncode = (str) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const sha256 = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest();
};

const useStyles = (theme) => ({
  root: {
    flex: "1 1 auto",
    backgroundColor: "rgba(7, 14, 43, 0.840)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "& > a": {
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
      ":hover": {
        padding: "15px",
        backgroundColor: "#ffffffda",
        border: "0px",
        color: "rgba(16, 23, 53, 0.774)",
        fontWeight: "bold",
      },
    },
  },
});

const Redirect = ({ config, codeVerifier }) => {
  const styles = useStyles(useTheme());
  const redirect = (e) => {
    e.stopPropagation();
    const code_challenge = base64URLEncode(sha256(codeVerifier));
    const url = [
      `${config.authorization_endpoint}?`,
      `client_id=${config.client_id}&`,
      `scope=${config.scope}&`,
      `response_type=code&`,
      `redirect_uri=${config.redirect_uri}&`,
      `code_challenge=${code_challenge}&`,
      `code_challenge_method=S256`,
    ].join("");
    window.location = url;
  };
  return (
    <div css={styles.root}>
      <Link onClick={redirect} color="secondary">
        Login with OpenID Connect and OAuth2
      </Link>
    </div>
  );
};

const Tokens = ({ oauth }) => {
  const { setOauth } = useContext(Context);
  const styles = useStyles(useTheme());
  const { id_token } = oauth;
  const id_payload = id_token.split(".")[1];
  const { email } = JSON.parse(atob(id_payload));
  const logout = (e) => {
    e.stopPropagation();
    setOauth(null);
  };

  return (
    <div css={styles.root}>
      Welcome {email}{" "}
      <Link onClick={logout} color="secondary">
        logout
      </Link>
    </div>
  );
};

const LoadToken = ({ code, codeVerifier, config, removeCookie, setOauth }) => {
  const styles = useStyles(useTheme());
  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.post(
          config.token_endpoint,
          qs.stringify({
            grant_type: "authorization_code",
            client_id: `${config.client_id}`,
            code_verifier: `${codeVerifier}`,
            redirect_uri: `${config.redirect_uri}`,
            code: `${code}`,
          })
        );
        removeCookie("code_verifier");
        setOauth(data);

        // get all users to check if it allready exist
        const { data: allUsers } = await axios.get(
          `http://localhost:3001/users`,
          {
            headers: {},
          }
        );

        let exist = false;

        // if it already exist
        // eslint-disable-next-line array-callback-return
        allUsers.map((u) => {
          if (data.email === u.username) {
            setOauth(u);
            exist = true;
          }
        });

        // if it doesn't exist
        if (!exist) {
          // create user
          await axios.post(`http://localhost:3001/users`, {
            ...data,
            username: data.email,
            profilePic: 0,
            language: "en",
            night: "white",
            name: "",
            upload: "",
          });

          // retrive informations
          const { data: allUsersDE } = await axios.get(
            `http://localhost:3001/users`,
            {
              headers: {},
            }
          );
          // eslint-disable-next-line array-callback-return
          allUsersDE.map((u) => {
            if (data.email === u.username) {
              setOauth(u);
            }
          });
        }

        navigate("/");
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  });
  return <div css={styles.root}>Loading tokens</div>;
};

export default function Login({ onUser }) {
  const styles = useStyles(useTheme());
  // const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const { oauth, setOauth } = useContext(Context);
  const config = {
    authorization_endpoint: "http://localhost:5556/dex/auth",
    token_endpoint: "http://localhost:5556/dex/token",
    client_id: "webtech-frontend",
    redirect_uri: "http://localhost:3000",
    scope: "openid%20email%20offline_access%20profile",
  };
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  // is there a code query parameters in the url
  if (!code) {
    // no: we are not being redirected from an oauth server
    if (!oauth) {
      const codeVerifier = base64URLEncode(crypto.randomBytes(32));
      setCookie("code_verifier", codeVerifier);
      return (
        <Redirect
          codeVerifier={codeVerifier}
          config={config}
          css={styles.root}
        />
      );
    } else {
      // yes: user is already logged in, great, is is working
      return <Tokens oauth={oauth} css={styles.root} />;
    }
  } else {
    // yes: we are coming from an oauth server
    return (
      <LoadToken
        code={code}
        codeVerifier={cookies.code_verifier}
        config={config}
        setOauth={setOauth}
        oauth={oauth}
        removeCookie={removeCookie}
      />
    );
  }
}

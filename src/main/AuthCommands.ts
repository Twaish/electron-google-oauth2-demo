import express, { Application, Request, Response } from "express"
import { OAuth2Client } from "google-auth-library"
import { shell } from "electron"
import axios from "axios"

// Scopes can be configuered inside the OAuth consent screen
// https://console.cloud.google.com/apis/credentials/consent
const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
]

// We need a redirect uri to receive data after the login
// which will be locally hosted with express at this port 
const redirectUriPort = 13337

// Generate the oauth client id and secret at
// https://console.cloud.google.com/apis/credentials
// REMEMBER TO SET THE APPLICATION TYPE TO "Desktop app"
const GOOGLE_OAUTH_CLIENT_ID = "INSERT_CLIENT_ID"
const GOOGLE_OAUTH_CLIENT_SECRET = "INSERT_CLIENT_SECRET"

const authClient = new OAuth2Client({
  clientId: GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: `http://localhost:${redirectUriPort}/auth`,
})

let server
export default ({ send }) => {
  function signInWithGoogle() {
    server?.close()
    
    const app: Application = express()
    app.get("/auth", async (req: Request, res: Response) => {
      const code = req.query.code

      if (!code) {
        res.send('No code found in the query')
        return
      }

      await handleAuthCode(code)
      res.send('Authentication successful! You can close this window.')
      
      server.close()
      server = null
    })
    server = app.listen(redirectUriPort, () => {
      const authUrl = authClient.generateAuthUrl({
        access_type: "offline",
        scope: scopes
      })
      shell.openExternal(authUrl)
    })
  }

  async function handleAuthCode(code) {
    authClient
      .getToken(code)
      .then(async ({ tokens }) => {
        if (!tokens) return
        authClient.setCredentials(tokens)

        const accessToken = tokens.access_token
        const user = await getUserInfo(accessToken)
        if (user) {
          send("auth:googleSuccess", user)
        }
      })
      .catch((err) => {
        console.error('Error getting tokens: ', err)
      })
  }
  async function getUserInfo(accessToken) {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  }

  return {
    "auth:google": () => {
      signInWithGoogle()
    }
  }
}
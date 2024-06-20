Made using the [electron-vite](https://github.com/alex8088/electron-vite) toolchain

# electron-google-oauth2-demo
A demo electron application with React and TypeScript, that uses `google-auth-library` to handle Google login

The authentication process starts by clicking a button inside the app, which opens a url for the user to login with Google. After logging in, it fetches the users details and passes them to the frontend to be displayed.

Authentication happens inside [AuthCommands.ts](src/main/AuthCommands.ts)

## Project Setup
### Clone
```bash
$ git clone https://github.com/Twaish/electron-google-oauth2-demo.git your-project-name
$ cd your-project-name
```

### Install
```bash
$ npm i
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

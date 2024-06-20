import styles from "./index.module.css"

const LoginButton: React.FC = () => {

  function signInWithGoogle() {
    api.run("auth:google")
  }

  return (
    <button className={styles.button} onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

export default LoginButton
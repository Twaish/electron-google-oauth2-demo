import { useAuth } from "@renderer/contexts/AuthContext"
import styles from "./index.module.css"

const UserData: React.FC = () => {
  const { currentUser } = useAuth()

  return (
    <pre className={styles.container}>
      {currentUser ? (
        JSON.stringify(currentUser, null, 2)
      ) : (
        <p>No user data</p>
      )}
    </pre>
  )
}
export default UserData
import styles from './Navbar.module.css'

export default function Navbar({ user, onLogout, children }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        Vi<span>Notes</span>
      </div>
      <div className={styles.center}>{children}</div>
      {user && (
        <div className={styles.right}>
          <div className={styles.avatar}>{user.name.slice(0, 2).toUpperCase()}</div>
          <span className={styles.username}>{user.name}</span>
          <button className="btn btn-sm btn-ghost" onClick={onLogout}>
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}

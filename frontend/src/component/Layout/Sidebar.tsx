import type React from 'react'
import { NavLink, type NavLinkRenderProps } from 'react-router-dom'
import styles from './LayoutShell.module.css'

export const Sidebar: React.FC = () => {
  return (
    <nav className={styles.sidebarNav}>
      <NavLink
        to='/team'
        className={({ isActive } : NavLinkRenderProps) =>
          `${styles.navItem} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.navIcon}>🏠</span>
        <span className={styles.navLabel}>チーム</span>
      </NavLink>
      <NavLink
        to='/games'
        className={({ isActive } : NavLinkRenderProps) =>
          `${styles.navItem} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.navIcon}>⚾</span>
        <span className={styles.navLabel}>試合</span>
      </NavLink>
      <NavLink
        to='/members'
        className={({ isActive } : NavLinkRenderProps) =>
          `${styles.navItem} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.navIcon}>👥</span>
        <span className={styles.navLabel}>選手</span>
      </NavLink>
      <NavLink
        to='/login'
        className={({ isActive } : NavLinkRenderProps) =>
          `${styles.navItem} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.navIcon}>👤</span>
        <span className={styles.navLabel}>ログイン</span>
      </NavLink>
    </nav>
  )
}

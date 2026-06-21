import type React from 'react'
// import { Sidebar } from './Sidebar'
import styles from './LayoutShell.module.css'
import { Header } from '../../common/Header/Header'
import { Footer } from '../../common/Footer/Footer'
// import { BottomContent } from '../../common/BottomContent/BottomContent'

export const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.shell}>
      {/* PC：上部ヘッダー / スマホ：ヘッダーのみ（サイドバーなし） */}
      <Header />

      <div className={styles.body}>
        {/* メインコンテンツ */}
        <main className={styles.main}>
          {children}
        </main>

        {/* PC のみサイドバー表示（CSSで制御） */}
        {/* <aside className={styles.sidebar}>
          <Sidebar />
        </aside> */}
      </div>

      {/* スマホのみボトムナビ表示（CSSで制御） */}
      {/* <nav className={styles.bottomNav}>
        <BottomNav />
      </nav> */}
      {/* <BottomContent /> */}
      <Footer />
    </div>
  )
}

import type React from "react";
import style from './RootPage.module.css';

export const RootPage: React.FC = () => {
  return (
    <>
      <div className={style.cta}>
        <div className={style.ctactn}>
          <h2 className={style.topMassage}>野球チーム成績管理を、もっとシンプルに、面白く。</h2>
          <p>Scobitは、試合結果・個人成績・チーム情報を一元管理できる野球チーム向けサービスです。</p>
        </div>
        <div className={style.btnbox}>
          <a href="/new" className={style.btn_primary}>無料で始める</a>
          <a href="/login" className={style.btn_secondary}>ログイン</a>
        </div>
      </div>
      <div className={style.cards}>
        <div className={style.card}>
          <h3 className={style.subTitle}>選手情報を管理しづらい</h3>
          <p>
            メンバー構成や能力を把握しにくい。
          </p>
        </div>

        <div className={style.card}>
          <h3 className={style.subTitle}>画面が味気ない</h3>
          <p>
            選手たちの成績が数字の羅列で面白くない。
          </p>
        </div>

        <div className={style.card}>
          <h3 className={style.subTitle}>試合結果が散らばる</h3>
          <p>
            LINEやスコアブック、Excelなどに情報が分散し、
            振り返りが難しい。
          </p>
        </div>

        <div className={style.card}>
          <h3 className={style.subTitle}>成績集計が面倒</h3>
          <p>
            打率や打点などを毎回手計算で集計している。
          </p>
        </div>
      </div>
      <p className={style.lead}>
        試合結果・選手情報・個人成績をひとつにまとめ、
        チーム運営をもっとシンプルにします。
      </p>

      <h2 className={style.mainTitle}>主な機能</h2>
      <div className={style.featureGrid}>

        <div className={style.feature}>
          <h3 className={style.subTitle}>試合管理</h3>
          <p>
            試合結果やスコアを簡単登録。
            過去の試合もいつでも確認できます。
          </p>
          <p>
            入力項目は、５項目（打席数、安打数、本塁打数、盗塁、エラー数）のみ！
          </p>
          <p>
            簡単だから継続できます！
          </p>
        </div>

        <div className={style.feature}>
          <h3 className={style.subTitle}>個人成績管理</h3>
          <p>
            打率・安打数・打点などを自動集計し、
            選手ごとの成績を可視化します。
          </p>
        </div>

        <div className={style.feature}>
          <h3 className={style.subTitle}>選手管理</h3>
          <p>
            選手プロフィールや能力値を管理できます。
          </p>
          <p>
            試合成績に応じて、選手能力値が変化します！
          </p>
        </div>

        <div className={style.feature}>
          <h3 className={style.subTitle}>チーム共有</h3>
          <p>
            チーム全員が最新の試合結果や成績を確認できます。
          </p>
          <p>
            自サイト等から遷移できるリンクを生成できます。
          </p>
        </div>

      </div>
      <h2 className={style.mainTitle}>利用までのステップ</h2>
      <div className="step-list">
        <div className={style.step}>
          <h3 className={style.mgn}>
            <span className={style.disc}>01</span>
            チーム作成
          </h3>
          <p>チームを登録します。</p>
        </div>

        <div className={style.step}>
          <h3 className={style.mgn}>
            <span className={style.disc}>02</span>
            選手登録
          </h3>
          <p>所属選手を登録します。</p>
        </div>

        <div className={style.step}>
          <h3 className={style.mgn}>
            <span className={style.disc}>03</span>
            試合結果入力
          </h3>
          <p>試合結果を入力するだけで成績が集計されます。</p>
        </div>

      </div>
      <p className={style.lead}>
        試合結果も個人成績も、Scobitでまとめて管理。
      </p>

      <div className={style.btnbox}>
        <a href="/new" className={style.btn_primary}>
          無料で始める
        </a>
      </div>
    </>
  )
}
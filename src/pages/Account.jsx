import React from 'react'
import { useAuth } from "../General/useAuth";
import "./Account.css"

export default function Account() {

  //ユーザー情報取得
  const { logout, getUserName } = useAuth();

  //ログアウト
  const signOutRedirect = () => {
    logout();
  };

  return (
    <div className="account-page">
      <div className="account-wrapper">

        <h1 className="page-title">アカウント</h1>

        <div className="account-card">
          <div className="account-item">
            <span className="account-item-label">ユーザー名</span>
            <span className="account-item-value">{getUserName()}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={() => signOutRedirect()}>ログアウト</button>

      </div>
    </div>
  )
}

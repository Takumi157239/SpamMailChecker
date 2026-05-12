import React from 'react'
import { useAuth } from "../General/useAuth";
import PostListForm from '../components/PostListForm'
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

        <h1 className="account-page-title">アカウント</h1>

        <div className="account-card">
          <div className="account-item">
            <span className="account-item-label">ユーザー名：</span>
            <span className="account-item-value">{getUserName()}</span>
          </div>
        </div>

        <h1 className="account-page-title">投稿履歴</h1>
        <PostListForm PostListHeight="calc(100vh - 450px)" UserName={getUserName()} isDelete={true}/>
        <br/>
        <button className="logout-btn" onClick={() => signOutRedirect()}>ログアウト</button>
        
      </div>
    </div>
  )
}

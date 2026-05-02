import React from 'react'
import { useAuth } from "../General/useAuth";

export default function Account() {

  const { logout } = useAuth();

  const signOutRedirect = () => {
    logout();
  };

  return (
    <div>
      <button onClick={() => signOutRedirect()}>ログアウト</button>
    </div>
  )
}

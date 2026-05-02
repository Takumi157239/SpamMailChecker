import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import SpamBoard from "./pages/SpamBoard"
import Account from "./pages/Account"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "react-oidc-context";


function App() {
  
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {

    //IDトークンとUserNameを取得
    const id_token = auth.user?.id_token;                      //IDトークン
    const payload = JSON.parse(atob(id_token.split(".")[1]));  //UserName
    
    //IDトークンUserNameをを保存
    sessionStorage.setItem("id_token", id_token);                   //IDトークン
    sessionStorage.setItem("username",payload["cognito:username"]); //UserName

    return (
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/spamboard" element={<SpamBoard />} />
            <Route path="/account" element={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    auth.signinRedirect()
  );
}

export default App;

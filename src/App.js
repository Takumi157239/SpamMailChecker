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

    //IDトークンを保存
    sessionStorage.setItem("id_token", auth.user?.id_token);

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

import { AccessURL, AWSCognitoInfo } from "../General/Const"

export const useAuth = () => {

  //IDトークンの取得
  const getIdToken = () => {
    return sessionStorage.getItem("id_token");
  };

  //ログアウト
  const logout = () => {
    sessionStorage.clear();
    const clientId = AWSCognitoInfo.clientId;
    const logoutUri = AccessURL;
    const cognitoDomain = AWSCognitoInfo.cognitoDomain;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return { getIdToken, logout };
};
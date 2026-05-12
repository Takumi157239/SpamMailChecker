import React, {useState} from 'react'
import { useAuth } from "../General/useAuth";
import { AWSApiGatewayInfo } from "../General/Const"
import "./PostForm.css"


//投稿処理を行うコンポーネント
export default function PostForm({ isOpen, onClose, onPostSuccess }) {

    //ユーザー情報・IDトークン取得
    const { getUserName, getIdToken } = useAuth();

    //投稿内容を保存する
    const [body, setBody] = useState("");

    if (!isOpen) return null;

    //投稿を行う処理
    const PostRun = async () => {

        //本文入力確認
        if (!body.trim()) {
            alert("本文を入力してください");
            return;
        }

        // ユーザー名取得
        const UserName = getUserName();

        //トークン取得
        const token = getIdToken();

        //投稿データ登録リクエスト
        const res = await fetch(AWSApiGatewayInfo.RequestURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                type: "postdata_toukou",
                PostBody: body.trim(),
                UserName: UserName
            }),
        });

        //レスポンスデータ取得
        const respons_data = await res.json();

        //正常に投稿されたか判定
        if (respons_data.statusCode === 200){
            alert("投稿完了!");
        }
        else{
            alert("投稿時にエラーが発生しました");
        }

        //リロードさせる
        onPostSuccess();

        //投稿画面を閉じる
        onClose()
    };


    return (
    <div className="modal-overlay">

        <div className="modal-content">

            <div className="modal-header">
                <h2>投稿</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            <div className="user-area">
                ユーザー名：{getUserName()}
            </div>

            <textarea className="post-textarea" placeholder="本文を入力してください" value={body} onChange={(e) => setBody(e.target.value)}/>

            <button className="submit-button" onClick={PostRun}>投稿する</button>

        </div>

    </div>
    )
}

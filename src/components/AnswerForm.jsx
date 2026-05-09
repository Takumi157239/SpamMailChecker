import React, { useState } from 'react'
import { useAuth } from "../General/useAuth";
import { AWSApiGatewayInfo } from "../General/Const"
import "./AnswerForm.css"


export default function AnswerForm({ isOpen, onClose, answers, postKey, post }) {

    //回答内容を保存する
    const [answer, setAnswer] = useState("");

    //ユーザー情報・IDトークン取得
    const { getUserName, getIdToken } = useAuth();

    if (!isOpen) return null;

    //回答を投稿する
    const AnswerPostRun = async () => {

        //回答入力確認
        if (!answer.trim()) {
            alert("回答を入力してください");
            return;
        }

        // ユーザー名取得
        const UserName = getUserName();

        //トークン取得
        const token = getIdToken();

        console.log(postKey);

        //投稿データ登録リクエスト
        const res = await fetch(AWSApiGatewayInfo.RequestURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                type: "postdata_ans",
                PostKey: postKey,
                PostBody: answer.trim(),
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

        //投稿画面を閉じる
        onClose()
    };

    return (
        <div className="modal-overlay">

            <div className="answer-modal">

                <div className="modal-header">
                    <h2>回答</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="answer-list">

                    {answers?.map((answer) => (
                        <div className="answer-item" key={answer.CreatedAt}>
                            <div className="answer-user">
                                {answer.UserName}
                            </div>

                            <div className="answer-body">
                                {answer.Body}
                            </div>
                        </div>
                    ))}

                </div>

                <div className="answer-input-area">

                    <textarea className="answer-textarea" placeholder="回答を入力してください" value={answer} onChange={(e) => setAnswer(e.target.value)} />

                    <button className="answer-submit-button" onClick={AnswerPostRun}>
                        回答する
                    </button>

                </div>
            </div>
        </div>
    )
}

import { useState } from 'react'
import { useAuth } from "../General/useAuth";
import { AWSApiGatewayInfo } from "../General/Const"
import SpamResult from "../components/SpamResult"
import "./Home.css";

export default function Home() {

    //メール情報
    const [domain, setDomain] = useState("");    //ドメイン
    const [subject, setSubject] = useState("");  //件名
    const [body, setBody] = useState("");        //本文

    //AI判定結果
    const [risk, setRisk] = useState("");
    const [reason, setReason] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    //IDトークン取得
    const { getIdToken } = useAuth();

    //スパムチェック処理
    const checkSpam = async () => {
        debugger;
        //ドメイン入力チェック
        if (domain !== ""){
            if (domain.substr(0, 1) !== "@"){
                alert('@から始まる文字を入力してください');
                return;
            }
        }

        //件名は必須入力
        if (subject === ""){
            alert('件名が入力されていません');
            return;
        }

        const token = getIdToken();
        const res = await fetch(AWSApiGatewayInfo.RequestURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                type: "openai",
                domain: domain,
                subject: subject,
                mainText: body
            }),
        });
        
        //レスポンスデータ取得
        const respons_data = await res.json();
        const respons_json = JSON.parse(respons_data.choices[0].message.content);

        //レスポンスデータをセットする
        setRisk(respons_json.risk);     //high | middle | low
        setReason(respons_json.reason); //理由（50文字以内）
        setIsOpen(true);                //結果を開く
    };

  return (
    <div className="container">
        
        {/* 入力フォーム */}
        <div className="SpamInputForm">
            <label>ドメイン</label>
            <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="例)@xxx.com"
                className="SpamInputBox"
            />

            <label>件名 <label className='LaNote'>※入力必須項目</label></label>
            <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="SpamInputBox"
            />
            

            <label>本文</label>
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="SpamInputBoxTextarea"
            />

            <label className='LaNote'>※個人情報や機密情報などは送信しないでください</label>

            <button onClick={checkSpam} className="BtDiscrimination">
                判定する
            </button>
        </div>


        {/* 結果呼び出し */}
        <SpamResult
            isOpen={isOpen}
            risk={risk}
            reason={reason}
            onClose={() => setIsOpen(false)}
        />

    </div>
  )
}

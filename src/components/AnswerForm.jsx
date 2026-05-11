import React, { useState, useRef , useEffect} from 'react'
import { useAuth } from "../General/useAuth";
import { AWSApiGatewayInfo } from "../General/Const"
import "./AnswerForm.css"


//回答表示コンポーネント
export default function AnswerForm({ isOpen, onClose, postKey, post }) {

    //コンポーネント表示時に実行
    useEffect(() => {
        if (!isOpen) return 
        GetSpamBordAnswerData(postKey);
    }, [isOpen]);

    //DynamoDBから取得した回答を保存する
    const [answers, setAnswers] = useState([]);

    //ユーザーが入力した回答内容を保存する
    const [answer, setAnswer] = useState("");

    //ユーザー情報・IDトークン取得
    const { getUserName, getIdToken } = useAuth();

    //回答データが最後か判別する
    const [LastAnswer, setLastAnswer] = useState(false);

    //回答データの続きデータを保持する
    const [answersLastKey, setAnswersLastKey] = useState(null);

    //アクセス過多エラーメッセージ
    const [serverErrorMessage, setServerErrorMessage] = useState(false);

    //スクロール監視用
    const answerBoxRef = useRef(null);
    const [answerShowMore, setAnswerShowMore] = useState(false);

    //回答を取得
    const GetSpamBordAnswerData = async (pk, lastKey = null, showMore = false) => {

        if (pk === "") return;

        const token = getIdToken();
        const res = await fetch(AWSApiGatewayInfo.RequestURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                type: "getdata_ans",
                PostKey: pk,
                LastKey: lastKey
            }),
        });

        //レスポンスデータ取得
        const respons_data = await res.json();

        if (respons_data.items !== undefined) {

            //回答データを格納
            if (showMore){
                setAnswers(prev => [...prev, ...respons_data.items]);
            }
            else{
                setAnswers(respons_data.items);
            }

            //続きからのデータを格納
            setAnswersLastKey(respons_data.lastKey);

            //lastKeyがnullになったら、これ以上の回答はありませんと表示させる
            if (respons_data.lastKey === null){
                setLastAnswer(true);
            }
        }
        else{
            setServerErrorMessage(true);
        }
    }

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
            alert("回答完了!");
        }
        else{
            alert("回答時にエラーが発生しました");
        }

        //投稿画面を閉じる
        onClose()
    };


    if (!isOpen) return null;


    const answerHandleScroll = () => {

        const el = answerBoxRef.current;
        if (!el) return;

        // スクロールが最下部に近いか判定
        const isBottom =
            el.scrollTop + el.clientHeight >= el.scrollHeight;

        setAnswerShowMore(isBottom);
    };

    return (
        <div className="modal-overlay">

            <div className="answer-modal">

                <div className="modal-header">
                    <h2>回答</h2>
                    <button className="close-button" style={{display: isOpen ? "flex" : "none"}} onClick={onClose}>×</button>
                </div>

                <div className="answer-list" ref={answerBoxRef} onScroll={answerHandleScroll}>

                    {answers?.map((answer) => (
                        <div className="answer-item" key={answer.CommentId}>
                            <div className="answer-user">
                                {answer.UserName}
                            </div>

                            <div className="answer-body">
                                {answer.Body}
                            </div>
                        </div>
                    ))}

                </div>

                {LastAnswer && (
                    <div className="postEndMessage">これ以上の回答はありません</div>
                )}

                {serverErrorMessage && (
                    <div className="postErrorMessage">アクセスが混雑しています<br/>閉じたあとに時間をおいてもう一度開きなおしてください</div>
                )}

                {answerShowMore && !LastAnswer && (
                    <div className="btShowMoreArea">
                        <button className="btShowMore" onClick={() => {
                            if (answersLastKey !== null){
                                GetSpamBordAnswerData(postKey, answersLastKey, true);
                            }
                        }}>
                            さらに10件表示
                        </button>
                    </div>
                )}

                <br/>

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

import React, { useState, useEffect }from 'react'
import { useAuth } from "../General/useAuth";
import { AWSApiGatewayInfo } from "../General/Const"
import AnswerForm from '../components/AnswerForm';
import PostForm from '../components/PostForm';
import "./SpamBoard.css"

export default function SpamBoard() {

    //コンポーネント表示時に実行
    useEffect(() => {
        GetSpamBordData();
    });

    //投稿データを格納する
    const [posts, setPosts] = useState([]);

    //回答データを格納する
    const [answes, setAnswers] = useState([]);

    //投稿データのキーを格納する
    const [postKey, setPostKey] = useState("");

    //回答フォーム起動
    const [isAnswerFormOpen, setIsAnswerFormOpen] = useState(false);

    //投稿フォーム起動
    const [isPostFormOpen, setIsPostFormOpen] = useState(false);

    //選択されている投稿データを保持
    const [selectedPost, setSelectedPost] = useState(null);

    //IDトークン取得
    const { getIdToken } = useAuth();

    //投稿内容を取得
    const GetSpamBordData = async () => {
        
        const token = getIdToken();
        const res = await fetch(AWSApiGatewayInfo.RequestURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
            type: "getdata_toukou"
            }),
        });

        //レスポンスデータ取得
        const respons_data = await res.json();

        setPosts(respons_data.items)
    }

    //回答を取得
    const GetSpamBordAnswerData = async (pk) => {
        
        const token = getIdToken();
        const res = await fetch(AWSApiGatewayInfo.RequestURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                type: "getdata_ans",
                PostKey: pk
            }),
        });

        //レスポンスデータ取得
        const respons_data = await res.json();

        setAnswers(respons_data.items);
        setPostKey(pk);
    }

    return (
        <div className="board-wrapper">
            <div className="board-container">
                <h1 className="board-title">迷惑メール相談所</h1>

                <button className="floating-post-button" onClick={() => setIsPostFormOpen(true)}>投稿</button>

                <PostForm isOpen={isPostFormOpen} onClose={() => setIsPostFormOpen(false)}/>

                <div className="post-list">
                {posts?.map((post) => (
                    <div className="post-card" key={post.CreatedAt}>

                        {/* 投稿ヘッダー */}
                        <div className="post-header">
                            <div className="user-icon">{post.UserName.charAt(0)}</div>
                            <div>
                                <div className="user-name">{post.UserName}</div>
                                <div className="post-date">投稿日: {post.CreatedAt}</div>
                            </div>
                        </div>

                        {/* 本文 */}
                        <div className="post-body">
                            {post.Body}
                        </div>

                        {/* 回答 */}
                        <div className="comment-area" onClick={() => {
                            setSelectedPost(post);
                            setIsAnswerFormOpen(true);
                            GetSpamBordAnswerData(post.PK);
                        }}>
                            <div className="comment-title">
                                回答 {post.CommentCount}件
                            </div>
                        </div>

                        {/* 回答フォーム呼び出し */}
                        <AnswerForm 
                            isOpen={isAnswerFormOpen} 
                            onClose={() => setIsAnswerFormOpen(false)} 
                            answers={answes} 
                            postKey = {postKey}
                            post={selectedPost}
                        />

                    </div>
                ))}

                </div>
            </div>
        </div>
    )
}

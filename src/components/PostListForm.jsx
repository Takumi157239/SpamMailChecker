import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from "../General/useAuth";
import { AWSApiGatewayInfo } from "../General/Const"
import AnswerForm from '../components/AnswerForm';
import "./PostListForm.css"


//投稿データ一覧を表示するコンポーネント
export default function PostListForm({PostListHeight, UserName = null }) {

    //コンポーネント表示時に実行
    useEffect(() => {
        GetSpamBordData();
    }, []);

    //投稿データを格納する
    const [posts, setPosts] = useState([]);

    //投稿データの続きデータを保持する
    const [postsLastKey, setPostsLastKey] = useState(null);

    //投稿データが最後か判別する
    const [LastPost, setLastPost] = useState(false);

    //投稿データのキーを格納する
    const [postKey, setPostKey] = useState("");

    //回答フォーム起動
    const [isAnswerFormOpen, setIsAnswerFormOpen] = useState(false);

    //選択されている投稿データを保持
    const [selectedPost, setSelectedPost] = useState(null);

    //IDトークン取得
    const { getIdToken, getUserName } = useAuth();

    //スクロール監視用
    const boxRef = useRef(null);
    const [postShowMore, setPostShowMore] = useState(false);

    //投稿内容を取得
    const GetSpamBordData = async (lastKey = null) => {
        
        const token = getIdToken();
        const res = await fetch(AWSApiGatewayInfo.RequestURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                type: "getdata_toukou",
                LastKey: lastKey,
                UserName: UserName
            }),
        });

        //レスポンスデータ取得
        const respons_data = await res.json();

        //レスポンスデータを格納
        setPosts(prev => [...prev, ...respons_data.items]);

        //続きからのデータを格納
        setPostsLastKey(respons_data.lastKey);

        if (respons_data.lastKey === null){
            setLastPost(true);
        }
    }

    //スクロール監視処理
    const postHandleScroll = () => {
        const el = boxRef.current;
        if (!el) return;

        // スクロールが最下部に近いか判定
        const isBottom =
            el.scrollTop + el.clientHeight >= el.scrollHeight;

        setPostShowMore(isBottom);
    };


    return (
        <div>
            <div className="post-list" style={{height: PostListHeight}} ref={boxRef} onScroll={postHandleScroll}>
                {posts?.map((post) => (
                    <div className="post-card" key={post.CreatedAt}>

                        {/* 投稿ヘッダー */}
                        <div className="post-header">
                            <div className="user-icon">{post.UserName?.charAt(0)}</div>
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
                            setPostKey(post.PK);
                        }}>
                            <div className="comment-title">
                                回答 {post.CommentCount}件
                            </div>
                        </div>

                        {/* 回答フォーム呼び出し */}
                        {isAnswerFormOpen && (
                            <AnswerForm
                                isOpen={isAnswerFormOpen}
                                onClose={() => setIsAnswerFormOpen(false)}
                                postKey={postKey}
                                post={selectedPost}
                            />
                        )}

                    </div>
                ))}

            </div>

            {LastPost && (
                <div className="postEndMessage">これ以上の投稿はありません</div>
            )}

            {postShowMore && !LastPost && (
                <div className="btShowMoreArea">
                    <button className="btShowMore" onClick={() => {
                        if (postsLastKey !== null) {
                            GetSpamBordData(postsLastKey)
                        }
                    }}>
                        さらに10件表示
                    </button>
                </div>
            )}

        </div>
    )
}

import React, { useState } from 'react'
import PostListForm from '../components/PostListForm'
import PostForm from '../components/PostForm';
import "./SpamBoard.css"

export default function SpamBoard() {

    //投稿フォーム起動
    const [isPostFormOpen, setIsPostFormOpen] = useState(false);

    return (
        <div className="board-wrapper">
            <div className="board-container">
                <h1 className="board-title">迷惑メール相談所</h1>
                <button className="floating-post-button" onClick={() => setIsPostFormOpen(true)}>投稿</button>
                <PostForm isOpen={isPostFormOpen} onClose={() => setIsPostFormOpen(false)} />
                <PostListForm PostListHeight="calc(100vh - 250px)"/>
            </div>
        </div>
    )
}

import { useState } from 'react'
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
    <header className="header">
        {/* 左側：ロゴ or タイトル */}
        <div className="header-left">
            <h1 className="logo">Spam Checker</h1>
        </div>

        {/* ハンバーガーボタン */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
        </div>

        {/* ナビゲーション */}
        <nav className={`header-right ${menuOpen ? "open" : ""}`}>
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>HOME</Link>
            <Link to="/spamboard" className="nav-link" onClick={() => setMenuOpen(false)}>迷惑メール相談所</Link>
            <Link to="/account" className="nav-link" onClick={() => setMenuOpen(false)}>アカウント</Link>
        </nav>
    </header>
    )
}

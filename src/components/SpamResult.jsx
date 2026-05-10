import React from 'react'
import "./SpamResult.css"


//結果表示のコンポーネント
export default function SpamResult({ isOpen, risk, reason, onClose }) {

    if (!isOpen) return null;

    const getLevelInfo = () => {
        switch (risk) {
            case "high":
                return {
                label: "危険",
                color: "#e74c3c",
                description: "迷惑メールの可能性が高いです"
            };
            case "middle":
                return {
                label: "注意",
                color: "#f39c12",
                description: "少し疑わしい内容です"
            };
            case "low":
                return {
                label: "安全",
                color: "#2ecc71",
                description: "問題の可能性は低いです"
            };
            default:
                return {};
        }
    };

    const info = getLevelInfo();
    

    return (
        <div className="overlay" onClick={onClose}>
            <div className="SpamResultModal" onClick={(e) => e.stopPropagation()} >
            <h2>判定結果</h2>

            <div className="RiskResult" style={{ color: info.color }} >
                {risk}（{info.label}）
            </div>

            <p className="SpamDescription">{info.description}</p>

            <div className="ReasonBox">
                <h3>理由</h3>
                <p>{reason}</p>
            </div>

            <button className='SpamResultClose' onClick={onClose}>閉じる</button>
            </div>
        </div>
    )
}

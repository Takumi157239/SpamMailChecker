import React from 'react'
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import "./MainLayout.css"

export default function MainLayout({ children }) {
  return (
    <div className='main-layout-container'>
      <Header />
      <main className='main-container'><Outlet /></main>
    </div>
  )
}

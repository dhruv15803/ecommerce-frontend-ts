import React, { SetStateAction } from 'react'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router-dom'

type LayoutProps = {
  modal:boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Layout = ({modal,setModal} : LayoutProps) => {
  return (
    <>
    <Navbar modal={modal} setModal={setModal}/>
    <Outlet/>
    </>
  )
}

export default Layout
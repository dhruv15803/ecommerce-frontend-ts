import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <>
    <div className='flex items-center gap-4  m-10'>
         <NavLink end to='.' className={({isActive}) => isActive ? 'text-red-500 underline underline-offset-8 text-2xl font-semibold':"text-red-500 text-2xl font-semibold"}>Products</NavLink>
         <NavLink to='categories' className={({isActive}) => isActive ? 'text-red-500 underline underline-offset-8 text-2xl font-semibold':"text-red-500 text-2xl font-semibold"}>Categories</NavLink>
         <NavLink to='subcategories' className={({isActive}) => isActive ? 'text-red-500 underline underline-offset-8 text-2xl font-semibold':"text-red-500 text-2xl font-semibold"}>SubCategories</NavLink>
    </div>
    <Outlet/>
    </>
  )
}

export default AdminLayout
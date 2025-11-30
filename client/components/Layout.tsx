import { Outlet } from 'react-router'
import Navbar from './Navbar'

export default function Layout() {
  const font = 'Wingdings'
  return (
    <>
      <header className={`flex flex-col items-center font-[${font}]`}>
        <h1>GlIGHFE!</h1>
      </header>
      <main className={`}pb-20 font-[${font}]`}>
        {/* Bottom padding to account for fixed navbar height */}
        <Outlet />
      </main>
      <nav className={`font-[${font}]`}>
        <Navbar />
      </nav>
      {/* <footer></footer> */}
    </>
  )
}

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      navigate('/');
    }
  };

  return (
      <div className="absolute w-full">
        <nav className="border shadow-lg overflow-hidden p-5 bg-white border-stone-200 shadow-stone-950/5 sticky top-0 z-99 w-full">
          <div className="flex items-center">
            <Link to="/" className="font-sans antialiased text-sm text-current ml-2 mr-2 block py-1 font-semibold">Cattle Health</Link>
            <hr className="ml-1 mr-1.5 hidden h-5 w-px border-l border-t-0 border-secondary-dark lg:block" />
            <div className="hidden lg:block">
              <ul className="mt-4 flex flex-col gap-x-3 gap-y-1.5 lg:mt-0 lg:flex-row lg:items-center">
                <li>
                  <Link to="#" className="font-sans antialiased text-sm text-current flex items-center gap-x-2 p-1 hover:text-primary">Detect</Link>
                </li>
                <li>
                  <Link to="#" className="font-sans antialiased text-sm text-current flex items-center gap-x-2 p-1 hover:text-primary">History</Link>
                </li>
              </ul>
            </div>
            
            {/* Authentication section */}
            <div className="hidden lg:ml-auto lg:flex lg:items-center lg:gap-3">
              {loading ? (
                <div className="text-sm">Loading...</div>
              ) : user ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="font-sans antialiased text-sm text-current flex items-center gap-x-2 p-1 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <img 
                    src={user.profileImage} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-stone-200"
                  />
                  <button 
                    onClick={handleLogout}
                    className="items-center justify-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm py-1.5 px-3 shadow-sm hover:shadow bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a 
                  href="http://localhost:8000/auth/google"
                  className="items-center justify-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm py-1.5 px-3 shadow-sm hover:shadow bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased"
                >
                  Login
                </a>
              )}
            </div>

            <div data-dui-toggle="collapse"
              data-dui-target="#sticky-navbar-collapse"
              aria-expanded="false"
              aria-controls="sticky-navbar-collapse"
              className="place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent border-transparent text-stone-800 hover:bg-stone-200/10 hover:border-stone-600/10 shadow-none hover:shadow-none ml-auto grid lg:hidden">
              <svg width="1.5em" height="1.5em" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="h-4 w-4">
                <path d="M3 5H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M3 12H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M3 19H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
          </div>

          <div className="overflow-hidden transition-[max-height] duration-300 ease-in-out max-h-0 lg:hidden" id="sticky-navbar-collapse">
            <ul className="flex flex-col gap-0.5 mt-2">
              <li>
                <Link to="#" className="font-sans antialiased text-sm text-current flex items-center gap-x-2 p-2 hover:text-primary hover:bg-stone-100 rounded-md">Detect</Link>
              </li>
              <li>
                <Link to="#" className="font-sans antialiased text-sm text-current flex items-center gap-x-2 p-2 hover:text-primary hover:bg-stone-100 rounded-md">History</Link>
              </li>
              {user && (
                <li>
                  <Link 
                    to="/dashboard"
                    className="w-full font-sans antialiased text-sm text-current flex items-center gap-x-2 p-2 hover:text-primary hover:bg-stone-100 rounded-md text-left"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              <li className="mt-2">
                {user ? (
                  <div className="flex items-center gap-2 p-2">
                    <img 
                      src={user.profileImage} 
                      alt={user.name}
                      className="w-6 h-6 rounded-full border border-stone-200"
                    />
                    <button 
                      onClick={handleLogout}
                      className="w-full items-center justify-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm py-1.5 px-3 shadow-sm hover:shadow bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </li>
            </ul>
          </div>
        </nav>
      </div>
  )
}

export default Navbar

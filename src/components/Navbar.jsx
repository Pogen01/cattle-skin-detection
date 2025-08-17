import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Get user profile image with fallbacks
  const getUserImage = () => {
    if (!user) return null;
    return user.profileImage
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
      <div className="absolute w-full">
        <nav className="border shadow-lg overflow-visible p-4 md:p-5 bg-white border-stone-200 shadow-stone-950/5 sticky top-0 z-50 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="font-sans antialiased text-sm md:text-base text-current ml-2 mr-2 block py-1 font-semibold">Cattle Health</Link>
              <hr className="ml-1 mr-1.5 hidden h-5 w-px border-l border-t-0 border-secondary-dark lg:block" />
              <div className="hidden lg:block">
                <ul className="mt-4 flex flex-col gap-x-3 gap-y-1.5 lg:mt-0 lg:flex-row lg:items-center">
                  { user?
                  <li>
                    <Link to="#" className="font-sans antialiased text-sm text-current flex items-center gap-x-2 p-1 hover:text-primary">History</Link>
                  </li>
                  : null}
                </ul>
              </div>
            </div>
            
            {/* Authentication section */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
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
                    src={getUserImage()} 
                    alt={user.name || 'User'}
                    className="w-8 h-8 rounded-full border border-stone-200"
                    onError={(e) => {
                      e.target.src =`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0f172a&color=fff`;
                    }}
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

            <button
              onClick={toggleMobileMenu}
              className="place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent border-transparent text-stone-800 hover:bg-stone-200/10 hover:border-stone-600/10 shadow-none hover:shadow-none grid lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="h-4 w-4">
                <path d="M3 5H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M3 12H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M3 19H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`} 
            id="mobile-menu"
          >
            <div className="py-3 border-t border-stone-200 mt-3">
              <ul className="flex flex-col gap-1">
                {user && (
                  <li>
                    <Link 
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-sans antialiased text-sm text-current flex items-center gap-x-2 p-3 hover:text-primary hover:bg-stone-50 rounded-md transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                {user && (
                  <li>
                    <Link 
                      to="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-sans antialiased text-sm text-current flex items-center gap-x-2 p-3 hover:text-primary hover:bg-stone-50 rounded-md transition-colors"
                    >
                      History
                    </Link>
                  </li>
                )}
                
                {/* User profile and auth section */}
                <li className="mt-2 pt-2 border-t border-stone-100">
                  {loading ? (
                    <div className="text-sm p-3">Loading...</div>
                  ) : user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-md">
                        <img 
                          src={getUserImage()} 
                          alt={user.name || 'User'}
                          className="w-8 h-8 rounded-full border border-stone-200"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0f172a&color=fff`;
                          }}
                        />
                        <span className="text-sm font-medium text-stone-700">{user.name || 'User'}</span>
                      </div>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full items-center justify-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm py-2.5 px-3 shadow-sm hover:shadow bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <a 
                      href="http://localhost:8000/auth/google"
                      className="w-full block text-center items-center justify-center border align-middle select-none font-sans font-medium duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm py-2.5 px-3 shadow-sm hover:shadow bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased"
                    >
                      Login with Google
                    </a>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
  )
}

export default Navbar

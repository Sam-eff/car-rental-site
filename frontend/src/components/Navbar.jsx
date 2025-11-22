import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MenuIcon, XIcon, User, Heart, LayoutDashboard, LogOut, Settings, ChevronDown, ShieldCheck } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Cars', path: '/cars' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
]

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [toggleMenu, setToggleMenu] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const { user, logout } = useContext(AuthContext)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setShowUserDropdown(false)
    setToggleMenu(false)
    navigate('/')
  }

  return (
    <div className='p-4 md:p-6 fixed w-full z-50'>
      <div className='max-w-7xl mx-auto bg-black/70 backdrop-blur-xl text-white rounded-2xl border border-gray-800 shadow-2xl'>
        <nav className='flex justify-between items-center px-6 py-4'>
          {/* Logo */}
          <Link to='/' className='flex items-center '>
            <img src="logo.png" alt="Autohire"  className='w-24'/>
          </Link>

          {/* Desktop Navigation */}
          <ul className='hidden md:flex gap-8 items-center'>
            {navLinks.map((link) => (
              <li key={link.title}>
                <Link
                  to={link.path}
                  className={`text-sm font-medium transition-all duration-200 hover:text-blue-400 ${
                    location.pathname === link.path
                      ? 'text-blue-400'
                      : 'text-gray-300'
                  }`}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Section */}
          <div className='hidden md:flex items-center gap-4'>
            {user ? (
              <>
                {/* Wishlist Button */}
                <Link to='/wishlist'>
                  <button className='p-2 hover:bg-gray-800 rounded-lg transition-colors' title='Wishlist'>
                    <Heart size={20} className='text-gray-300 hover:text-red-400 transition-colors' />
                  </button>
                </Link>

                {/* User Dropdown */}
                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className='flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-200 border border-gray-700'
                  >
                    <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                      <User size={16} />
                    </div>
                    <span className='text-sm font-medium max-w-[100px] truncate'>{user.username}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className='absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-slideDown'>
                      {/* User Info */}
                      <div className='px-4 py-3 bg-gray-800/50 border-b border-gray-700'>
                        <p className='text-sm font-medium truncate'>{user.username}</p>
                        <p className='text-xs text-gray-400 truncate'>{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className='py-2'>
                        {user.is_staff && (
                          <Link
                            to='/admin'
                            onClick={() => setShowUserDropdown(false)}
                            className='flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors'
                          >
                            <ShieldCheck size={18} className='text-purple-400' />
                            <span className='text-sm'>Admin Dashboard</span>
                          </Link>
                        )}

                        <Link
                          to='/dashboard'
                          onClick={() => setShowUserDropdown(false)}
                          className='flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors'
                        >
                          <LayoutDashboard size={18} className='text-blue-400' />
                          <span className='text-sm'>My Dashboard</span>
                        </Link>

                        <Link
                          to='/wishlist'
                          onClick={() => setShowUserDropdown(false)}
                          className='flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors'
                        >
                          <Heart size={18} className='text-red-400' />
                          <span className='text-sm'>Wishlist</span>
                        </Link>

                        <Link
                          to='/profile'
                          onClick={() => setShowUserDropdown(false)}
                          className='flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors'
                        >
                          <Settings size={18} className='text-gray-400' />
                          <span className='text-sm'>Settings</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className='border-t border-gray-800 py-2'>
                        <button
                          onClick={handleLogout}
                          className='flex items-center gap-3 px-4 py-2 w-full hover:bg-red-500/10 transition-colors text-red-400'
                        >
                          <LogOut size={18} />
                          <span className='text-sm'>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to='/login'>
                  <button className='px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors'>
                    Login
                  </button>
                </Link>
                <Link to='/register'>
                  <button className='px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-500/20'>
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className='md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors'
            onClick={() => setToggleMenu(!toggleMenu)}
          >
            {toggleMenu ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            toggleMenu ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='px-6 pb-6 pt-2 border-t border-gray-800'>
            {/* Navigation Links */}
            <ul className='space-y-2 mb-4'>
              {navLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.path}
                    onClick={() => setToggleMenu(false)}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === link.path
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Auth Section */}
            {user ? (
              <div className='space-y-2 pt-4 border-t border-gray-800'>
                {/* User Info */}
                <div className='px-4 py-3 bg-gray-800/50 rounded-lg mb-3'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                      <User size={18} />
                    </div>
                    <div>
                      <p className='text-sm font-medium'>{user.username}</p>
                      <p className='text-xs text-gray-400'>{user.email}</p>
                    </div>
                  </div>
                </div>

                {user.is_staff && (
                  <Link
                    to='/admin'
                    onClick={() => setToggleMenu(false)}
                    className='flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'
                  >
                    <ShieldCheck size={18} className='text-purple-400' />
                    <span className='text-sm'>Admin Dashboard</span>
                  </Link>
                )}

                <Link
                  to='/dashboard'
                  onClick={() => setToggleMenu(false)}
                  className='flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'
                >
                  <LayoutDashboard size={18} className='text-blue-400' />
                  <span className='text-sm'>My Dashboard</span>
                </Link>

                <Link
                  to='/wishlist'
                  onClick={() => setToggleMenu(false)}
                  className='flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'
                >
                  <Heart size={18} className='text-red-400' />
                  <span className='text-sm'>Wishlist</span>
                </Link>

                <Link
                  to='/profile'
                  onClick={() => setToggleMenu(false)}
                  className='flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'
                >
                  <Settings size={18} className='text-gray-400' />
                  <span className='text-sm'>Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className='flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-red-500/10 transition-colors text-red-400 mt-2'
                >
                  <LogOut size={18} />
                  <span className='text-sm'>Logout</span>
                </button>
              </div>
            ) : (
              <div className='space-y-2 pt-4 border-t border-gray-800'>
                <Link to='/login' onClick={() => setToggleMenu(false)}>
                  <button className='w-full px-4 py-3 border border-gray-700 hover:bg-gray-800 rounded-lg transition-colors text-left'>
                    Login
                  </button>
                </Link>
                <Link to='/register' onClick={() => setToggleMenu(false)}>
                  <button className='w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-colors font-semibold'>
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
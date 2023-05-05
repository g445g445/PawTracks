import './Navbar.css';
import React, { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';

function Navbar(props) {
    const navRef = useRef();
    const [open, setOpen] = useState(false);

    let activeStyle = {
        textDecoration: "none",
        fontWeight: "900",
    }; 

    function showNavbar() {
        navRef.current.classList.toggle('responsiveNav');
    }

    return (
        <>
            <div className='navbar'>
                    <Link to="/" className='logoWrapper'><img src='/pawTracksCircleLogo512.png' className='imgLogo'></img><span className='textLogo'> Paw Tracks</span></Link>
                <nav ref={navRef} className='mobileNavBar'>

                    <div className='mainWrapper' id="mainWrap">
                    <NavLink to="/" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'><p className='linkText'>Home</p></NavLink>
                    <NavLink to="/pets" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'><p className='linkText'>Pets</p></NavLink>
                    <NavLink to="/clips" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'><p className='linkText'>Clips</p></NavLink>
                    <NavLink to="/tricks" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'><p className='linkText'>Tricks</p></NavLink>
                    </div>
                    
                    <div className='profileWrapper'>
                    <NavLink to="/profile" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem' onClick={() => setOpen(!open)}><p className='linkText'><AiOutlineUser id="userImg"/> Hello, {props.firstName}</p></NavLink>
                    <button className='signOut' onClick={props.signOut}> Sign Out</button>
                    </div>

                    <button className='mobileNavItem mobileClose' onClick={showNavbar}><FaTimes /></button>
                    
                </nav>
                <button className='mobileNavItem' onClick={showNavbar}><FaBars /></button>
                </div>
        </>
    )
}

export default Navbar

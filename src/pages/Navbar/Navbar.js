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
                    <NavLink to="/" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'><a className='linkText'>Home</a></NavLink>
                    <NavLink to="/pets" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'><a className='linkText'>Pets</a></NavLink>
                    <NavLink to="/clips" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'><a className='linkText'>Clips</a></NavLink>
                    <NavLink to="/tricks" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'><a className='linkText'>Tricks</a></NavLink>
                    </div>
                    
                    <div className='profileWrapper'>
                    <NavLink to="/profile" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem' onClick={() => setOpen(!open)}><a className='linkText'><AiOutlineUser id="userImg"/> Hello, {props.firstName}</a></NavLink>
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

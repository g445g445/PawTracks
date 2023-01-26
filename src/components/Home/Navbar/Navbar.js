import './Navbar.css';
import React, { useRef, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
    const navRef = useRef();

    function showNavbar() {
        navRef.current.classList.toggle('responsive_nav');
    }

    return (
        <>
            <header>
                <h1><img src='/pawTracksLogo512.png' id='header-logo'></img><h1 id='pawTracksLogo'>Paw Tracks</h1></h1>
                <nav ref={navRef}>
                    <a href="/#">Home</a>
                    <a href="/#">Pets</a>
                    <a href="/#">Clips</a>
                    <a href="/#">Tricks</a>
                    <button className='nav-btn nav-close-btn' onClick={showNavbar}>
                        <FaTimes />
                    </button>
                </nav>
                <button className='nav-btn' onClick={showNavbar}>
                    <FaBars />
                </button>
            </header>
        </>
    )
}

export default Navbar
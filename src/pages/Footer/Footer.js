import React, { useRef, useState } from 'react';
import './Footer.css'

import { Link, NavLink } from 'react-router-dom';
import { AiOutlineGithub } from 'react-icons/ai';

function Footer() {
    const footRef = useRef();

    let activeStyle = {
        textDecoration: "none",
        fontWeight: "900",
    };

    return (
        <>
            <div className='footer'>
                <Link to="/" className='logoWrapper'><img src='/pawTracksCircleLogo512.png' className='imgLogo'></img><span className='textLogo'> Paw Tracks</span></Link>
                <a href="https://github.com/benhmcd/PawTracks" target="_blank" className='githubLink' ><span> <AiOutlineGithub/> Github Repository </span></a>
                <nav ref={footRef} className='mobileNavBar'>
                    <NavLink to="/" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'>Home</NavLink>
                    <NavLink to="/pets" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'>Pets</NavLink>
                    <NavLink to="/clips" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'>Clips</NavLink>
                    <NavLink to="/tricks" style={({ isActive }) => isActive ? activeStyle : undefined } className='navItem'>Tricks</NavLink>
                </nav>
            </div>
        </>
    )
}

export default Footer
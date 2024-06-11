import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (

    <div className='footer'>
        <Link>How it works</Link>
        <Link>Dishes</Link>
        <Link>Subscriptions</Link>
        <Link>Create account</Link>
        <Link>X</Link>
        <Link>Facebook</Link>
        <Link>Instagram</Link>    

    </div>
  )
}

export default Footer
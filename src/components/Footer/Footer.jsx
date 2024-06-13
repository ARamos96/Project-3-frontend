import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (

    <div className='footer'>
        <Link to="/howitworks">How it works</Link>
        <Link to="/recipes">Dishes</Link>
        <Link to="/mealplan">Meal Plans</Link>
        <Link>X</Link>
        <Link>Facebook</Link>
        <Link>Instagram</Link>    

    </div>
  )
}

export default Footer
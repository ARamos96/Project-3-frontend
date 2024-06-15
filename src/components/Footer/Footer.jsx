import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import "primeicons/primeicons.css"

function Footer() {
  return (

    <div className='footer'>
        <Link to="/howitworks">How it works</Link>
        <Link to="/recipes">Dishes</Link>
        <Link to="/mealplan">Meal Plans</Link>
        <Link><span className='pi pi-twitter'/></Link>
        <Link><span className='pi pi-facebook'/></Link>
        <Link><span className="pi pi-instagram"/></Link> 
    </div>
  )
}

export default Footer
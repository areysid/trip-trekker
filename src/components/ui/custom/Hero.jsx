import React from 'react'
import { Button } from '../button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
      <h1
        className='font-extrabold text-[39px] text-center mt-16'
      >
        <span className='text-[#f56551]'>Discover your next adventure with AI:</span><br>
        </br>Personalized itineraries at your fingertips!</h1>
      <p className='text-l text-gray-500 items-center'>
        Your personal travel planner and trip curator, creating custom itineraries tailored
        to your interest and budget.
      </p>

      <Link to={'/create-trip'}>
        <Button>Get Started, It's Free</Button>
      </Link>

      <img 
        src="/homepage.png"
        alt="Travel Adventure"
        className="rounded-lg shadow-lg w-full max-w-5xl mb-10"
      />

    </div>
  )
}

export default Hero
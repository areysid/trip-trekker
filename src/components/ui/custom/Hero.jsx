import React from 'react'
import { Button } from '../button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen text-white px-6"
      style={{
        backgroundImage: "url('/pic1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Add top padding equal to header height */}
      <div className="backdrop-brightness-50 w-full flex flex-col items-center text-center px-4 py-24 rounded-lg">
        <h1 className="font-extrabold text-[39px] mb-4">
          <span className="text-[#f56551]">Discover your next adventure with AI:</span><br />
          Personalized itineraries at your fingertips!
        </h1>
        <p className="text-lg text-gray-100 max-w-2xl mb-6">
          Your personal travel planner and trip curator, creating custom itineraries tailored
          to your interest and budget.
        </p>
        <Link to={'/create-trip'}>
          <Button>Get Started, It's Free</Button>
        </Link>
      </div>
    </div>
  )
}

export default Hero
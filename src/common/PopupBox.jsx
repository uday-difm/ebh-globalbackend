import React from 'react';
import Link from 'next/link'; // Changed from react-router-dom

const PopupBox = ({message, onClose}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50 backdrop-filter backdrop-blur-sm text-black">
      <div className="bg-white p-8 rounded-md shadow-md">
        <p className="text-lg text-pretty" dangerouslySetInnerHTML={{__html : message}}></p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-dark-sky rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Close</button>
        <Link href={'/login'}> {/* Changed to Next.js Link with href */}
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-light-green text-dark-green rounded-md hover:bg-dark-green hover:text-white focus:outline-none focus:bg-blue-600">Login</button>
        </Link>
      </div>
    </div>
  )
}

export default PopupBox;
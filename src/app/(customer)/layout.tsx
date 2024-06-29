import React from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <main>
      <nav className='h-12 bg-gray-300'>

      </nav>
      {children}
    </main>
  )
}

export default layout
import React from 'react';
import './Layout.css';

function Layout({children}) {
  return (
      <div className='chat'>
          {children}
    </div>
  )
}

export default Layout
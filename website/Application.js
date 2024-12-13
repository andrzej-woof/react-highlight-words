import React from 'react'
import HighlighterExample from '../src/Highlighter.example'

export default function Application () {
  return (
    <div>
      <div className='headerRow'>
        <img
          className='logo'
          width='482'
          height='278'
          src='https://cloud.githubusercontent.com/assets/29597/11903349/6da3d9c0-a56d-11e5-806d-1c7b96289523.png'
        />
      </div>
      <div className='body'>
        <div className='card'>
          <HighlighterExample />
        </div>
      </div>
      <div className='footer'>
        react-highlight-words is available under the MIT license.
      </div>
    </div>
  )
}

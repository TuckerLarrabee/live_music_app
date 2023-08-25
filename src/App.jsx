import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NowPlaying from './components/NowPlaying'
import './App.css'
import PageContent from './components/PageContent'

function App() {
  return (
    <>
      <NowPlaying></NowPlaying>
      <PageContent></PageContent>
    </>
  )
}

export default App

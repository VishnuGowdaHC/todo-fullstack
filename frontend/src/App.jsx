import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Task from './components/Task'

function App() {
 

  return (
    <>
    <div className='min-w-[500px] h-auto flex items-center justify-center gap-2 mt-[200px]'>
      <Task />
    </div>
      
    </>
  )
}

export default App

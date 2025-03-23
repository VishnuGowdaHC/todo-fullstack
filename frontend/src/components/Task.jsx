import React, {useState,useEffect} from "react";
import axios from "axios";

function Task() {
  const [input, setInput] = useState("")
  const [tasks, setTasks] = useState([])

  const getData = async () => {
      const res = await axios.get("http://localhost:3000/")
      setTasks(res.data)
      
  }


  const sendData = async () => {
    if (!input.trim()) return
    try {
      const res = await axios.post("http://localhost:3000/", {
        task: input 
      })
      setInput("")
      getData()      
    } catch (error) {
      console.error("trying to send the data to db "+error)
    }
  }

  const toggleTask = async (id, isComplete) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, iscomplete: isComplete ? 1 : 0} : task)
      );

      await axios.put("http://localhost:3000/", {
        id,
        isComplete: isComplete ? 1 : 0 
      })
      
      getData()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    try {    
      getData()
    } catch (error) {
      console.error("trying to fetch data from getData() "+error)
    }
  },[])

  

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitted", input) 
    sendData()
    getData()
  }

  return (
    <div className="flex flex-col h-screen items-center">
      <div className="w-auto h-fit rounded-[5px] flex flex-row items-center justify-center gap-2 z-10">
          <input className="bg-[#C5C6C7] text-[#2F2F2F] rounded-md px-3 py-1 drop-shadow-md " 
          type="text" 
          placeholder="Add a task ....."
          value={input}
          onChange={(e) => setInput(e.target.value)} />
          <button onClick={handleSubmit} className="bg-[#2F2F2F] text-[#E5E4E2] font-[600] mx-1 px-3 py-1 rounded-md drop-shadow-lg ">ADD</button>
      </div>

      <div className="m-4 overflow-y-auto flex-grow mt-5 ">
        <div>
          {tasks.map((data)=>(
            <li key={data.id} className="bg-[#2F2F2F] pl-4 py-2 m-2  rounded-md list-none drop-shadow-lg overflow-auto text-[#E5E4E2] font-semibold text-center flex items-center justify-between">
              <input className="left-0 mr-4 scale-150" type="checkbox"
              checked={data.iscomplete === 1} 
              onChange={()=> {toggleTask(data.id, !data.iscomplete)}}
              />
              
              <span className="mr-3 flex-1 text-left">{data.title}</span>
              <button className="bg-[#525151] p-2 m-1 rounded-md">Edit</button>
              <button className="bg-[#de4b26] text-[#f5d0c6] p-2 m-1 rounded-md mr-3">Delete</button>
            </li>
          ))}
        </div>
      </div>
    </div>
      
  )
}

export default Task
import React, {useState,useEffect} from "react";
import axios from "axios";

function Task() {
  const [input, setInput] = useState("")
  const [tasks, setTasks] = useState([])
  const [todoId, seTodoId] = useState(null)
  const [todoMsg, setTodoMsg] = useState("")

  const getData = async () => {
      const res = await axios.get("http://localhost:3000/")
      setTasks(res.data)
      
  }

  useEffect(()=>{
    try {    
      getData()
    } catch (error) {
      console.error("trying to fetch data from getData() "+error)
    }
  },[])


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

 
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitted", input) 
    sendData()
    getData()
  }

  const handleDelete = async (id) => {
    try {
      setTasks(tasks.filter(task => task.id !== id));
      await axios.delete(`http://localhost:3000/tasks/${id}`)
      getData()
      
      
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
    
  }

  const handleEdit = (id, task) => {
    seTodoId(id)
    setTodoMsg(task)
  }

  const handleSave = async (id) => {
    console.log(id)
    setTasks(prev => prev.map((task) => task.id === id ? {...task, title: todoMsg} : task.title))
    try {
      await axios.put("http://localhost:3000/edit/", {
        id,
        title: todoMsg
      })
    } catch (error) {
      console.log("Save error" + error)
    }

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
          {tasks.map((data, index)=>(
            <li key={data.id || index} className="bg-[#2F2F2F] pl-4 py-2 m-2  rounded-md list-none drop-shadow-lg overflow-auto text-[#E5E4E2] font-semibold text-center flex items-center justify-between">
              <input className="left-0 mr-4 scale-150" type="checkbox"
              checked={data.iscomplete === 1} 
              onChange={()=> {toggleTask(data.id, !data.iscomplete)}}
              />

              {todoId === data.id ? 
              <input type="text"
              className={"border outline-none w-full bg-transparent rounded-lg border-transparent"} 
              value={todoMsg}
              // placeholder={`${data.title}`}
              onChange={(e) => {setTodoMsg(e.target.value)}}
              />
              : <span className="mr-3 flex-1 text-left">{data.title}</span>
              }
              
              {todoId === data.id ? 
              <button className="bg-[#525151] p-2 m-1 rounded-md" 
              onClick={() => {handleSave(data.id)}}>Save</button> 
              : <button className="bg-[#525151] p-2 m-1 rounded-md"
               onClick={() => {handleEdit(data.id, data.title)}}>Edit</button>}
              
              <button className="bg-[#de4b26] text-[#f5d0c6] p-2 m-1 rounded-md mr-3" 
              onClick={() => {
                if (confirm("Are you sure you want to delete this task?"))
                  {
                    handleDelete(data.id);        
                  }
                }
              }
              >Delete</button>
            </li>
          ))}
        </div>
      </div>
    </div>
      
  )
}

export default Task

"use client"
import { Icon } from '@iconify/react';
import axios from "axios"
import { useState } from 'react';
import { useQuery } from "react-query"

import DeleteWindow from "./DeleteWindow"


const getSession = async () => {
  const response = await axios.get("/api/getSession")
  return response.data
}

type RemoveAction = {
  email: string
  id: string
  actionAt: "comment" | "post"
  postId?: string
}


export default function RemoveAction( { email, actionAt, id , postId}: RemoveAction) {

  const { data, error, isLoading } = useQuery({
    queryFn: getSession,
    queryKey: ["session"],
  })

  const [showDelete, setShowDelete] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false)

  if (error){
    console.error(error)
    return <></>
  }
  if (isLoading){
    return <></>
  }

  const handelClick = () => {
    console.log("test")
    setShowDelete(true)
    console.log(showDelete)
  }

  console.log(showDelete)

  return (
    <div 
      style={{alignSelf: "center"}}
    >
      { email === data.email 
        &&
        <div 
          className="actions-remove"
          onClick={handelClick}
        >
          <Icon 
            icon="uil:trash-alt" 
            className="icon" 
          />
          <p>Delete</p>
        </div>
        //setShowDelete((prev: boolean)=>!prev)
        // <div 
        //   className="actions-reply"
        //   onClick={()=>{setShowReply((prev: boolean)=>!prev)}}
        // >
        //   <Icon 
        //     icon="fa6-solid:reply" 
        //     className="icon" 
        //   />
        //   <p>Reply</p>
        // </div>
      }
      {showDelete && 
        <DeleteWindow setIsDisabled={setIsDisabled} setShowDelete={setShowDelete} actionAt={actionAt} id={id} postId={postId}/>
      }
    </div>
  )
}

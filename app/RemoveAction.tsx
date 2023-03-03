
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

  const [showDelete, setShowDelete] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  if (error){
    console.error(error)
    return <></>
  }
  if (isLoading){
    return <></>
  }

  return (
    <div 
      style={{alignSelf: "center"}}
    >
      { email === data.email 
        &&
        <div 
          className="actions-remove"
          onClick={()=>{setShowDelete((prev: boolean)=>!prev)}}
        >
          <Icon 
            icon="uil:trash-alt" 
            className="icon" 
          />
          <p>Delete</p>
        </div>
      }
      {showDelete && 
        <>Bla Blaaa Blaa ...</>
        // <DeleteWindow setIsDisabled={setIsDisabled} setShowDelete={setShowDelete} actionAt={actionAt} id={id} postId={postId}/>
      }
    </div>
  )
}

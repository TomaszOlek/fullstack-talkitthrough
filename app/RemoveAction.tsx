
"use client"
import { Icon } from '@iconify/react';
import axios from "axios"
import { useState } from 'react';
import { useQuery } from "react-query"

import DeleteWindow from "./DeleteWindow"

type RemoveAction = {
  email: string
  id: string
  actionAt: "comment" | "post"
  postId?: string
  userSection: {
    user?: {
      email: string;
      image: string;
      name: string;
    };
  };
}

export default function RemoveAction( { email, actionAt, id , postId, userSection}: RemoveAction) {
  const [showDelete, setShowDelete] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <div 
      style={{alignSelf: "center"}}
    >
      { email === userSection.user?.email 
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
        <DeleteWindow setIsDisabled={setIsDisabled} setShowDelete={setShowDelete} actionAt={actionAt} id={id} postId={postId}/>
      }
    </div>
  )
}

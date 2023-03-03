"use client"
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from "react-query"
import toast from "react-hot-toast"
import axios, { AxiosError } from "axios"
import { useQuery } from "react-query"
import { useState, useEffect } from 'react';


type Reputation ={
  type: string
  reputatuonId: string //id of the post of comment
}

const getReputatuon = async (reputatuonId: string, type: string) => {
  const response = await axios.get(`/api/reputation/${type}|${reputatuonId}`)
  return response.data
}

export default function Reputation({type, reputatuonId}: Reputation) {
  const queryClient = useQueryClient()
  const [reaction, setReaction] = useState("")
  const [reputation, setReputation] = useState(0)

  const { mutate } = useMutation(
    async ({ voteType }: { voteType: string }) =>
      await axios.post("/api/reputation/setReputation", {
        data: {
          entityType: type,
          entityId: reputatuonId,
          voteType: voteType,
        },
      }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
        }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries([`Rep${reputatuonId}`])
      },
    }
  );

  const { data, error, isLoading } = useQuery({
    queryFn: () => getReputatuon(reputatuonId, type),
    queryKey: [`Rep${reputatuonId}`],
  })

  if (error){
    console.error(error)
  }

  useEffect(() => {
    if (data) {
      setReaction(data.reaction)
      setReputation(data.totalRep)
    }
  }, [data])

  const handelReputation = (voteType: string) => {
    mutate({ voteType });

    if (
      (voteType === "plus" && reaction === "plus") ||
      (voteType === "minus" && reaction === "minus")
    ) {
      setReaction("");
      setReputation((prev) => prev + (voteType === "plus" ? -1 : 1));
    } else if (
      (voteType === "plus" && reaction === "minus") ||
      (voteType === "minus" && reaction === "plus")
    ) {
      setReaction(voteType);
      setReputation((prev) => prev + (voteType === "plus" ? 2 : -2));
    } else {
      setReaction(voteType);
      setReputation((prev) => prev + (voteType === "plus" ? 1 : -1));
    }
  }

  return(
    <div className="reputation">
      <Icon 
        icon="ic:round-plus" 
        className={`reputation-plus ${reaction === "plus" && "reputation-icon-plus"}`}  
        onClick={() => handelReputation("plus")}
      />
      <p>{reputation}</p>
      <Icon 
        icon="ic:round-minus" 
        className={`reputation-minus ${reaction === "minus" && "reputation-icon-minus"}`} 
        onClick={() => handelReputation("minus")}
      />
    </div>
  )
}

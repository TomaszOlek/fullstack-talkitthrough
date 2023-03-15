"use client"
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from "react-query"
import toast from "react-hot-toast"
import axios, { AxiosError } from "axios"
import { useQuery } from "react-query"
import { useState, useEffect } from 'react';


type Reputation ={
  type: "comment" | "post"
  reputatuonId: string
  reactions: {
    id: string
    type: string
    user: {
      name: string
      image: string
      email: string
    }
  }[]
  userSection: {
    user?: {
      email: string;
      image: string;
      name: string;
    };
  };
}

const getReputatuon = async (type: string, reputatuonId: string) => {
  const response = await axios.get(`/api/v1/reputation/${reputatuonId}?type=${type}`)
  return response.data
}

export default function Reputation({type, reputatuonId, reactions, userSection}: Reputation) {
  const queryClient = useQueryClient()
  const [userReaction, setUserReaction] = useState<string | undefined>("");
  const [reputation, setReputation] = useState(0)

  const { mutate } = useMutation(
    async ({ voteType }: { voteType: string }) =>
      await axios.post("/api/v1/reputation", {
        data: {
          entityType: type,
          entityId: reputatuonId,
          voteType: voteType,
        },
      }),
    {
      onError: (error) => {
        console.error(error)
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries([`Rep${reputatuonId}`])
      },
    }
  );

  const { data, error, isLoading } = useQuery({
    queryFn: () => getReputatuon(type, reputatuonId),
    queryKey: [`Rep${reputatuonId}`],
  })
  if (error){
    console.error(error)
  }

  useEffect(() => {
    if (data) {
      setUserReaction(data.userReaction)
      setReputation(data.totalRep)
    }else{
      if (reactions.length > 0 && userSection.user?.email !== undefined) {
        setUserReaction(
          reactions.find((post) => post.user?.email === userSection.user?.email)?.type
        );
      }
      setReputation(reactions.length);
    }
  }, [data])

  const handelReputation = (voteType: string) => {
    mutate({ voteType });

    if (
      (voteType === "plus" && userReaction === "plus") ||
      (voteType === "minus" && userReaction === "minus")
    ) {
      setUserReaction("");
      setReputation((prev) => prev + (voteType === "plus" ? -1 : 1));
    } else if (
      (voteType === "plus" && userReaction === "minus") ||
      (voteType === "minus" && userReaction === "plus")
    ) {
      setUserReaction(voteType);
      setReputation((prev) => prev + (voteType === "plus" ? 2 : -2));
    } else {
      setUserReaction(voteType);
      setReputation((prev) => prev + (voteType === "plus" ? 1 : -1));
    }
  }

  return(
    <div className="reputation">
      <Icon 
        icon="ic:round-plus" 
        className={`reputation-plus ${userReaction === "plus" && "reputation-icon-plus"}`}  
        onClick={() => handelReputation("plus")}
      />
      <p>{reputation}</p>
      <Icon 
        icon="ic:round-minus" 
        className={`reputation-minus ${userReaction === "minus" && "reputation-icon-minus"}`} 
        onClick={() => handelReputation("minus")}
      />
    </div>
  )
}

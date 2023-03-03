import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../prisma/client"

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"


type ReputationEl = {
  id: string
  type: string
  userId: string
  postId?: string
  commentId?: string
  user: {
    id: string
    name: string,
    email: string,
    emailVerified?: boolean,
    image: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions)

    if (!req.query.getReputation) {
      return res.status(400).json({ error: "Invalid request" })
    }


    //Get Reputation
    try {
      const getReputation = req.query.getReputation
      let type, id
      
      if (Array.isArray(getReputation)) {
        [type, id] = getReputation[0].split("|")
      } else {
        [type, id] = getReputation.split("|")
      }
      const reputation = await prisma.reaction.findMany({
        where: {
          [type === 'post' ? 'postId' : 'commentId']:  id,
        },
        include: {
          user: true,
        },
      })

      let reaction = null

      if (session?.user){
        for (var i = reputation.length - 1; i > -1; i--) {
          if (reputation[i].user.email === session.user.email) {
            reaction = reputation[i].type
          }
        }
      }
      
      let totalRep = 0
      reputation.forEach((element: ReputationEl)=>{
        if(element.type === "plus"){
          totalRep++
        }else{
          totalRep--
        }
      })

      const respones = {
        totalRep,
        reaction: reaction,
      }

      return res.status(200).json(respones)
    } catch (err) {
      res.status(403).json({ err: "Error has occured while getting a post" })
    }
  }
}

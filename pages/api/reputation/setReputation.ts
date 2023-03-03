import prisma from "../../../prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: "Please signin to create a post." })
  }

  //Get User
  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user?.email },
  })

  const { entityType, entityId, voteType } = req.body.data;

  const existingVote = await prisma.reaction.findFirst({
    where: {
      [entityType === 'post' ? 'postId' : 'commentId'] :  entityId,
      userId: prismaUser.id,
    },
  });

  try {
    if (existingVote) {
      if (existingVote.type === voteType) {
        const result = await prisma.reaction.delete({
          where: { id: existingVote.id },
        });
        res.status(200).json(result)
      } else {
        const result = await prisma.reaction.update({
          where: { id: existingVote.id },
          data: { type:voteType },
        });
        res.status(200).json(result)
      }
    } else {
      const result = await prisma.reaction.create({
        data: { 
          type: voteType,
          userId: prismaUser.id,
          [entityType === 'post' ? 'postId' : 'commentId'] :  entityId,
        },
      });
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(403).json({ err: "Error has occured while making a comment." })
  }
}
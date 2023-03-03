import prisma from "../../../prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: "Please signin to post a comment." })
    }

    const { comment, postId } = req.body.data

    //Get User
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (!comment.length) {
      return res
      .status(403)
      .json({ message: "Please enter some text." })
    }
    if (comment.length > 300) {
      return res
      .status(403)
      .json({ message: "Please write something before we can post it." })
    }

    try {
      const result = await prisma.comment.create({
        data: {
          title: comment,
          userId: prismaUser.id,
          postId,
        },
      })
      res.status(200).json(result)
    } catch (err) {
      res.status(403).json({ err: "Error has occured while making a comment." })
    }
  }
}

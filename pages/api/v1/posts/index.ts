import prisma from "../../../../prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if(req.method === "GET"){                               //||---GET---||  
    try {
      const posts = await prisma.post.findMany({
        include: {
          user: true,
          comments: {
            include: {
              reactions: true,
              user: true,
            }
          },
          reactions: {
            include: {
              user: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      return res.status(200).json(posts)
    } catch (err) {
      res.status(403).json({ err: "Error has occured while getting a post" })
    }

  }else if(req.method === "DELETE"){                     //||---DELETE---||
    if (!session) {
      return res.status(401).json({ message: "Please signin to create a post." })
    }

    const id = req.body

    try {
      const result = await prisma.post.delete({
        where: {
          id: id,
        },
      })

      res.status(200).json(result)
    } catch (err) {
      res.status(403).json({ err: "Error has occured while deleting a post" })
    }

  }else if (req.method === "POST") {                      //||---POST---||
    if (!session) {
      return res
        .status(401)
        .json({ message: "Please signin to create a post." })
    }

    const title: string = req.body.title

    //Get User
    const prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email },
    })

    //Check title
    if (title.length > 300) {
      return res.status(403).json({ message: "Please write a shorter post" })
    }
    if (!title.length) {
      return res.status(403)
        .json({ message: "Please write something before we can post it." })
    }

    //Create Post
    try {
      const result = await prisma.post.create({
        data: {
          title,
          userId: prismaUser.id,
        },
      })
      res.status(200).json(result)
    } catch (err) {
      res.status(403).json({ err: "Error has occured while making a post" })
    }

  }else {
    res.status(400)
  }
}

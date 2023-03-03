import prisma from "../../../prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const postId = req.query.getComments as string;
      const comments = await prisma.comment.findMany({
        where: {
          postId: postId,
        },
        include: {
          user: true,
        },
      });
      return res.status(200).json(comments);
    } catch (err) {
      res.status(403).json({ err: `Error has occurred while retrieving comments: ${err}` })
    }
  }
}
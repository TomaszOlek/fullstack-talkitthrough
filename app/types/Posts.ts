export type PostsType = {
  id: string;
  title: string;
  createdAt?: string;
  comments?: {
    createdAt?: string;
    id: string;
    postId: string;
    title: string;
    userId: string;
    user: {
        email: string;
        id: string;
        image: string;
        name: string;
    };
    reactions: {
      id: string;
      type: string;
      user: {
        name: string;
        image: string;
        email: string;
      };
    }[];
  }[];
  user: {
    name: string;
    image: string;
    email: string;
  };
  reactions: {
    id: string;
    type: string;
    user: {
      name: string;
      image: string;
      email: string;
    };
  }[];
}

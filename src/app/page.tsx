"use client"
import type { NextPage } from "next";
import React from 'react'
import { useQuery, QueryClientProvider, QueryClient } from "react-query";
import axios from "axios";
import SignatureCanvas from "./components/SignatureCanvas";

interface Post {
  id: number;
  title: string;
  author: string;
  description: string;
}

const getPosts = async () => {
  const { data } = await axios.get<Post[]>("http://localhost:3001/posts");
  return data;
};

const queryClient = new QueryClient();

const Home: NextPage = () => {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[], Error>("posts", getPosts);

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        posts?.map((post) => (
          <div key={post.id}>
            <div>id: {post.id}</div>
            <div>제목: {post.title}</div>
            <div>작성자: {post.author}</div>
            <div>내용: {post.description.slice(0, 100)}...</div>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
};

export default App;

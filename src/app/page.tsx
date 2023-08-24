"use client"
import type { NextPage } from "next";
import React from 'react'
import { useQuery, QueryClientProvider, QueryClient } from "react-query";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  author: string;
  description: string;
}

interface PostDB{
  name: string;
  username: string;
  email: string;
  age: number;
  password: string;
  gender: string;
}

const getPosts = async () => {
  const { data } = await axios.get<Post[]>("http://localhost:3002/posts");
  return data;
};

const getPostsDB = async () => {
  const { data } = await axios.get<PostDB[]>("/user");
  console.log(data)
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

  const {
    data: userData, // 수정된 부분
    isLoading: isLoadingDB,
    isError: isErrorDB,
    error: errorDB,
  } = useQuery<PostDB[], Error>("user", getPostsDB); // 수정된 부분

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
      {isLoadingDB ? (
        <div>Loading user data...</div>
      ) : (
        userData && (
          <div>
            사용자 정보:
            <div>이름: {userData[0].name}</div>
            <div>사용자명: {userData[0].username}</div>
            <div>이메일: {userData[0].email}</div>
            <div>나이: {userData[0].age}</div>
            <div>성별: {userData[0].gender}</div>
          </div>
        )
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

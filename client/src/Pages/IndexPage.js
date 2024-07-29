import { useEffect, useState } from 'react';
import Post from '../components/Post';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(function () {
    fetch('https://blog-application-api-eight.vercel.app/posts').then((res) =>
      res.json().then((data) => {
        setPosts(data);
      })
    );
  }, []);

  return (
    <>
      {(posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)) || (
        <p style={{ fontSize: '2rem', textAlign: 'center', marginTop: '5rem' }}>
          No Posts Available, Start Writing ✍
        </p>
      )}
    </>
  );
}

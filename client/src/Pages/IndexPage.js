import { useEffect, useState } from 'react';
import Post from '../components/Post';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

useEffect(() => {
  async function fetchPosts() {
    try {
      const res = await fetch('https://blog-application-api-eight.vercel.app/posts');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  }

  fetchPosts();
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

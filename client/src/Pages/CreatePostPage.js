import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Editor from '../components/Editor';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(e) {
    e.preventDefault();
    if (!title || !summary || !content || !files) return;

    try {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('file', files[0]);

      const res = await fetch('https://blog-application-api-eight.vercel.app/create-post', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (res.ok) setRedirect(true);
    } catch (err) {
      console.error('Error creating post :(');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        required
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <Editor content={content} setContent={setContent} theme={'snow'} />
      <button style={{ marginTop: '5px' }}>Create Post</button>
    </form>
  );
}

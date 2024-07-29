import { useEffect, useState } from 'react';
import Editor from '../components/Editor';
import { Navigate, useParams } from 'react-router-dom';

export default function EditPost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    async function getPostData() {
      try {
        const res = await fetch(`http://localhost:4000/posts/${id}`);
        const data = await res.json();
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
      } catch (err) {
        console.error(err.message);
      }
    }
    getPostData();
  }, [id]);

  async function updatePost(e) {
    e.preventDefault();
    if (!title || !summary || !content || !files) return;

    try {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('file', files[0]);

      const res = await fetch(`http://localhost:4000/edit-post/${id}`, {
        method: 'PUT',
        body: data,
      });

      if (res.ok) setRedirect(true);
    } catch (err) {
      console.error('Error updating post :(');
    }
  }

  if (redirect) return <Navigate to={`/posts/${id}`} />;

  return (
    <>
      <form onSubmit={updatePost}>
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
        <Editor theme={'snow'} content={content} setContent={setContent} />
        <button style={{ marginTop: '5px' }}>Update Post</button>
      </form>
    </>
  );
}

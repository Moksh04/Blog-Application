import { formatISO9075 } from 'date-fns'; // ISO9075 is the format used by most mySQL and noSQL DBs
import { Link } from 'react-router-dom';

export default function Post({
  _id,
  title,
  cover,
  summary,
  createdAt,
  author,
}) {
  return (
    <div className="post">
      <div className="post-img">
        <Link to={`/posts/${_id}`}>
          <img src={`http://localhost:4000/${cover}`} alt="blogimg" />
        </Link>
      </div>

      <div className="texts">
        <Link to={`/posts/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <div className="post-info">
          <a href="/">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </div>
        <p className="post-summary">{summary}</p>
      </div>
    </div>
  );
}

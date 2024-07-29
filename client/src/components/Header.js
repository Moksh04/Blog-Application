import { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../Contexts/UserContext';

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    async function getProfileInfo() {
      try {
        const res = await fetch('http://localhost:4000/profile', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch user details :(');

        const userData = await res.json();
        setUserInfo(userData);
      } catch (err) {
        console.log(err.message);
      }
    }
    getProfileInfo();
  }, [setUserInfo]);

  const username = userInfo?.username;

  function logout() {
    fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      setUserInfo({});
    });
  }

  return (
    <header>
      <NavLink to="/" className="logo">
        InkSpire
      </NavLink>
      <nav>
        {(!username && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )) || (
          <>
            <NavLink to="create">Create a new post</NavLink>
            <NavLink to="/" onClick={logout}>
              | Logout
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

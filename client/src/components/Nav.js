import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';



const Navbar = () => {

  const searchModal = useRef(null);
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    M.Modal.init(searchModal.current);

  }, []);

  document.addEventListener('DOMContentLoaded', function() {
    let options=null;
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options);
  });

  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="material-icons modal-trigger ss"
            style={{ color: 'black' }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/create">CreatePost</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">My following posts</Link>
        </li>,
        <li key="5">
          <button
            className="btn #c62828 red darken-3 ll" 
            onClick={() => {
              localStorage.clear();
              dispatch({ type: 'CLEAR' });
              window.location.reload();
              history.push('./signin');
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/Signin">Login</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch('/search-users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserDetails(result.user);
      });

  };

  return (
    
    <div>
      <nav>
        <div class="nav-wrapper">
          <Link to={state ? '/' : '/signin'} className="brand-logo left">
          Instagram
          </Link>
          <a href="#" data-target="mobile-demo" class="sidenav-trigger" style={{float:"right"}}><i class="material-icons">menu</i></a>
          <ul class="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>

      <ul class="sidenav" id="mobile-demo">
        {renderList()}
      </ul>


      <div
        id="modal1"
        class="modal"
        ref={searchModal}
        style={{ color: 'black' }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection">
            {userDetails.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id
                      ? '/profile/' + item._id
                      : '/profile'
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch('');
                  }}
                >
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modl-close waves-effect waves-green btn-flat"
            onClick={() => setSearch('')}
          >
            Close
          </button>
        </div>

    </div>
      </div>
  );
};

export default Navbar;

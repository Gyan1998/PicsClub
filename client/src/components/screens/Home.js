import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link,useHistory } from "react-router-dom";



const Home = () => {

  const history=useHistory();
  const [data, setData] = useState([]);

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    if(state)
    {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
    }
  }, [state]);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  const deleteComment = (postId,comId) => {
    fetch(`/deletecomment/${postId}/${comId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card homecard" key={item._id}>
            <h5 style={{ padding: "5px" }}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                <div style={{display:"flex",alignItems:"center"}}>
                  <img
                    src={item.postedBy.pic}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "20px"
                    }}
                    alt="pic"
                  />
                  <div>{item.postedBy.name}</div>
                </div>
              </Link>
              {item.postedBy._id == state._id && (
                <i
                  className="material-icons"
                  style={{ float: "right" }}
                  onClick={() => {
                    deletePost(item._id);
                  }}
                >
                  delete
                </i>
              )}
              </div>
            </h5>
            <div className="card-image">
              <img src={item.photo} alt="post-pic" />
            </div>
            <div className="card-content">
            <div style={{display:"flex",justifyContent:"space-around"}}>
             {item.likes.includes(state._id) ? (
              <i className="material-icons" style={{ color:"red"}}>
                favorite
              </i>
              ):(
              <i className="material-icons" style={{ color:"black"}}>
                favorite
              </i>
              )}
              <div style={{textAlign:"center"}}>
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}
              <h6>{item.likes.length} likes</h6>
              </div>
              <div style={{textAlign:"center"}}>
              <i
                  className="material-icons"
                >
                  comment
                </i>
                <h6>{item.comments.length} comments</h6>
                </div>
                </div>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <h6 key={record._id}>
                      <span style={{ fontWeight: "500" }}>
                        {record.postedBy.name}
                      </span>{" "}
                      {record.typetext}
                    </h6>
                    {record.postedBy._id == state._id && (
                        <i
                          className="material-icons"
                          onClick={() => {
                            deleteComment(item._id,record._id);
                          }}
                        >
                          delete
                        </i>
                    )}
                  </div>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                  e.target[0].value="";
                }}
              >
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{flexBasis:"80%"}}><input type="text" placeholder="add a comment" /></div><div><button style={{background:"white",borderRadius:"10px"}}><i className="material-icons #1e88e5 blue-text text-darken-1">send</i></button></div>
              </div>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;

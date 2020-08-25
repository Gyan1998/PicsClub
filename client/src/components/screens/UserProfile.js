import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        setProfile(result);
        //setPics(result.mypost);
      });
  }, []);

  const FollowUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const UnFollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              maxWidth:"550px",
              display: "flex",
              flexWrap:"wrap",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid gray",
            }}
          >
            <div className="pr1">
              <img
                src={userProfile.user.pic}
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                alt="Profile pic"
              />
            </div>
            <div className="pr2">
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div className="pr21">
                <h6>{userProfile.posts.length} <br/>posts</h6>
                <h6>{userProfile.user.followers.length} <br/>followers</h6>
                <h6>{userProfile.user.following.length} <br/>following</h6>
              </div>
              {showfollow ? (
                <button
                  style={{ margin: "10px" ,marginLeft:"0px"}}
                  className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                  onClick={() => FollowUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{ margin: "10px" ,marginLeft:"0px"}}
                  className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                  onClick={() => UnFollowUser()}
                >
                  UnFollow
                </button>
              )}
            </div>
          </div>
            <div className="gallery">
              {userProfile.posts.map((item) => {
                return (
                  <div className="col1">
                  <img style={{width:"100%"}}
                    key={item._id}
                    className="item"
                    src={item.photo}
                    alt={item.title}
                  />
                  </div>
                );
              })}
            </div>
        </div>
      ) : (
        <h2>loading...!</h2>
      )}
    </>
  );
};

export default Profile;

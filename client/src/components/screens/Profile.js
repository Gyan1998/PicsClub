import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
      //console.log(image);
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "drvcwh5hs");
      fetch("https://api.cloudinary.com/v1_1/drvcwh5hs/image/upload/", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              //console.log(result);
             M.toast({
              html: "Updated pic successfully",
              classes: "#43a047 green darken-1",
            });
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: data.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid gray",
        }}
      >
        <div
          style={{            
            maxWidth: "550px",
            display: "flex",
            flexWrap:"wrap",
            justifyContent: "space-around",
          }}
        >
          <div className="pr1">
            <img
              src={state ? state.pic : "loading"}
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              alt="Profile pic"
            />
          </div>
          <div className="pr2">
            <h4>{state ? state.name : "loading"}</h4>
            <h5>{state ? state.email : "loading"}</h5>
            <div className="pr21">
              <div><h6>{mypics.length} <br/>posts</h6></div>
              <div><h6>{state ? state.followers.length : "0"} <br/>followers</h6></div>              
              <div><h6>{state ? state.following.length : "0"} <br/>following</h6></div>
            </div>
          </div>
        </div>

        <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn #64b5f6 blue lighten-2">
            <span>Update Pic</span>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => {
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
  );
};

export default Profile;

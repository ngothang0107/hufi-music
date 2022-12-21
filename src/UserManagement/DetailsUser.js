import "./StyleUser.css";

import { auth, database } from "../firebase/firebase-config";
import {
    doc,
    serverTimestamp,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    where,
    query,
    getDocs,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";

import { useEffect } from "react";

import { toast } from "react-toastify";
import { useState } from "react";

function DetailsUser({ setDetailsUser, user, songs }) {
    console.log(user);
    // const [dataUser, setDataUser] = useState(user);
    // useEffect(() => {
    //     setDataUser(user);
    // }, []);

    return (
        <div className="details-user__wrapper">
            <div className="details-user__header">
                <div className="details-user__header-name">
                    {songs ? "Bài hát yêu thích" : "Album đã tạo"} - {user?.name}
                </div>
                <div onClick={() => setDetailsUser(false)} className="details-user__header-close">
                    <i className="ic-close"></i>
                </div>
            </div>
            <div className="details-user__body">
                {/*  */}
                {songs && user?.favouriteSongs.length > 0
                    ? user?.favouriteSongs.map((song, index) => {
                          return (
                              <div key={index} className="details-user__item">
                                  <div className="details-user__img">
                                      <img src={song?.thumbnailM || song?.thumb} alt="" />
                                  </div>
                                  <div className="details-user__content">
                                      <div className="details-user__content-header">{song?.title}</div>
                                      <div className="details-user__content-body">
                                          Nghệ sĩ: {song?.artistsNames || song?.artists[0]?.name}
                                      </div>
                                  </div>
                              </div>
                          );
                      })
                    : !songs && user?.myAlbum.length > 0
                    ? user.myAlbum.map((album, index) => {
                          return (
                              <div key={index} className="details-user__album">
                                  <div className="details-user__album-name">{album.name}</div>
                                  {album.data.length > 0 ? <div className="details-user__album-body">
                                      <div className="details-user__album-img">
                                          <img src={album?.data[0]?.thumbnailM} alt="" />
                                      </div>
                                      <div className="details-user__album-item">
                                          {album.data.length > 0
                                              ? album.data.map((e, index) => {
                                                    return (
                                                        <>
                                                            <div className="details-user__album-item__wrapper">
                                                                <div className="details-user__album-item__img">
                                                                    <img src={e.thumbnailM} alt="" />
                                                                </div>
                                                                <div className="details-user__album-item__header">
                                                                    <div className="details-user__album-item__title">
                                                                        {e.title}
                                                                    </div>
                                                                    <div className="details-user__album-item__name">
                                                                        {e.artistsNames}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                })
                                              : ""}
                                      </div>
                                  </div> : ''}
                              </div>
                          );
                      })
                    : "Không có bài hát hoặc album nào"}

                {/*  */}
            </div>
        </div>
    );
}

export default DetailsUser;

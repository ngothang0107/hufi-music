import React, { memo, useEffect, useState } from "react";
import ActionIcon from "../Icon/ActionIcon";
import ActionPlay from "../Icon/ActionPlay";
import LoadingIcon from "../Icon/LoadingIcon";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Draggable } from "react-beautiful-dnd";
import {
    pushSongHistoryPlayList,
    setCurrentIndexSongShuffle,
    setCurrentIndexSong,
    pushSongHistoryPlayListShuffle,
} from "../../features/QueueFeatures/QueueFeatures";
import { setPlay, setReady } from "../../features/SettingPlay/settingPlay";
import useLikeHook from "../../hook/useLikeHook";
import Tippy from "@tippyjs/react";
import styled from "styled-components";
import { auth, database } from "../../firebase/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Comment from "./Comment";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";

const LoginPortalStyyles = styled.div`
    background-color: var(--primary-bg);
    border-radius: 8px;
    box-shadow: 0 0 5px 0 rgb(0 0 0 / 20%);
    width: 240px;
    padding-top: 10px;
    padding-bottom: 10px;
    .menu-list {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        li.is-active,
        li:hover {
            background-color: var(--alpha-bg);
            color: var(--text-item-hover);
        }
        li {
            width: 100%;
        }

        li button {
            font-size: 14px;
            position: relative;
            color: var(--navigation-text);
            display: flex;
            justify-content: start;
            align-items: center;
            padding: 12px 20px;
            i {
                margin-right: 10px;
                font-size: 20px;
            }
            .new-album {
                font-size: 14px;
            }
            .wrapper-new-album.display {
                display: flex !important;
            }import { users } from './../../features/User/userFeatures';

            .new-album-input {
                display: inline-block;
                width: 60%;
                height: 30px;
                margin: 10px 0;
                outline: none;
                border-radius: 10px;
                color: black;
            }
            .new-album-btn:hover {
                background-color: var(--alpha-bg);
                color: var(--text-item-hover);
            }
        }
        li a {
            color: var(--text-secondary);
        }
    }

    .tippy-box {
        background-color: transparent;
        border: none;

        .tippy-content {
            padding: 0;
        }
    }
`;

const MenuAddPlaylist = ({ setOpen, data, myAlbum, setMyAlbum }) => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users);
    // const [myAlbum, setMyAlbum] = useState([]);
    const [openInput, setOpenInput] = useState(false);
    const [albumText, setAlbumText] = useState("");

    const handleCreateNewAlbum = async () => {
        if (albumText === "" || !users.activeUser) {
            if (!users.activeUser) {
                toast("Vui lòng đăng nhập!", { type: "error" });
            } else {
                toast("Đã xảy ra lỗi!", { type: "error" });
            }
            return;
        }
        const docRef = doc(database, "users", users.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.data()?.myAlbum?.length > 0) {
            for (let i = 0; i < docSnap.data().myAlbum.length; i++) {
                if (docSnap.data().myAlbum[i].name === albumText) {
                    setAlbumText("");
                    toast("Album đã có!", { type: "error" });
                    return;
                }
            }
            await updateDoc(docRef, {
                myAlbum: [...docSnap.data().myAlbum, { name: albumText, data: [] }],
                // password: data.passwordNew,
            });
            toast("Tạo album thành công", { type: "success" });
            setAlbumText("");
            setMyAlbum([...myAlbum, { name: albumText, data: [] }]);
        } else {
            await updateDoc(docRef, {
                myAlbum: [{ name: albumText, data: [] }],
                // password: data.passwordNew,
            });
            toast("Tạo album thành công", { type: "success" });
            setAlbumText("");
            setMyAlbum([{ name: albumText, data: [] }]);
        }
        console.log("data", data);
    };

    const handleAddSongToAlbum = async (e) => {
        // console.log(e.currentTarget.getAttribute('data-album'));
        const albumName = e.currentTarget.getAttribute("data-album");
        const docRef = doc(database, "users", users.id);
        const docSnap = await getDoc(docRef);

        const albumList = docSnap.data().myAlbum;
        let haveAlbum = false;
        for (let i = 0; i < albumList.length; i++) {
            if (albumList[i].name === albumName) {
                let flag = false;
                haveAlbum = true;
                for (let j = 0; j < albumList[i].data.length; j++) {
                    if (albumList[i].data[j].encodeId === data.encodeId) {
                        flag = true;
                    }
                }
                if (flag === false) {
                    albumList[i].data.push(data);
                    break;
                }
            }
        }
        if (!haveAlbum) {
            toast("Đã xảy ra lỗi!", { type: "error" });
            return;
        }
        await updateDoc(docRef, {
            myAlbum: albumList,
        });
        toast("Thêm bài hát vào album thành công", { type: "success" });
        setAlbumText("");
        setMyAlbum(albumList);

        // console.log("data", data);
    };

    useEffect(() => {
        const getMyAlbum = async () => {
            const docRef = doc(database, "users", users.id);
            const docSnap = await getDoc(docRef);
            const listAlbum = docSnap.data().myAlbum;
            setMyAlbum(listAlbum);
        };
        getMyAlbum();
    }, [users]);

    return (
        <LoginPortalStyyles className="menu menu-settings setting-header header-dropdown pad-t-0">
            <ul className="menu-list">
                <li className="header-player-setting">
                    <button
                        // onClick={handleCreateNewAlbum}
                        className="w-full zm-btn button cursor-pointer"
                        style={{ flexDirection: "column" }}
                        tabIndex={0}
                    >
                        <span onClick={() => setOpenInput(!openInput)} className="new-album">
                            Tạo album mới
                        </span>
                        <div
                            style={{ display: "none", alignItems: "center" }}
                            className={`wrapper-new-album ${openInput ? "display" : ""}`}
                        >
                            <input
                                value={albumText}
                                onChange={(e) => setAlbumText(e.target.value)}
                                className="new-album-input"
                                placeholder="Tên album"
                            />
                            <button
                                onClick={handleCreateNewAlbum}
                                className="new-album-btn"
                                style={{
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    padding: "6px 6px",
                                    marginLeft: "6px",
                                    border: "1px solid #ccc",
                                    borderRadius: "10px",
                                }}
                            >
                                Tạo mới
                            </button>
                        </div>
                    </button>
                </li>
                {myAlbum &&
                    myAlbum.map((album, index) => (
                        // <Link className="w-full" to="/mymusic/album">
                        <li
                            onClick={handleAddSongToAlbum}
                            key={index}
                            data-album={album.name}
                            className="header-player-setting"
                        >
                            <button className="w-full zm-btn button cursor-pointer">
                                {/* <i className="icon ic-add" /> */}
                                <span style={{ marginRight: "15px" }} class="material-symbols-outlined">
                                    queue_music
                                </span>
                                <span>{album.name}</span>
                            </button>
                        </li>
                        // </Link>
                    ))}
            </ul>
        </LoginPortalStyyles>
    );
};

const LoginPortal = ({ setOpen, data, myAlbum, setMyAlbum }) => {
    const user = useSelector((state) => state.users);
    const [openMenuAlbum, setpenMenuAlbum] = useState(false);
    const [openComment, setOpenComment] = useState(false);
    const dispatch = useDispatch();
    // console.log('data', data);

    return (
        <LoginPortalStyyles className="menu menu-settings setting-header header-dropdown pad-t-0">
            <ul className="menu-list">
                <Tippy
                    animation={"perspective-extreme"}
                    onClickOutside={() => setpenMenuAlbum(false)}
                    visible={openMenuAlbum}
                    content={
                        <MenuAddPlaylist
                            data={data}
                            myAlbum={myAlbum}
                            setMyAlbum={setMyAlbum}
                            setOpen={setpenMenuAlbum}
                        />
                    }
                    interactive={true}
                    arrow={false}
                    offset={[30, 0]}
                    placement={"left-end"}
                >
                    <li onClick={() => setpenMenuAlbum((open) => !open)} className="header-player-setting">
                        <button className="w-full zm-btn button cursor-pointer" tabIndex={0}>
                            <i className="icon ic-add"></i>
                            <span>Thêm vào album</span>
                        </button>
                    </li>
                </Tippy>
                {/* CMT */}
                <li
                    onClick={() => {
                        if (!user.activeUser) {
                            toast("Vui lòng đăng nhập!", { type: "error" });
                            return;
                        }
                        setOpenComment((open) => !open);
                    }}
                    className="header-player-setting"
                >
                    <button className="w-full zm-btn button cursor-pointer" tabIndex={0}>
                        <i className="icon ic-comment"></i>
                        <span>Bình luận</span>
                    </button>
                </li>
                <Comment song={data} open={openComment} setOpen={setOpenComment} />
                {/* SHARE */}
                <li
                    onClick={() => {
                        if (!user.activeUser) {
                            toast("Vui lòng đăng nhập!", { type: "error" });
                            return;
                        }
                        // setOpenComment((open) => !open);
                    }}
                    className="header-player-setting"
                >
                    <button className="w-full zm-btn button cursor-pointer" tabIndex={0}>
                        <i className="icon ic-share"></i>
                        <FacebookShareButton
                            url={data.link.includes("zingmp3") ? data.link : `https://zingmp3.vn${data.link}`}
                            quote={"HUFI MUSIC - Nghe nhạc chất lượng cao"}
                            hashtag={"#HUFI_MUSIC"}
                        >
                            Chia sẻ
                        </FacebookShareButton>
                    </button>
                </li>
            </ul>
        </LoginPortalStyyles>
    );
};

//

const ItemRighPlayer = ({ data, index, items, isHistory, setToggleSilde, lastIndex, myAlbum, setMyAlbum }) => {
    const dispatch = useDispatch();
    const { playing, isReady, isRandom } = useSelector((state) => state.setting);
    const { isLike, handleLike } = useLikeHook(data, 2);
    const [open, setOpen] = useState(false);
    // const [myAlbum, setMyAlbum] = useState([]);
    const handleOpen = () => {
        setOpen(!open);
    };
    console.log("re-render");
    const currentIndexSong = useSelector((state) => state.queueNowPlay.currentIndexSong);
    const playlistEncodeId = useSelector((state) => state.queueNowPlay.playlistEncodeId);
    const infoCurrenAlbum = useSelector((state) => state.queueNowPlay.infoCurrenAlbum);
    const currentEncodeId = useSelector((state) => state.queueNowPlay.currentEncodeId);

    let active = data?.encodeId === currentEncodeId || data?.id === currentEncodeId;
    let isPre = index < currentIndexSong;

    if (isHistory) {
        return (
            <li className={`player_queue-item   ${active ? "player_queue-active" : ""} `}>
                <div className="player_queue-item-left">
                    <div className="player_queue-left">
                        <LazyLoadImage className="player_queue-img" src={data?.thumbnail || data?.thumb} alt="" />
                        <div className="player_queue-img-hover">
                            {!active && (
                                <div
                                    onClick={() => {
                                        dispatch(setReady(false));
                                        const item = [...items];
                                        let isFind = item.find((e) => e.encodeId === data.encodeId);
                                        if (isFind) {
                                            let index = item.indexOf(isFind);
                                            item.splice(index, 1);
                                        }

                                        const insert = (arr, index, newItem) => [
                                            ...arr.slice(0, index),
                                            newItem,
                                            ...arr.slice(index),
                                        ];
                                        const res = insert(item, currentIndexSong + 1, data);

                                        dispatch(
                                            pushSongHistoryPlayList({
                                                item: data,
                                                list: res,
                                                index: currentIndexSong + 1,
                                            })
                                        );
                                        if (isRandom) {
                                            dispatch(
                                                pushSongHistoryPlayListShuffle({
                                                    item: data,
                                                    list: res,
                                                    index: currentIndexSong + 1,
                                                })
                                            );
                                        }

                                        setToggleSilde((value) => !value);
                                        dispatch(setPlay(true));
                                    }}
                                >
                                    {<ActionPlay></ActionPlay>}
                                </div>
                            )}

                            {active && (
                                <>
                                    {isReady && (
                                        <>
                                            {!playing && (
                                                <span onClick={() => dispatch(setPlay(true))}>
                                                    <ActionPlay></ActionPlay>
                                                </span>
                                            )}
                                            {playing && (
                                                <span onClick={() => dispatch(setPlay(false))}>
                                                    <ActionIcon></ActionIcon>
                                                </span>
                                            )}
                                        </>
                                    )}

                                    {!isReady && <LoadingIcon notLoading></LoadingIcon>}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="player_queue-music-info">
                        <div className="player_queue-music">{data?.title}</div>
                        <div className="player_queue-name">
                            {data?.artists &&
                                data?.artists?.slice(0, 3)?.map((e, index) => {
                                    let prara = ", ";

                                    if (index === 2) {
                                        prara = "...";
                                    }

                                    if (data?.artists.length === 1) {
                                        prara = "";
                                    }
                                    if (data?.artists.length === 2 && index === 1) {
                                        prara = "";
                                    }
                                    if (data?.artists.length === 3 && index === 2) {
                                        prara = "";
                                    }

                                    return (
                                        <span key={index}>
                                            <Link to={`/nghe-si/${e.alias}/`}>{e.name}</Link>
                                            {prara}
                                        </span>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                <div className="player_queue-item-right">
                    <div onClick={handleLike} className="player_queue-btn player_btn zm-btn">
                        <i className={`icon  ${isLike ? "ic-like-full" : "ic-like"} `}></i>
                        <span className="playing_title-hover"> {isLike ? " Xóa khỏi " : "Thêm vào"} thư viện </span>
                    </div>

                    <Tippy
                        animation={"perspective-extreme"}
                        onClickOutside={() => setOpen(false)}
                        visible={open}
                        content={
                            <LoginPortal data={data} myAlbum={myAlbum} setMyAlbum={setMyAlbum} setOpen={setOpen} />
                        }
                        interactive={true}
                        arrow={false}
                        offset={[0, 10]}
                        placement={"bottom-end"}
                    >
                        <div onClick={handleOpen} className="player_queue-btn player_btn zm-btn">
                            <i className="icon ic-more"></i>
                            <span className="playing_title-hover">Xem thêm</span>
                        </div>
                    </Tippy>
                </div>
            </li>
        );
    }

    return (
        <Draggable key={data.encodeId || data.id} draggableId={data.encodeId || data.id} index={index}>
            {(provoied, snapshot) => (
                <div draggable ref={provoied.innerRef} {...provoied.dragHandleProps} {...provoied.draggableProps}>
                    <li
                        className={`player_queue-item ${isPre ? "is-pre" : ""} ${
                            snapshot.isDragging ? "active-dragg" : ""
                        } ${active ? "player_queue-active" : ""} `}
                    >
                        <div className="player_queue-item-left">
                            <div className="player_queue-left">
                                <LazyLoadImage
                                    className="player_queue-img"
                                    src={data?.thumbnail || data?.thumb}
                                    alt=""
                                />
                                <div className="player_queue-img-hover">
                                    {active && (
                                        <>
                                            {isReady && (
                                                <>
                                                    {!playing && (
                                                        <span onClick={() => dispatch(setPlay(true))}>
                                                            <ActionPlay></ActionPlay>
                                                        </span>
                                                    )}
                                                    {playing && (
                                                        <span onClick={() => dispatch(setPlay(false))}>
                                                            <ActionIcon></ActionIcon>
                                                        </span>
                                                    )}
                                                </>
                                            )}

                                            {!isReady && <LoadingIcon notLoading></LoadingIcon>}
                                        </>
                                    )}

                                    {!active && (
                                        <div
                                            onClick={() => {
                                                dispatch(setReady(false));
                                                if (!isRandom) {
                                                    dispatch(setCurrentIndexSong(index));
                                                }
                                                if (isRandom) {
                                                    dispatch(setCurrentIndexSongShuffle(index));
                                                }

                                                dispatch(setPlay(true));
                                            }}
                                        >
                                            {<ActionPlay></ActionPlay>}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="player_queue-music-info">
                                <div className="player_queue-music">{data?.title}</div>
                                <div className="player_queue-name">
                                    {data?.artists &&
                                        data?.artists?.slice(0, 3)?.map((e, index) => {
                                            let prara = ", ";

                                            if (index === 2) {
                                                prara = "...";
                                            }

                                            if (data?.artists.length === 1) {
                                                prara = "";
                                            }
                                            if (data?.artists.length === 2 && index === 1) {
                                                prara = "";
                                            }
                                            if (data?.artists.length === 3 && index === 2) {
                                                prara = "";
                                            }

                                            return (
                                                <span key={index}>
                                                    <Link to={`/nghe-si/${e.alias}/`}>{e.name}</Link>
                                                    {prara}
                                                </span>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                        <div className="player_queue-item-right">
                            {/* <div className="player_queue-btn player_btn zm-btn">
                        <i className="icon ic-like"></i>
                        <span className="playing_title-hover">Thêm vào thư viện </span>
                     </div> */}
                            <div onClick={handleLike} className="player_queue-btn player_btn zm-btn">
                                <i className={`icon  ${isLike ? "ic-like-full" : "ic-like"} `}></i>
                                <span className="playing_title-hover">
                                    {" "}
                                    {isLike ? " Xóa khỏi " : "Thêm vào"} thư viện{" "}
                                </span>
                            </div>
                            <Tippy
                                animation={"perspective-extreme"}
                                onClickOutside={() => setOpen(false)}
                                visible={open}
                                content={
                                    <LoginPortal
                                        data={data}
                                        myAlbum={myAlbum}
                                        setMyAlbum={setMyAlbum}
                                        setOpen={setOpen}
                                    />
                                }
                                interactive={true}
                                arrow={false}
                                offset={[0, 10]}
                                placement={"bottom-end"}
                            >
                                <div
                                    onClick={() => setOpen((open) => !open)}
                                    className="player_queue-btn player_btn zm-btn"
                                >
                                    <i className="icon ic-more"></i>
                                    <span className="playing_title-hover">Xem thêm</span>
                                </div>
                            </Tippy>
                        </div>
                    </li>
                    {active && infoCurrenAlbum.length !== 0 && !isHistory && !snapshot.isDragging && (
                        <div className="next-songs">
                            {!lastIndex && <h3 className="title is-6">Tiếp theo</h3>}
                            <h3 className="subtitle is-6">
                                <span>Từ playlist</span>
                                <Link to={`/album/${playlistEncodeId}`}>
                                    <span>
                                        <span>{infoCurrenAlbum?.title}</span>

                                        <span style={{ position: "fixed", visibility: "hidden", top: 0, left: 0 }}>
                                            …
                                        </span>
                                    </span>
                                </Link>
                            </h3>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default memo(ItemRighPlayer);

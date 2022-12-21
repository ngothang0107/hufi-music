import "./Comment.css";

import { getDatabase, ref, child, get, onValue, push, update, remove } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { memo } from "react";

import Modal from "react-modal";
import { toast } from "react-toastify";

import Tippy from "@tippyjs/react";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

Modal.setAppElement("#root");

function CommentMore({ cmt, setOpen, setCmtEdit }) {
    const handleDelete = () => {
        const db = getDatabase();
        const connectedRef = ref(db, "comments/" + cmt.id);
        remove(connectedRef);
        setOpen(false);
    };

    const handleEdit = () => {
        setCmtEdit(cmt.id);

    };
    return (
        <div className="menu-more">
            <div onClick={handleDelete} className="menu-more-item menu-more-delete">
                Xóa bình luận
            </div>
            <div onClick={handleEdit} className="menu-more-item menu-more-edit">
                Sửa bình luận
            </div>
        </div>
    );
}

function Comment({ song, open, setOpen }) {
    const user = useSelector((state) => state.users);

    const [cmtEdit, setCmtEdit] = useState("");

    const [cmtEditText, setCmtEditText] = useState("");

    const [openMore, setOpenMore] = useState(false);

    const [commentText, setCommentText] = useState("");
    const [listComments, setListComments] = useState([]);

    const handleEditCmt = (cmt) => {
        const newCmt = {
            ...cmt,
            message: cmtEditText,
        };
        const db = getDatabase();
        const updates = {};
        updates["/comments/" + cmt.id] = newCmt;
        update(ref(db), updates);
        setCmtEditText('');
        setCmtEdit('');
    }

    const handleSubmit = (event) => {
        const db = getDatabase();
        event.preventDefault();
        let comment = {
            avatar: "",
            createdAt: "",
            message: "",
            songId: "",
            parentId: "",
            username: "",
            userId: null,
        };
        comment.avatar = user?.imgUrl || "https://avatar.talk.zdn.vn/default";
        comment.username = user.name || user.email;
        const d = new Date().toLocaleString();
        comment.createdAt = d;
        comment.message = commentText;
        comment.songId = song.encodeId;
        comment.userId = user.id;
        let newPostKey = null;
        newPostKey = push(child(ref(db), "comments")).key;
        const updates = {};
        updates["/comments/" + newPostKey] = comment;
        update(ref(db), updates);
        setCommentText("");
    };

    useEffect(() => {
        const getComments = async () => {
            const db = getDatabase();
            const connectedRef = ref(db, "comments");
            onValue(connectedRef, (snapshot) => {
                if (snapshot.val()) {
                    const data = snapshot.val();
                    let listComments = [];
                    for (let id in data) {
                        listComments.push({
                            id,
                            message: data[id].message,
                            avatar: data[id].avatar,
                            username: data[id].username,
                            createdAt: data[id].createdAt,
                            songId: data[id].songId,
                            parentId: data[id].parentId,
                            userId: data[id].userId,
                        });
                    }
                    listComments = listComments.filter((item) => item.songId === song.encodeId);
                    console.log("listcomment:", listComments);
                    let listCommentsLocal = listComments.filter((item) => item.parentId === "");
                    listCommentsLocal.forEach((ele) => {
                        ele.listChild = [];
                        const listChild = listComments.filter((comment) => comment.parentId === ele.id);
                        ele.listChild = [...listChild];
                    });
                    setListComments(listCommentsLocal);
                } else {
                    setListComments([]);
                }
            });
        };
        getComments();
    }, []);
    return (
        <>
            {/* {listComments &&
                listComments.map((cmt, index) => {
                    return (
                        <div key={index} className="wrapper">
                            <div className="image">
                                <img src={cmt.avatar} alt="" />
                            </div>
                            <div className="content">
                                <div className="title">
                                    <span>{cmt.username}</span>
                                </div>
                                <div className="text">
                                    <span>{cmt.message}</span>
                                </div>
                            </div>
                        </div>
                    );
                })} */}
            <Modal isOpen={open} onRequestClose={() => setOpen(false)} style={customStyles}>
                <div className="comment_content">
                    <div className="comment_header">
                        <div className="comment_title">Bình luận</div>
                        <div onClick={() => setOpen(false)} className="comment_close">
                            <i className="ic-close"></i>
                        </div>
                    </div>
                    <div className="comment_body">
                        <div className="comment_body-number">{listComments.length} bình luận</div>
                        <div className="comment_body-main">
                            {listComments.map((cmt, index) => {
                                return (
                                    <div key={index} className="comment_item">
                                        <div onClick={() => setOpenMore(true)} className="comment_item-img">
                                            <img src={cmt.avatar} />
                                        </div>
                                        <div className="comment_item-body">
                                            <div className="comment_item-body_name">{cmt.username}</div>
                                            <div className="comment_item-body_content">{cmt.message}</div>
                                            {cmtEdit === cmt.id && (
                                                <input
                                                    value={cmtEditText}
                                                    onChange={(e) => setCmtEditText(e.target.value)}
                                                    onBlur={() => setCmtEdit("")}
                                                    onKeyUp={(e)=> {
                                                        if(e.keyCode === 13 && cmtEditText!=='') {
                                                            handleEditCmt(cmt);
                                                        }
                                                    }}
                                                    className="comment_item-body_content-edit"
                                                    placeholder="Nhập bình luận"
                                                />
                                            )}
                                        </div>
                                        {cmt.userId === user.id && (
                                            <div onClick={() => setOpenMore(!openMore)} className="comment_item-more">
                                                <i className="ic-more"></i>
                                                {openMore && (
                                                    <CommentMore
                                                        setCmtEdit={setCmtEdit}
                                                        setOpen={setOpenMore}
                                                        cmt={cmt}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {user && (
                        <div className="comment_input">
                            <input
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyUp={(e) => {
                                    if (e.keyCode === 13 && commentText !== "") {
                                        handleSubmit(e);
                                    }
                                }}
                                type="text"
                                placeholder="Bình luân của ban..."
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}

export default memo(Comment);

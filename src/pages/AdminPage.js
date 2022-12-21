import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import "./AdminPage.css";

import AddUser from "../UserManagement/AddUser";
import EditUser from "../UserManagement/EditUser";
import DeleteUser from "../UserManagement/DeleteUser";

import { auth, database } from "../firebase/firebase-config";
import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setThemes } from "../features/setTheme/themeSetFeatures";

import LoadingIcon from "../components/Icon/LoadingIcon";

import axios from "axios";
import { tmdAPI } from "../config";
import DetailsUser from "../UserManagement/DetailsUser";

const themeAdmin = {
    name: "Xanh Da Trời",
    itemS: "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/dynamic-blue.jpg",
    dataTheme: "blue-light",
    bgImg: false,
    bgPlaying: false,
    bgHeader: false,
    dataStyle: false,
};

function AdminPage() {
    const user = useSelector((state) => state.users);
    const themePrev = useSelector((state) => state.themetoggle);

    const dispatch = useDispatch();
    dispatch(setThemes(themeAdmin));

    const [hide, setHide] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [listUser, setListUser] = useState([]);
    const [listUserFilter, setListUserFilter] = useState([]);
    const [listSong, setListSong] = useState([]);
    const [listSongFilter, setListSongFilter] = useState([]);

    const [addUser, setAddUser] = useState(false);
    const [editUser, setEditUser] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);
    const [detailsUser, setDetailsUser] = useState(false);
    const [userSelected, setUserSelected] = useState(null);
    const [selectedHeader, setSelectedHeader] = useState("user");

    const [isSongs, setIsSongs] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user.admin) {
            navigate("/404");
        }

        const getListUser = async () => {
            const querySnapshot = await getDocs(collection(database, "users"));
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push(doc.data());
            });
            setListUser(list);
            setListUserFilter(list);
        };

        const getListSong = async () => {
            const data = await axios.get(`https://api-zingmp3.vercel.app/api/newreleasechart`);
            setListSong(data.data.data.items);
            setListSongFilter(data.data.data.items);
        };
        if (selectedHeader === "user") {
            getListUser();
        } else if (selectedHeader === "song") {
            getListSong();
        }
        setHide(true);
        setSearchText("");
    }, [addUser, editUser, deleteUser, selectedHeader]);

    useEffect(() => {
        const HeaderSearch = document.querySelector(".header .form-level");
        const BottomRight = document.querySelector(".player_queue");
        const BottomPlay = document.querySelector(".playing-bar");
        const mainPage = document.querySelector(".main-page");
        const main = document.querySelector(".main");

        main.style.background = "none";
        main.style.backgroundColor = "#1d375a";
        mainPage.style.marginRight = 0;
        mainPage.style.marginBottom = "1rem";
        HeaderSearch.style.display = "none";
        BottomRight.style.visibility = "hidden";
        BottomPlay.style.visibility = "hidden";
        return () => {
            dispatch(setThemes(themePrev));
            document.location.reload();
        };
    }, []);

    const handleAdd = () => {
        if (!editUser && !deleteUser && !detailsUser) setAddUser(!addUser);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        if (e.target.value !== "") {
            if (selectedHeader === "user") {
                const filter = listUser.filter((user) => user.name.includes(e.target.value));
                setListUserFilter(filter);
            } else if (selectedHeader === "song") {
                const filter = listSong.filter((song) => song.title.includes(e.target.value));
                setListSongFilter(filter);
            }
        } else {
            if (selectedHeader === "user") {
                setListUserFilter(listUser);
            } else if (selectedHeader === "song") {
                setListSongFilter(listSong);
            }
        }
    };
    return (
        <>
            <div className="user-management">
                <div className="table-users__header">
                    <select
                        value={selectedHeader}
                        onChange={(e) => {
                            setSelectedHeader(e.target.value);
                        }}
                        className="table-users__header-select"
                    >
                        <option value="user">Users Management</option>
                        <option value="song">Songs Management</option>
                        {/* <option value="artist">Artists Management</option> */}
                    </select>
                </div>
                <div className="action-users">
                    {selectedHeader === "user" && (
                        <div className="add-user">
                            <span className="add-user-icon ic-add"></span>
                            <button onClick={handleAdd} className="add-user-btn">
                                Thêm người dùng
                            </button>
                        </div>
                    )}
                    <div className="search-user">
                        <input
                            value={searchText}
                            onChange={handleSearch}
                            type="text"
                            className="search-user-input"
                            placeholder="Tìm kiếm"
                        />
                    </div>
                </div>
                {selectedHeader === "user" && (
                    <div className="table-users">
                        <table>
                            <tr>
                                <th>STT</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Bài hát yêu thích</th>
                                <th>Album đã tạo</th>
                                <th>Ngày đăng ký</th>
                                <th>Hành động</th>
                            </tr>

                            {listUserFilter.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td className="cursor-pointer"
                                            onClick={() => {
                                                if (!addUser && !deleteUser && !editUser) {
                                                    setIsSongs(() => true);
                                                    setDetailsUser(true);
                                                    setUserSelected(user);
                                                }
                                            }}
                                        >
                                            {user.favouriteSongs.length}
                                        </td>
                                        <td className="cursor-pointer" onClick={() => {
                                            if (!addUser && !deleteUser && !editUser) {
                                                setIsSongs(() => false);
                                                setDetailsUser(true);
                                                setUserSelected(user);
                                            }
                                        }}>{user.myAlbum.length}</td>
                                        <td>{user.timestamp.toDate().toDateString()}</td>
                                        <td>
                                            <div className="table-users__action">
                                                <button
                                                    onClick={() => {
                                                        if (!addUser && !deleteUser && !detailsUser) {
                                                            setEditUser(!editUser);
                                                            setUserSelected(user);
                                                        }
                                                    }}
                                                    className="table-users__action-btn table-users__action-edit"
                                                >
                                                    Chỉnh sửa
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (!addUser && !editUser && !detailsUser) {
                                                            setDeleteUser(!editUser);
                                                            setUserSelected(user);
                                                        }
                                                    }}
                                                    className="table-users__action-btn table-users__action-delete"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </table>
                    </div>
                )}
                {selectedHeader === "song" && (
                    <div className="table-users">
                        <table>
                            <tr>
                                <th>STT</th>
                                <th>Thumbnail</th>
                                <th>Bài hát</th>
                                <th>Nghệ sĩ</th>
                                <th>Ngày ra mắt</th>
                            </tr>

                            {listSongFilter.map((song, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img className="table__img" src={song.thumbnailM} alt="" />
                                        </td>
                                        <td>{song.title}</td>
                                        <td>{song.artistsNames}</td>
                                        <td>{new Date(song.releaseDate * 1000).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })}
                        </table>
                    </div>
                )}
            </div>
            {addUser && <AddUser setAddUser={setAddUser} />}
            {editUser && <EditUser user={userSelected} setEditUser={setEditUser} />}
            {deleteUser && <DeleteUser user={userSelected} setDeleteUser={setDeleteUser} />}
            {detailsUser && <DetailsUser user={userSelected} setDetailsUser={setDetailsUser} songs={isSongs}/>}
        </>
    );
}
export default AdminPage;

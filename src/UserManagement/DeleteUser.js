import "./StyleUser.css";

import { auth, database } from "../firebase/firebase-config";
import { doc, serverTimestamp, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";

import { useEffect } from "react";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { toast } from "react-toastify";


function DeleteUser({ setDeleteUser, user }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setFocus,
    } = useForm({
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        await deleteDoc(doc(database, "users", user.id));
        // try {
        //     await deleteUser(user.id);
        // } catch(err) {
        //     console.log(err);
        //     return toast("Xóa Người Dùng Thất Bại", {
        //         type: "error",
        //     });
        // }
        toast("Xóa Người Dùng Thành Công", {
            type: "success",
        });
        setTimeout(() => {
            setDeleteUser(false);
        }, 500);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="adduser-wrapper">
            <div className="adduser-header">
                <span className="adduser-title">Xóa người dùng</span>
                <i onClick={() => setDeleteUser(false)} className="adduser-icon ic-close"></i>
            </div>
            <div className="adduser-body">
                <span className="delete-text">
                    Bạn có chắc chắn muốn xóa <span style={{'fontWeight': 700}}>{user.name}</span> ?
                </span>
            </div>
            <div className="adduser-footer">
                <button type="submit" className="adduser-btn delete-btn">
                    Xác nhận
                </button>
            </div>
        </form>
    );
}

export default DeleteUser;

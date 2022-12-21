import "./StyleUser.css";

import { auth, database } from "../firebase/firebase-config";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { useEffect } from "react";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { toast } from "react-toastify";

const schema = yup.object({
    name: yup.string().required("Vui lòng nhập trường này").max(30).min(5),
});

function EditUser({ setEditUser, user }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setFocus,
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        await updateDoc(doc(database, "users", user.id), {
            name: data.name,
        });

        toast("Sửa Người Dùng Thành Công ", {
            type: "success",
        });

        setTimeout(() => {
            reset({
                name: "",
            });
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="adduser-wrapper">
            <div className="adduser-header">
                <span className="adduser-title">Chỉnh sửa người dùng</span>
                <i onClick={() => setEditUser(false)} className="adduser-icon ic-close"></i>
            </div>
            <div className="adduser-body">
                <div className="adduser-group">
                    <input {...register("name")} className="adduser-input" placeholder=" " />
                    <div className="adduser-label">Tên hiển thị</div>
                    <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.name?.message}</div>
                </div>
            </div>
            <div className="adduser-footer">
                <button type="submit" className="adduser-btn edit-btn">
                    Xác nhận
                </button>
            </div>
        </form>
    );
}

export default EditUser;

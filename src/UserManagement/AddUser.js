import "./StyleUser.css";

import { auth, database } from "../firebase/firebase-config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { useEffect } from "react";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { toast } from "react-toastify";

const schema = yup.object({
    email: yup.string().required("Vui lòng nhập trường này").max(40).email(),
    password: yup.string().required("Vui lòng nhập trường này").max(30).min(7, "Độ dài tối thiểu 7 ký tự"),
    passwordCheck: yup
        .string()
        .required("Vui lòng nhập trường này")
        .oneOf([yup.ref("password"), null], "Không khớp với mật khẩu"),
    name: yup.string().required("Vui lòng nhập trường này").max(30).min(5),
});

function AddUser({ setAddUser }) {
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
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                await setDoc(doc(database, "users", user.uid), {
                    email: data.email,
                    password: data.password,
                    name: data.name,
                    id: user.uid,
                    favouriteSongs: [],
                    favouritePlaylist: [],
                    favouriteArtist: [],
                    myAlbum: [],
                    admin: false,
                    timestamp: serverTimestamp(),
                });

                toast("Thêm Người Dùng Thành Công ", {
                    type: "success",
                });

                setTimeout(() => {
                    reset({
                        email: "",
                        password: "",
                        passwordCheck: "",
                        name: "",
                    });
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                return toast("Thêm Không Thành Công ", {
                    type: "error",
                });
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="adduser-wrapper">
            <div className="adduser-header">
                <span className="adduser-title">Thêm người dùng</span>
                <i onClick={() => setAddUser(false)} className="adduser-icon ic-close"></i>
            </div>
            <div className="adduser-body">
                <div className="adduser-group">
                    <input {...register("email")} className="adduser-input" type="email" placeholder=" "/>
                    <div className="adduser-label">Email</div>
                    <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.email?.message}</div>
                </div>
                <div className="adduser-group">
                    <input {...register("password")} className="adduser-input" type="password" placeholder=" "/>
                    <div className="adduser-label">Password</div>
                    <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.password?.message}</div>
                </div>
                <div className="adduser-group">
                    <input {...register("passwordCheck")} className="adduser-input" type="password" placeholder=" "/>
                    <div className="adduser-label">Nhập lại password</div>
                    <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.passwordCheck?.message}</div>
                </div>
                <div className="adduser-group">
                    <input {...register("name")} className="adduser-input" placeholder=" "/>
                    <div className="adduser-label">Tên hiển thị</div>
                    <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.name?.message}</div>
                </div>
            </div>
            <div className="adduser-footer">
                <button type="submit" className="adduser-btn">
                    Thêm
                </button>
            </div>
        </form>
    );
}

export default AddUser;

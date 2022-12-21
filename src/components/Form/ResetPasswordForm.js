import React, { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../../firebase/firebase-config";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/User/userFeatures";

const schema = yup.object({
    email: yup.string().required("Vui lòng nhập trường này").max(40).email(),
});

const ResetPasswordForm = memo(({ setSign }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setFocus,
    } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        setFocus("email");
    }, [setFocus]);

    // useEffect(() => {
    //    onAuthStateChanged(auth, (user) => {
    //       console.log(user)
    //    })
    // }, [])

    const onSubmitResetPassword = (data) => {
        sendPasswordResetEmail(auth, data.email, {
            url: "http://localhost:3000/auth",
        })
            .then((result) => {
                toast("Vui lòng kiểm tra email", {
                    type: "success",
                });
            })
            .catch((err) => {
                toast("Email không tồn tại", {
                    type: "error",
                });
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmitResetPassword)} name="resetPasswordForm" className="loginForm w-full">
                <div className="form-group">
                    <input
                        {...register("email")}
                        type="email"
                        className="form-control email"
                        name="email"
                        placeholder="Email "
                    />
                </div>
                <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.email?.message}</div>
                <button className="btn-login " type="submit">
                    GỬI
                </button>
            </form>
            <div className="flex items-center justify-between mt-[20px]">
                <div>Bạn đã có tài khoản?</div>
                <button
                    onClick={() => {
                        setSign(0);
                    }}
                    className="underline text-blue-600"
                >
                    Đăng nhập{" "}
                </button>
            </div>
        </div>
    );
});

export default ResetPasswordForm;

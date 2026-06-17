"use client";

import { signIn } from "next-auth/react";
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";

const LoginModal = () => {
   const router = useRouter();
   
   const registerModal = useRegisterModal();
   const loginModal = useLoginModal();
   
   const [isLoading, setIsLoading] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FieldValues>({
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit: SubmitHandler<FieldValues> = (data) => {
      setIsLoading(true);

      signIn("credentials", {
         ...data,
         redirect: false,
      }).then((callback) => {
         setIsLoading(false);

         if (callback?.ok) {
            toast.success("Đăng nhập thành công!");
            router.refresh();
            loginModal.onClose();
         }

         if (callback?.error) {
            toast.error(callback.error);
         }
      });
   };

   const onToggle = useCallback(() => {
      loginModal.onClose();
      registerModal.onOpen();
   }, [loginModal, registerModal]);

   const bodyContent = (
      <div className="flex flex-col gap-2">
         <Heading title="Chào mừng bạn quay trở lại" subtitle="Đăng nhập vào tài khoản của bạn!" />
         <Input
            id="email"
            label="Email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
         />
         <Input
            id="password"
            label="Password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
         />
      </div>
   );

   const footerContent = (
      <div className="flex flex-col gap-4 mt-3">
         <hr />
         <Button
            outline
            label="Đăng nhập bằng Google"
            icon={FcGoogle}
            onClick={() => signIn("google")}
         />
         <Button
            outline
            label="Đăng nhập bằng Github"
            icon={AiFillGithub}
            onClick={() => signIn("github")}
         />
         <div className="text-neutral-500 text-center mt-4 font-light">
            <div className="flex flex-row items-center gap-2 justify-center">
               <div>Chưa có tài khoản Homiee?</div>
               <div className="text-cyan-800 cursor-pointer hover:underline" onClick={onToggle}>
                  Đăng ký ngay
               </div>
            </div>
         </div>
      </div>
   );

   return (
      <Modal
         disabled={isLoading}
         isOpen={loginModal.isOpen}
         title="Đăng nhập"
         actionLabel="Tiếp tục"
         onClose={loginModal.onClose}
         onSubmit={handleSubmit(onSubmit)}
         body={bodyContent}
         footer={footerContent}
      />
   );
};
export default LoginModal;

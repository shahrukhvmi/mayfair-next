import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PasswordStrengthBar from "react-password-strength-bar";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import toast, { Toaster } from "react-hot-toast";
import { useChangePasswordMutation } from "@/store/dashboardApi";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
  });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const [changePasswordMutation, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (data) => {
    try {
      const response = await changePasswordMutation({
        old_password: data.currentPassword,
        newpassword: data.newPassword,
        newpassword_confirmation: data.confirmPassword,
      }).unwrap();
      reset();
      toast.success(response.message || "API ERRORS");
    } catch (error) {
      let err = error;
      err = error.data.errors;
      Object.values(err).forEach((e) => {
        toast.error(e);
      });
    }
  };

  const [showCurrentPassword, setCurrentPassword] = useState(false);
  const [showNewPassword, setshowNewPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  const togglePasswordVisible = (field) => {
    switch (field) {
      case "currentPassword":
        setCurrentPassword((prev) => !prev);
        break;
      case "newPassword":
        setshowNewPassword((prev) => !prev);
        break;
      case "confirmPassword":
        setshowConfirmPassword((prev) => !prev);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 sm:bg-[#F9FAFB] sm:min-h-screen sm:rounded-md sm:shadow-md my-5 sm:me-5">
      <div className="">
        <h1 className="md:text-2xl text-2xl mb-2 font-semibold">Update Password</h1>
        <p className="reg-font text-gray-600 text-left text-sm xl:w-3/4 mb-4 sm:mb-0 sm:mt-2">Ensure your account is using a long, random password to stay secure.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row w-full flex-wrap items-center justify-start">
            <div className="md:w-1/2 relative w-full">
              <div className="relative">
                <TextField
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  label="Current Password"
                  variant="outlined"
                  sx={{ width: "90%", position: "relative" }}
                  className={`u-update-password ${errors.currentPassword?.message ? "u-update-password-error" : ""}`}
                  name="currentPassword"
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                />
                <div
                  className="u-upade-password-icon"
                  onClick={() => {
                    togglePasswordVisible("currentPassword");
                  }}
                >
                  {showCurrentPassword ? <VscEye /> : <VscEyeClosed />}
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative w-full mt-8">
              <div className="relative">
                <TextField
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  variant="outlined"
                  className={`u-update-password ${errors.newPassword?.message ? "u-update-password-error" : ""}`}
                  sx={{ width: "90%", position: "relative" }}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    validate: {
                      hasUpperCase: (value) => /[A-Z]/.test(value) || "Password must include at least one uppercase letter",
                      hasLowerCase: (value) => /[a-z]/.test(value) || "aPassword must include at least one lowercase letter",
                      hasNumber: (value) => /[0-9]/.test(value) || "Password must include at least one number",
                      hasSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must include at least one special character",
                    },
                  })}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                />
                <div
                  className="u-upade-password-icon"
                  onClick={() => {
                    togglePasswordVisible("newPassword");
                  }}
                >
                  {showNewPassword ? <VscEye /> : <VscEyeClosed />}
                </div>
              </div>

              <PasswordStrengthBar password={watch("newPassword")} className="w-[90%] mt-2 rounded-2xl absolute" />
            </div>
            <div className="md:w-1/2 relative w-full">
              <div className="relative">
                <TextField
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  variant="outlined"
                  className={`u-update-password ${errors.confirmPassword?.message ? "u-update-password-error" : ""}`}
                  sx={{ width: "90%", position: "relative" }}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === watch("newPassword") || "Passwords do not match",
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
                <div
                  className="u-upade-password-icon"
                  onClick={() => {
                    togglePasswordVisible("confirmPassword");
                  }}
                >
                  {showConfirmPassword ? <VscEye /> : <VscEyeClosed />}
                </div>
              </div>
            </div>
            <div className="mt-4 sm:max-w-20">
              <div className="text-center my-3">
                <button
                  disabled={!isValid || isLoading}
                  type="submit"
                  className="w-full px-6 py-2 disabled:opacity-50 disabled:hover:bg-violet-400 disabled:cursor-not-allowed bg-violet-700 border border-transparent rounded-md med-font text-xs text-white uppercase tracking-widest hover:bg-violet-700 focus:bg-bg-violet-700 active:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                  {/* Show a progress bar if loading is true */}
                  {isLoading ? (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-t-transparent border-[#ffffff] rounded-full animate-spin"></div> {/* Spinner */}
                      </div>
                      <span className="opacity-0">Saving...</span>
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default ChangePassword;

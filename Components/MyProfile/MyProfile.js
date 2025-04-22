import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormControl, MenuItem, FormHelperText, Select } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import toast from "react-hot-toast";



const MyProfile = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
        setValue,
        trigger,
        watch,
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            gender: "",
            dateOfBirth: null,
        },
    });

    const [user, setUserData] = useState(null);

    //   const { data, error, isLoading: isLoad, refetch } = useProfileUserDataQuery();
    //   const [updateUserProfile, { isLoading: isPostLoding }] = useUserUpdateMutation();
    const isPostLoding = false;
    const isLoad = false;
    const error =false;

    const data = [];
    const updateUserProfile = [];

    useEffect(() => {
        if (!isLoad && data) {
            const userData = data?.profile?.user;

            if (userData) {
                localStorage.setItem("userData", JSON.stringify(userData));
                setUserData(userData);
            } else {
                console.warn("User data not found in response.");
            }
        }

        if (error) {
            console.error("Error:", error?.data?.message || "Failed to fetch user data.");
        }
    }, [data, isLoad, error]);

    console.log(data, "datadata")

    const [dobError, setDobError] = useState("");
    const today = dayjs();

    const handleDateChange = (date) => {
        if (!date) {
            setDobError("Date of birth is required");
            setValue("dateOfBirth", null);
            return;
        }

        const age = today.diff(date, "year");

        if (age < 18) {
            setDobError("You must be at least 18 years old");
            setValue("dateOfBirth", date);
        } else {
            setDobError("");
            // const formattedDate = moment(date).format("DD-MM-YYYY");
            setValue("dateOfBirth", date);
        }
    };

    useEffect(() => {
        if (user) {
            setValue("firstName", user.fname || "");
            setValue("lastName", user.lname || "");
            setValue("phoneNumber", user.phone || "");
            setValue("gender", user.gender || "");
            setValue("dateOfBirth", user.dob || null);

            (async () => {
                await trigger(); // ✅ Trigger full validation after values are set
            })();
        }
    }, [user, setValue, trigger]);

    const onSubmit = async (data) => {
        try {


            const response = await updateUserProfile({
                dob: data.dateOfBirth,
                firstname: data.firstName,
                lastname: data.lastName,
                phone: data.phoneNumber,
                gender: data.gender,
            }).unwrap();

            // ✅ Handle Success
            toast.success(response?.message || "Profile updated successfully");

            refetch(); // 🔄 Refetch user data after update
        } catch (error) {
            // ✅ Handle Errors Properly
            const errorMessage =
                error?.data?.message || error?.message || "Failed to update profile";
            toast.error(errorMessage);
        }
    };
    // if (isLoad || !user) {
    //     return (
    //         <div className="flex justify-center items-center min-h-screen">
    //             <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
    //         </div>
    //     );
    // }
    return (
        <div className="p-6 sm:bg-[#F9FAFB] sm:min-h-screen sm:rounded-md sm:shadow-md my-5 sm:me-5">
            <div className="mb-8">
                <h2 className="md:text-xl text-lg mb-2 font-semibold">Profile Information</h2>
                <p className="reg-font text-gray-600 text-left text-sm xl:w-3/4 mt-2">Update your account's profile information and email address.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* First Name and Last Name */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" value="First Name" className="mb-1 block font-medium text-sm text-gray-700">
                            First Name
                        </label>
                        <input
                            label="First Name"
                            variant="standard"
                            fullWidth
                            {...register("firstName", { required: "First name is required" })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            className="border-gray-300 border focus:border-violet-500 focus:ring-violet-500 rounded-md shadow-sm w-full 2xl:mt-1 2xl:block 2xl:w-full px-2.5 py-2 focus-within:outline-violet-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" value="Last Name" className="mb-1 block font-medium text-sm text-gray-700">
                            Last Name
                        </label>
                        <input
                            label="Last Name"
                            variant="standard"
                            fullWidth
                            {...register("lastName", { required: "Last name is required" })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            className="border-gray-300 border focus:border-violet-500 focus:ring-violet-500 rounded-md shadow-sm w-full 2xl:mt-1 2xl:block 2xl:w-full px-2.5 py-2 focus-within:outline-violet-500"
                        />
                    </div>
                </div>

                {/* Gender Selection */}
                <div className="grid sm:grid-cols-2 gap-4">
                    {/* Gender Selection */}
                    <FormControl fullWidth variant="standard" error={!!errors.gender}>
                        <label className="block font-medium text-sm text-gray-700">Gender</label>

                        <Controller
                            name="gender"
                            control={control}
                            rules={{ required: "Gender is required" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="profile-input border-gray-300 border bg-white focus:border-violet-500 focus:ring-violet-500 rounded-md shadow-sm w-full 2xl:mt-1 2xl:block 2xl:w-full px-2.5 py-1 focus-within:outline-violet-500"
                                >
                                    <MenuItem value="">Select gender</MenuItem>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </Select>
                            )}
                        />

                        {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
                    </FormControl>


                    {/* Date of Birth */}
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <label htmlFor="name" value="date" className="block font-medium text-sm text-gray-700">
                                Date of Birth
                            </label>
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                rules={{ required: "Date of birth is required" }}
                                render={({ field }) => (
                                    <DatePicker
                                        className="u-profile-datePicker py-1"
                                        label=""
                                        value={field.value ? dayjs(field.value, "DD-MM-YYYY") : null}
                                        onChange={(date) => {
                                            handleDateChange(date);
                                            field.onChange(date);
                                        }}
                                        format="DD/MM/YYYY"
                                        maxDate={today}
                                        slotProps={{
                                            textField: {
                                                variant: "outlined",
                                                fullWidth: true,
                                                error: !!dobError,
                                                helperText: dobError,
                                                placeholder: "DD/MM/YYYY",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </div>
                </div>

                {/* Phone Number */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="my-auto">
                        <Controller
                            name="phoneNumber"
                            control={control}
                            value={watch("phoneNumber") || ""}
                            rules={{
                                required: "Phone number is required",
                                minLength: {
                                    value: 10,
                                    message: "Phone number should be at least 10 digits",
                                },
                            }}
                            render={({ field }) => <PhoneInput country="gb" placeholder="Enter your phone number" inputStyle={{ width: "100%" }} {...field} />}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="relative top-3">
                        <div className=" bg-white border-gray-400 rounded-[4px] border-1 p-[6px] cursor-not-allowed my-auto h-9">
                            <p className="font-med text-sm text-gray-400">{user?.email}</p>

                            {/* Helper text */}
                        </div>

                        <p className="reg-font text-xs mt-2 text-gray-700">( This email is associated with your account and cannot be changed)</p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-4 sm:max-w-20">
                    <div className="text-center my-3">
                        <button
                            disabled={!isValid || isPostLoding}
                            type="submit"
                            className="w-full px-6 py-2 disabled:opacity-50 disabled:hover:bg-violet-700 disabled:cursor-not-allowed bg-violet-700 border border-transparent rounded-md med-font text-xs text-white uppercase tracking-widest hover:bg-violet-700 focus:bg-bg-violet-700 active:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-viobg-violet-700 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            {/* Show a progress bar if loading is true */}
                            {isPostLoding ? (
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
            </form>
        </div>
    );
};

export default MyProfile;

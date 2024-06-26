"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { userLogin } from "@/apis/api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setActiveUser } from "@/redux/userSlice";


const defaultUser = {
	email: "",
	password: "",
};

const SignIn = () => {
	const Router = useRouter();
	const [userData, setUserData] = React.useState(defaultUser);
	const [passShow, setPassShow] = useState(false);
	const dispatch = useDispatch();
	const { activeUser } = useSelector((state) => state);

	const handleValueChange = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleGoogleLogin = () => {
		Router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/auth/google`);
	};


	const handleSubmit = async (e) => {
		e.preventDefault();
		const { email, password } = userData;
		if (!email || !password) {
			return toast.warn("Please fill all the fields!");
		}

		if (!email.includes("@")) {
			return toast.warn("Please enter a valid email!");
		}


		const res = await userLogin(userData);

		if (res?.status === 200) {
			toast.success("User Logged in Successfully");
			const user = {
				id: res.data?.thisUser?._id,
				email: res.data?.thisUser?.email,
				mobile: res.data?.thisUser?.mobile,
				name: res.data?.thisUser?.name,
				college: res.data?.thisUser?.college_name,
			};

			dispatch(setActiveUser(user));

			if (res.data?.token) {
				localStorage.setItem("userToken", res.data.token);
				Router.push(`/dashboard?token=${res.data.token}`);
			} else {
				toast.error("Something went wrong, please try again later");
			}
			setUserData(defaultUser);
		}
	};


	return (
		<>
			<div id="main" className="w-100vw bg-black   h-screen relative flex flex-col items-center justify-center md:flex-row ">
				<img src="Layer_1.svg" className="absolute z-10 pointer-events-none asset top-0  left-0 h-[200px] md:h-[280px]  xl:h-[340px]" />
				<img src="Ellipse 22.svg" className="absolute z-10  pointer-events-none asset top-0 left-0 h-[260px] md:h-[340px] xl:h-[420px]" />
				<div id="left" className="w-full bg-[#12121c]  bg-cover sm:bg-none bg-center md:bg-[url('https://cdn.dribbble.com/users/507150/screenshots/5380757/media/de2a1b1bafe3c7693b7f98362c933e66.gif')]  h-screen absolute  md:static md:w-1/2 "></div>
				<div id="right" className="w-full  z-10  flex flex-col items-center justify-center md:w-1/2 ">
					<Card className="w-[85%]  sm:w-[70%] md:w-[85%] max-w-xl  bg-[#12121c]  bg-cover bg-center   text-white">
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl">Welcome Back.</CardTitle>
							<CardDescription>Nice to have you here again</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4">
							<div className="flex items-center ">
								<Button className="bg-transparent" onClick={handleGoogleLogin}>
									<img src="grommet-icons_google.svg" className="mr-2" />
									Continue with Google
								</Button>
							</div>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground bg-[#12121c]">Or continue with</span>
								</div>
							</div>
							<div className="grid gap-2 ">
								<Label htmlFor="email">Email Address</Label>
								<Input type="email" name="email" id="email" className="text-xs lg:text-sm text-black" placeholder="Enter your email address" onChange={(e) => handleValueChange(e)} required />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<div className="flex items-center relative">
									<Input type={!passShow ? "password" : "text"} name="password" id="password" className="text-xs lg:text-sm text-black" placeholder="Enter password" onChange={(e) => handleValueChange(e)} required />
									<div className="showpass right-2 text-black absolute cursor-pointer" onClick={() => setPassShow(!passShow)}>
										{!passShow ? <FaEye /> : <FaEyeSlash />}
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex-col">
							<Button disabled={!userData || !userData.email} className="w-full mb-2 bg-transparent relative" onClick={(e) => handleSubmit(e)}>
								<img src="Rectangle 356.svg" className="absolute w-full" alt="" />
								<p className="z-10">Login</p>
							</Button>
							<Button className="w-full text-[10px] sm:text-[12px]" variant={"secondary"} onClick={() => Router.push("/signup")}>
								Not a Registered User? SignUp.
							</Button>
							<Button className="w-full text-[10px] sm:text-[12px] mt-2" variant={"secondary"} onClick={() => Router.push("/forgot-password")}>
								Forgot Password
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</>
	);
};

export default SignIn;

"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { EyeIcon, EyeOffIcon, Star } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/app/_components/ui/toast";



//register page

const RegisterPage = () => {



  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const {toast} = useToast()//toaster

  // State to manage form input fields (username, email, password)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });


  const router = useRouter();//router to redirect


  // Function to handle input field changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
//console.log("wdjh");

 // console.log({[name]:value});

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);


  // Function to handle form submission
  const handleSubmit = useCallback(async (e) => {

    e.preventDefault(); // Prevent default form submission behavior

    try {
      //console.log(formData);
      
      // Send registration data to the backend server
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/register`, formData);


      //console.log(response);
      
      // Redirect to login page if registration is successful
      if (response.status === 201) {
        
        router.push("/login");
      }

    } catch (error) {

      if(error.status===401){

        toast({
          variant: "destructive",
          title: "Uh oh! A User is already registered with this email.",
          description: "Try again with new Login Info.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })

      console.error("Error registering:", error.status); // Debug: log error



}
else{
  toast({
    variant: "destructive",
    title: "Uh oh! Something Went Wrong.",
    description: "Internal Error pr Connection Error.",
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  })
}


      //alert("Registration failed. Please try again."); // Display error message to the user
    }
  }, [formData, router]);


  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      {/* Card for the registration form */}
      <Card className="w-full max-w-md bg-zinc-900/95 border-purple-500/20 backdrop-blur-sm relative">

        {/* Decorative icon at the top */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-600 rounded-full p-3">
          <Star className="w-6 h-6 text-white" />
        </div>


        {/* Card Header with title and subtitle */}
        <CardHeader className="pt-10">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Join the Cinema
          </CardTitle>
          <p className="text-sm text-center text-gray-400 mt-2">
            Rate. Review. Remember.
          </p>
        </CardHeader>


        {/* Form inputs */}
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>


            {/* Username input field */}
            <div className="space-y-2">
              <label className="text-sm text-gray-200 font-medium">
                User Name
              </label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="David Lynch"
                className="bg-zinc-800/50 border-purple-500/30 text-white placeholder:text-gray-500"
              />
            </div>


            {/* Email input field */}
            <div className="space-y-2 mt-4">
              <label className="text-sm text-gray-200 font-medium">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="david@mulholland.drive"
                className="bg-zinc-800/50 border-purple-500/30 text-white placeholder:text-gray-500"
              />
            </div>


            {/* Password input field with toggle visibility */}
            <div className="space-y-2 mt-4">
              <label className="text-sm text-gray-200 font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="bg-zinc-800/50 border-purple-500/30 text-white placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>


            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 mt-5 text-white"
            >
              Start Your Journey
            </Button>
          </form>


          {/* Redirect to login page */}
          <p className="text-sm text-center text-gray-400">
            Already a critic?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;

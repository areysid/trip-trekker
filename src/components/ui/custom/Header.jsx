import React, { useEffect, useState } from 'react'
import { Button } from '../button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CgProfile } from "react-icons/cg";

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);
  const [showProfileIcon, setShowProfileIcon] = useState(false);

  useEffect(() => {
    console.log(user);
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const profile = await res.json();
        localStorage.setItem("user", JSON.stringify(profile));
        setOpenDialog(false);
        window.location.reload();
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src='/logo.svg' alt='App Logo' />
      <div>
        {user ? (
          <div className='flex items-center gap-5'>
            <a href='/create-trip'>
              <Button variant="outline" className='rounded-full'>+ Create Trip</Button>
            </a>
            <a href='/my-trips'>
              <Button variant="outline" className='rounded-full'>My Trips</Button>
            </a>
            <Popover>
              <PopoverTrigger>
                {showProfileIcon || !user?.picture ? (
                  <CgProfile className='h-[35px] w-[35px] rounded-full text-gray-500' size={35} />
                ) : (
                  <img
                    src={user.picture}
                    alt="User Avatar"
                    onError={() => setShowProfileIcon(true)}
                    className='h-[35px] w-[35px] rounded-full'
                  />
                )}
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className='cursor-pointer'
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.href = window.location.origin;
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">Sign In Required</DialogTitle>
            <DialogDescription>
              <img src="/logo.svg" alt="App Logo" />
              <h2 className="font-bold text-lg mt-3">Sign In With Google</h2>
              <p>Sign in to the website with Google authentication security</p>
              <Button onClick={login} className="w-full mt-5">
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;

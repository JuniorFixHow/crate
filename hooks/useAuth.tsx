'use client'

import { getSession } from "@/lib/actions/misc";
import {  SessionPayload } from "@/lib/session";
import { useEffect, useState } from "react";


export const useAuth = () => {
   const [user, setUser] = useState<SessionPayload|null>(null);
   useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getSession(); // Call the API
        if (response) {
          setUser(response);
        } else {
          setUser(null); // No session
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setUser(null); // Handle error case
      }
    };

    fetchUser();
  }, []);

    // console.log('user: ', user);
   return {user}
};



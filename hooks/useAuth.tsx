'use client'

import { getSession } from "@/lib/actions/misc";
import {  SessionPayload } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react";


// export const useAuth = () => {
//    const [user, setUser] = useState<SessionPayload|null>(null);
//    useEffect(() => {
     
//      const fetchUser = async () => {
//        try {
//          const response = await getSession(); // Call the API
//          if (response) {
//            setUser(response);
//          } else {
//            setUser(null); // No session
//          }
//        } catch (error) {
//          console.error('Failed to fetch session:', error);
//          setUser(null); // Handle error case
//        }
//      };
//     fetchUser();
//   }, []);

//     // console.log('user: ', user);
//    return {user}
// };

export const useAuth = () => {

    const fetchUser = async ():Promise<SessionPayload|null> => {
      try {
        const response = await getSession(); // Call the API
        if (response) {
          return response;
        } else {
          return null
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        return null
      }
    }
    // console.log('user: ', user);

    const {data:user=null, isPending:authLoading} = useQuery({
      queryKey:['auth'],
      queryFn:fetchUser
    })

   return {user, authLoading}
};



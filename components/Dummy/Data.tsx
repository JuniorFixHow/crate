
import React from "react"

import { RxDashboard } from 'react-icons/rx'
import { MdOutlineInbox, MdOutlineMeetingRoom, MdEventAvailable, MdOutlineEvent, MdOutlineAdminPanelSettings, MdOutlineRoomPreferences, MdHistory, MdAttachMoney } from "react-icons/md"
import { LuUserPlus, LuScanLine } from "react-icons/lu";
import { GrGroup } from "react-icons/gr";
import {  NavigationProps,  } from "@/types/Types";
import { IoIosTimer, IoMdGlobe } from "react-icons/io";
import { IoKeyOutline, IoLocationOutline } from "react-icons/io5";
import { TbBuildingChurch, TbDoorExit } from "react-icons/tb";
import { CiGlobe } from "react-icons/ci";




export const NavItems:NavigationProps[] = [
    {
        title:'Dashboard',
        isAdmin:false,
        icon: <RxDashboard />,
        link:'/dashboard'
    },
    {
        title: 'Inbox',
        isAdmin:false,
        icon: <MdOutlineInbox/>,
        link:'/dashboard/inbox'
    },
    {
        title: 'Members',
        isAdmin:false,
        icon: <LuUserPlus/>,
        link:'/dashboard/members'
    },
    {
        title: 'Event Management',
        isAdmin:false,
        children:[
            {
                text:'Event',
                image:<MdOutlineEvent/>,
                path:'/dashboard/events'
            },
            {
                text:'Badges',
                image:<LuScanLine/>,
                path:'/dashboard/events/badges'
            },
            {
                text:'Sessions',
                image:<IoIosTimer/>,
                path:'/dashboard/events/sessions'
            },
            {
                text:'Public',
                image:<CiGlobe />,
                path:'/dashboard/events/public'
            },
            {
              text:'Records',
              path:'/dashboard/events/summary',
              image:<MdHistory />
            },
        ],
        icon: <MdEventAvailable />,
    },
    {
        title: 'Users',
        isAdmin:false,
        icon: <MdOutlineAdminPanelSettings />,
        link:'/dashboard/users'
    },
    {
        title: 'Groups/Family',
        isAdmin:false,
        icon: <GrGroup/>,
        link:'/dashboard/groups'
    },
    {
      title: 'Rooms',
      isAdmin:false,
      icon: <MdOutlineMeetingRoom/>,
      children:[
          {
            text:'Room Management',
            path:'/dashboard/rooms',
            image:<MdOutlineRoomPreferences />
          },
          {
            text:'Room Assignments',
            path:'/dashboard/rooms/assignments',
            image:<TbDoorExit />
          },
          {
            text:'Keys',
            path:'/dashboard/rooms/keys',
            image:<IoKeyOutline />
          },
        ]
      },
      {
        title: 'Communities',
        isAdmin:false,
        icon: <IoMdGlobe/>,
        children:[
          {
            text:'Zones',
            path:'/dashboard/zones',
            image:<IoLocationOutline/>
          },
          {
            text:'Churches',
            path:'/dashboard/churches',
            image:<TbBuildingChurch/>
          },
        ]
      },
      {
          title: 'Revenue',
          isAdmin:false,
          icon: <MdAttachMoney />,
          link:'/dashboard/revenue'
      },
]




export const CBarFilters = [
    'Age', 'Country', 'Church', 'Gender', 'Registered By',
]

export const CBarFiltersEvent = [
  'Age Range', 'Church', 'Gender'
]













import React from "react"

import { RxDashboard } from 'react-icons/rx'
import { MdOutlineInbox, MdOutlineMeetingRoom, MdEventAvailable, MdOutlineEvent, MdOutlineAdminPanelSettings, MdOutlineRoomPreferences, MdHistory, MdAttachMoney, MdOutlineOtherHouses } from "react-icons/md"
import { LuUserPlus, LuScanLine } from "react-icons/lu";
import { GrGroup, GrPowerCycle } from "react-icons/gr";
import {  NavigationProps,  } from "@/types/Types";
import { IoIosGitNetwork, IoIosTimer, IoMdGlobe } from "react-icons/io";
import { IoKeyOutline, IoLocationOutline } from "react-icons/io5";
import { TbBuildingChurch, TbDoorExit } from "react-icons/tb";
import { CiGlobe } from "react-icons/ci";
import { RiPoliceBadgeLine, RiSchoolLine } from "react-icons/ri";
import { PiCross, PiSealCheck, PiUsersThreeThin } from "react-icons/pi";
import { HiOutlineBuildingLibrary, HiOutlineMegaphone } from "react-icons/hi2";
import { GoBriefcase } from "react-icons/go";
import { FiActivity } from "react-icons/fi";
import { FaRegAddressCard } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { LiaUserShieldSolid } from "react-icons/lia";





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
        link:'/dashboard/members/register'
    },
    {
        title: 'All Members',
        isAdmin:false,
        icon: <HiOutlineUserGroup />,
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
                text:'Registrations',
                image:<LuScanLine/>,
                path:'/dashboard/events/badges'
            },
            {
                text:'Sessions',
                image:<IoIosTimer/>,
                path:'/dashboard/events/sessions'
            },
            {
                text:'Arrivals',
                image:<GoBriefcase />,
                path:'/dashboard/events/arrivals'
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
        title: 'User Management',
        isAdmin:false,
        icon: <PiUsersThreeThin />,
        children:[
          {
            image: <MdOutlineAdminPanelSettings />,
            path:'/dashboard/users',
            text:'Users'
          },
          
          {
            image: <LiaUserShieldSolid />,
            path:'/dashboard/users/roles',
            text:'Roles'
          },
        ]
    },
    {
        title: 'Groups/Family',
        isAdmin:false,
        icon: <GrGroup/>,
        link:'/dashboard/groups'
    },
    {
      title: 'Venues/Rooms',
      isAdmin: false,
      icon: <MdOutlineMeetingRoom />,
      children: [
        {
          text: 'Venues',
          path: '/dashboard/venues',
          image: <HiOutlineBuildingLibrary />,
          children: [
            {
              text: 'Facilities',
              path: '/dashboard/venues/facilities',
              image: <MdOutlineOtherHouses />,
            },
          ],
        },
        {
          text: 'Room Management',
          path: '/dashboard/rooms',
          image: <MdOutlineRoomPreferences />,
        },
        {
          text: 'Room Assignments',
          path: '/dashboard/rooms/assignments',
          image: <TbDoorExit />,
        },
        {
          text: 'Keys',
          path: '/dashboard/rooms/keys',
          image: <IoKeyOutline />,
        },
      ],
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
          
          {
            text:'Campuses',
            path:'/dashboard/churches/campuses',
            image:<RiSchoolLine />
          },
        ]
      },
      {
        title:'Ministries',
        isAdmin:false,
        icon:<PiCross />,
        children:[
          {
            text:'Manage Ministries',
            path:'/dashboard/ministries',
            image:<IoIosGitNetwork />
          },
          {
            text:'Manage Activities',
            path:'/dashboard/activities',
            image:<FiActivity/>
          },
          {
            text:'Cards',
            path:'/dashboard/activities/cards',
            image:<FaRegAddressCard />
          },

        ]
      },
      {
        title:'Contract Management',
        icon:<RiPoliceBadgeLine />,
        isAdmin:true,
        children:[
          {
            text:'Contracts',
            path:'/dashboard/churches/contracts',
            image:<PiSealCheck />
          },
          {
            text:'Services',
            path:'/dashboard/churches/contracts/services',
            image:<GrPowerCycle />
          },
        ]
      },
      {
          title: 'Revenue',
          isAdmin:false,
          icon: <MdAttachMoney />,
          link:'/dashboard/revenue'
      },
      {
          title: 'Announcements',
          isAdmin:false,
          icon: <HiOutlineMegaphone />,
          link:'/dashboard/announcements'
      },
]




export const CBarFilters = [
    'Age', 'Country', 'Church', 'Gender', 'Registered By',
]

export const CBarFiltersEvent = [
  'Age Range', 'Church', 'Gender'
]












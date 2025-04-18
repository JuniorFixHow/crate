
import React from "react"

import { RxDashboard } from 'react-icons/rx'
import { 
  // MdOutlineInbox, 
  MdOutlineMeetingRoom, MdEventAvailable, MdOutlineEvent, MdOutlineAdminPanelSettings, MdOutlineRoomPreferences, MdHistory, MdAttachMoney, MdOutlineOtherHouses, 
  MdOutlineHub} from "react-icons/md"
import { LuUserPlus, LuScanLine } from "react-icons/lu";
import { GrGroup, GrPowerCycle } from "react-icons/gr";
import {  NavigationProps,  } from "@/types/Types";
import { IoIosGitNetwork, IoIosTimer, IoMdGlobe } from "react-icons/io";
import { IoKeyOutline, IoLocationOutline } from "react-icons/io5";
import { TbBuildingChurch, TbCash, TbCirclesRelation, TbDoorExit, TbProgressCheck } from "react-icons/tb";
import { CiGlobe } from "react-icons/ci";
import { RiCalendarEventLine, RiMoneyDollarBoxLine, RiPoliceBadgeLine, RiSchoolLine } from "react-icons/ri";
import { PiAirplaneTakeoffLight, PiCross, PiSealCheck, PiUsersThreeThin } from "react-icons/pi";
import { HiOutlineBuildingLibrary, 
  // HiOutlineMegaphone
 } from "react-icons/hi2";
import { GoBriefcase } from "react-icons/go";
import { FiActivity, FiMusic } from "react-icons/fi";
import { FaRegAddressCard } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { LiaUserShieldSolid } from "react-icons/lia";
import { FaChildReaching } from "react-icons/fa6";





export const NavItems:NavigationProps[] = [
    {
        title:'Dashboard',
        isAdmin:false,
        icon: <RxDashboard />,
        link:'/dashboard'
    },
    // {
    //     title: 'Inbox',
    //     isAdmin:false,
    //     icon: <MdOutlineInbox/>,
    //     link:'/dashboard/inbox'
    // },
    {
        title: 'Members',
        isAdmin:true,
        icon: <LuUserPlus/>,
        // link:'/dashboard/members/register',
        children:[
          {
            text:'All Members',
            image:<HiOutlineUserGroup />,
            path:'/dashboard/members'
          },
          {
            text:'Event Registrations',
            image:<RiCalendarEventLine />,
            path:'/dashboard/members/register'
          },
          {
            text:'Relationships',
            image:<TbCirclesRelation />,
            path:'/dashboard/members/relationships'
          },
        ]
    },
    
    {
        title: 'Event Management',
        isAdmin:true,
        children:[
            {
                text:'Events',
                image:<MdOutlineEvent/>,
                path:'/dashboard/events'
            },
            {
                text:'Attendees',
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
        isAdmin:true,
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
        isAdmin:true,
        icon: <GrGroup/>,
        link:'/dashboard/groups'
    },
    {
      title: 'Venues/Rooms',
      isAdmin: true,
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
      isAdmin:true,
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
      isAdmin:true,
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
        {
          text:'Sessions',
          path:'/dashboard/ministries/sessions',
          image:<TbProgressCheck />
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
      title:'Hubs',
      icon:<MdOutlineHub />,
      isAdmin:true,
      children:[
        {
          text:`Children`,
          image:<FaChildReaching className="opacity-70" />,
          path:'/dashboard/events/children'
        },
        {
          text:'Music',
          path:'/dashboard/music',
          image:<FiMusic />
        },
        {
          text:'Travel',
          path:'/dashboard/travel',
          image:<PiAirplaneTakeoffLight />
        },
      ]
    },

    {
      title:'Revenue',
      icon:<RiMoneyDollarBoxLine />,
      isAdmin:true,
      children:[
        {
          text:'Payments',
          path:'/dashboard/revenue',
          image:<MdAttachMoney />
        },
        {
          text:'Expected Income',
          path:'/dashboard/income',
          image:<TbCash />
        },
      ]
    },
      
      // {
      //     title: 'Announcements',
      //     isAdmin:false,
      //     icon: <HiOutlineMegaphone />,
      //     link:'/dashboard/announcements'
      // },
]




export const CBarFilters = [
    'Age', 'Country', 'Church', 'Gender', 'Registered By',
]
export const CBarFiltersAdmin = [
    'Age', 'Country', 'Gender', 'Registered By',
]

export const CBarFiltersEvent = [
  'Age Range', 'Church', 'Gender'
]
export const CBarFiltersEventAdmin = [
  'Age Range',  'Gender'
]












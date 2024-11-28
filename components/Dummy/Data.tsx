
import React from "react"

import { RxDashboard } from 'react-icons/rx'
import { MdOutlineInbox, MdOutlineMeetingRoom, MdEventAvailable, MdOutlineEvent, MdOutlineAdminPanelSettings, MdOutlineRoomPreferences } from "react-icons/md"
import { LuUserPlus, LuScanLine } from "react-icons/lu";
import { GrGroup } from "react-icons/gr";
import { AttendanceProps, EventProps, EventRegProps, GroupProps, MemberProps, NavigationProps, SessionProps } from "@/types/Types";
import { IoIosTimer, IoMdGlobe } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { TbBuildingChurch } from "react-icons/tb";
import { LiaDoorOpenSolid } from "react-icons/lia";




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
        ],
        icon: <MdEventAvailable />,
    },
    {
        title: 'Vendors',
        isAdmin:false,
        icon: <MdOutlineAdminPanelSettings />,
        link:'/dashboard/vendors'
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
            image:<LiaDoorOpenSolid />
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
]


export const members: MemberProps[] = [
    {
        id: "1",
        photo: "https://picsum.photos/400/400?random=1",
        email: "john.doe@example.com",
        name: "John Doe",
        ageRange: "30-40",
        church: "Grace Community Church",
        registerType: "Individual",
        registeredBy: "2",
        dateOfReg: "2021-01-15",
        gender: "Male",
        country: "USA",
        groupId: "G1",
        status:'Member',
    },
    {
        id: "2",
        photo: "https://picsum.photos/400/400?random=1",
        email: "jane.smith@example.com",
        name: "Jane Smith",
        ageRange: "20-30",
        church: "Hope Church",
        registerType: "Family",
        registeredBy: "4",
        dateOfReg: "2022-03-22",
        gender: "Female",
        country: "Canada",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "3",
        photo: "https://picsum.photos/400/400?random=1",
        email: "alex.johnson@example.com",
        name: "Alex Johnson",
        ageRange: "40-50",
        church: "Faith Fellowship",
        registerType: "Group",
        registeredBy: "1",
        dateOfReg: "2020-07-10",
        gender: "Male",
        country: "UK",
        groupId: "G1",
        status:'Member',
    },
    {
        id: "4",
        photo: "https://picsum.photos/400/400?random=1",
        email: "mary.brown@example.com",
        name: "Mary Brown",
        ageRange: "30-40",
        church: "Unity Church",
        registerType: "Individual",
        registeredBy: "3",
        dateOfReg: "2021-05-30",
        gender: "Female",
        country: "Australia",
        groupId: "G3",
        status:'Member',
    },
    {
        id: "5",
        photo: "https://picsum.photos/400/400?random=1",
        email: "william.jones@example.com",
        name: "William Jones",
        ageRange: "25-35",
        church: "River Valley Church",
        registerType: "Family",
        registeredBy: "2",
        dateOfReg: "2023-09-12",
        gender: "Male",
        country: "USA",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "6",
        photo: "https://picsum.photos/400/400?random=1",
        email: "susan.clark@example.com",
        name: "Susan Clark",
        ageRange: "35-45",
        church: "New Beginnings Church",
        registerType: "Group",
        registeredBy: "2",
        dateOfReg: "2020-11-25",
        gender: "Female",
        country: "New Zealand",
        groupId: "G3",
        status:'Member',
    },
    {
        id: "7",
        photo: "https://picsum.photos/400/400?random=1",
        email: "david.miller@example.com",
        name: "David Miller",
        ageRange: "45-55",
        church: "Crossroads Church",
        registerType: "Individual",
        registeredBy: "User",
        dateOfReg: "2019-08-15",
        gender: "Male",
        country: "Ireland",
        groupId: "G1",
        status:'Member',
    },
    {
        id: "8",
        photo: "https://picsum.photos/400/400?random=1",
        email: "lisa.wilson@example.com",
        name: "Lisa Wilson",
        ageRange: "30-40",
        church: "Covenant Church",
        registerType: "Family",
        registeredBy: "Admin",
        dateOfReg: "2022-04-18",
        gender: "Female",
        country: "USA",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "9",
        photo: "https://picsum.photos/400/400?random=1",
        email: "james.moore@example.com",
        name: "James Moore",
        ageRange: "20-30",
        church: "Living Waters Church",
        registerType: "Group",
        registeredBy: "User",
        dateOfReg: "2023-01-05",
        gender: "Male",
        country: "Canada",
        groupId: "G1",
        status:'Member',
    },
    {
        id: "10",
        photo: "https://picsum.photos/400/400?random=1",
        email: "emily.jackson@example.com",
        name: "Emily Jackson",
        ageRange: "25-35",
        church: "Blessed Hope Church",
        registerType: "Individual",
        registeredBy: "Admin",
        dateOfReg: "2021-12-30",
        gender: "Female",
        country: "Australia",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "11",
        photo: "https://picsum.photos/400/400?random=1",
        email: "robert.white@example.com",
        name: "Robert White",
        ageRange: "30-40",
        church: "Grace Community Church",
        registerType: "Family",
        registeredBy: "User",
        dateOfReg: "2020-10-10",
        gender: "Male",
        country: "USA",
        groupId: "G1",
        status:'Member',
    },
    {
        id: "12",
        photo: "https://picsum.photos/400/400?random=1",
        email: "patricia.hall@example.com",
        name: "Patricia Hall",
        ageRange: "40-50",
        church: "Hope Church",
        registerType: "Group",
        registeredBy: "Admin",
        dateOfReg: "2022-02-15",
        gender: "Female",
        country: "Canada",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "13",
        photo: "https://picsum.photos/400/400?random=1",
        email: "michael.martinez@example.com",
        name: "Michael Martinez",
        ageRange: "35-45",
        church: "Faith Fellowship",
        registerType: "Individual",
        registeredBy: "User",
        dateOfReg: "2019-07-20",
        gender: "Male",
        country: "UK",
        groupId: "G3",
        status:'Member',
    },
    {
        id: "14",
        photo: "https://picsum.photos/400/400?random=1",
        email: "linda.thompson@example.com",
        name: "Linda Thompson",
        ageRange: "25-35",
        church: "Unity Church",
        registerType: "Family",
        registeredBy: "Admin",
        dateOfReg: "2023-03-30",
        gender: "Female",
        country: "Australia",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "15",
        photo: "https://picsum.photos/400/400?random=1",
        email: "chris.garcia@example.com",
        name: "Chris Garcia",
        ageRange: "20-30",
        church: "River Valley Church",
        registerType: "Group",
        registeredBy: "User",
        dateOfReg: "2022-05-05",
        gender: "Male",
        country: "USA",
        groupId: "G3",
        status:'Member',
    },
    {
        id: "16",
        photo: "https://picsum.photos/400/400?random=1",
        email: "jessica.rodriguez@example.com",
        name: "Jessica Rodriguez",
        ageRange: "30-40",
        church: "New Beginnings Church",
        registerType: "Individual",
        registeredBy: "Admin",
        dateOfReg: "2021-12-12",
        gender: "Female",
        country: "New Zealand",
        groupId: "G1",
        status:'Member',
    },
    {
        id: "17",
        photo: "https://picsum.photos/400/400?random=1",
        email: "kevin.lewis@example.com",
        name: "Kevin Lewis",
        ageRange: "45-55",
        church: "Crossroads Church",
        registerType: "Family",
        registeredBy: "User",
        dateOfReg: "2018-08-08",
        gender: "Male",
        country: "Ireland",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "18",
        photo: "https://picsum.photos/400/400?random=1",
        email: "sarah.walker@example.com",
        name: "Sarah Walker",
        ageRange: "35-45",
        church: "Covenant Church",
        registerType: "Group",
        registeredBy: "Admin",
        dateOfReg: "2023-06-01",
        gender: "Female",
        country: "USA",
        groupId: "G1",
        status:'Member',
    },
    {
        id: "19",
        photo: "https://picsum.photos/400/400?random=1",
        email: "daniel.hall@example.com",
        name: "Daniel Hall",
        ageRange: "30-40",
        church: "Living Waters Church",
        registerType: "Individual",
        registeredBy: "User",
        dateOfReg: "2020-01-29",
        gender: "Male",
        country: "Canada",
        groupId: "G3",
        status:'Member',
    },
    {
        id: "20",
        photo: "https://picsum.photos/400/400?random=1",
        email: "monica.young@example.com",
        name: "Monica Young",
        ageRange: "25-35",
        church: "Blessed Hope Church",
        registerType: "Family",
        registeredBy: "Admin",
        dateOfReg: "2022-11-10",
        gender: "Female",
        country: "Australia",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "21",
        photo: "https://picsum.photos/400/400?random=1",
        email: "joseph.green@example.com",
        name: "Joseph Green",
        ageRange: "40-50",
        church: "Grace Community Church",
        registerType: "Group",
        registeredBy: "Admin",
        dateOfReg: "2019-04-22",
        gender: "Male",
        country: "USA",
        groupId: "G1",
        status:'Member',
    },
    {
        id: "22",
        photo: "https://picsum.photos/400/400?random=1",
        email: "laura.harris@example.com",
        name: "Laura Harris",
        ageRange: "35-45",
        church: "Hope Church",
        registerType: "Individual",
        registeredBy: "User",
        dateOfReg: "2021-07-15",
        gender: "Female",
        country: "Canada",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "23",
        photo: "https://picsum.photos/400/400?random=1",
        email: "steven.clark@example.com",
        name: "Steven Clark",
        ageRange: "25-35",
        church: "Faith Fellowship",
        registerType: "Family",
        registeredBy: "Admin",
        dateOfReg: "2022-10-01",
        gender: "Male",
        country: "UK",
        groupId: "G3",
        status:'Member',
    },
    {
        id: "24",
        photo: "https://picsum.photos/400/400?random=1",
        email: "karen.miller@example.com",
        name: "Karen Miller",
        ageRange: "30-40",
        church: "Unity Church",
        registerType: "Group",
        registeredBy: "User",
        dateOfReg: "2023-05-20",
        gender: "Female",
        country: "Australia",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "25",
        photo: "https://picsum.photos/400/400?random=1",
        email: "mark.jones@example.com",
        name: "Mark Jones",
        ageRange: "30-40",
        church: "River Valley Church",
        registerType: "Individual",
        registeredBy: "Admin",
        dateOfReg: "2020-09-15",
        gender: "Male",
        country: "USA",
        groupId: "G1",
        status:'Member',
    },
    {
        id: "26",
        photo: "https://picsum.photos/400/400?random=1",
        email: "rita.brown@example.com",
        name: "Rita Brown",
        ageRange: "20-30",
        church: "New Beginnings Church",
        registerType: "Family",
        registeredBy: "User",
        dateOfReg: "2021-03-03",
        gender: "Female",
        country: "New Zealand",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "27",
        photo: "https://picsum.photos/400/400?random=1",
        email: "paul.taylor@example.com",
        name: "Paul Taylor",
        ageRange: "45-55",
        church: "Crossroads Church",
        registerType: "Group",
        registeredBy: "Admin",
        dateOfReg: "2018-12-18",
        gender: "Male",
        country: "Ireland",
        groupId: "G1",
        status:'Member',
    },
    {
        id: "28",
        photo: "https://picsum.photos/400/400?random=1",
        email: "natalie.davis@example.com",
        name: "Natalie Davis",
        ageRange: "35-45",
        church: "Covenant Church",
        registerType: "Individual",
        registeredBy: "User",
        dateOfReg: "2023-07-25",
        gender: "Female",
        country: "USA",
        groupId: "G3",
        status:'Member',
    },
    {
        id: "29",
        photo: "https://picsum.photos/400/400?random=1",
        email: "lucas.martinez@example.com",
        name: "Lucas Martinez",
        ageRange: "30-40",
        church: "Living Waters Church",
        registerType: "Family",
        registeredBy: "Admin",
        dateOfReg: "2021-11-11",
        gender: "Male",
        country: "Canada",
        groupId: "G2",
        status:'Member',
    },
    {
        id: "30",
        photo: "https://picsum.photos/400/400?random=1",
        email: "sophia.wilson@example.com",
        name: "Sophia Wilson",
        ageRange: "25-35",
        church: "Blessed Hope Church",
        registerType: "Group",
        registeredBy: "User",
        dateOfReg: "2022-08-26",
        gender: "Female",
        country: "Australia",
        groupId: "G1",
        status:'Member',
    }
];


export const CBarFilters = [
    'Age', 'Country', 'Church', 'Gender', 'Registered By', 'Registration Type' 
]

export const Groups: GroupProps[] = [
    {
      name: "Smith Family",
      type: "Family",
      members: ["1", "2", "3", "4"],
      id:'77'
    },
    {
      name: "Book Club",
      type: "Group",
      members: ["5", "6", "7", "8", "9"],
      id:'80'
    },
    {
      name: "Johnson Family",
      type: "Family",
      members: ["10", "11", "12"],
      id:'31'
    },
    {
      name: "Fitness Team",
      type: "Group",
      members: ["13", "14", "15", "16"],
      id:'94'
    },
    {
      name: "Brown Family",
      type: "Family",
      members: ["17", "18", "19", "20"],
      id:'47'
    },
    {
      name: "Photography Group",
      type: "Group",
      members: ["21", "22", "23"],
      id:'6'
    },
    {
      name: "Garcia Family",
      type: "Family",
      members: ["24", "25"],
      id:'93'
    },
    {
      name: "Cooking Crew",
      type: "Group",
      members: ["26", "27", "28"],
      id:'49'
    },
    {
      name: "Lee Family",
      type: "Family",
      members: ["29"],
      id:'91'
    },
    {
      name: "Travel Enthusiasts",
      type: "Group",
      members: ["30"],
      id:'64'
    }
  ];

export const EventsData:EventProps[] = [
    {
      id: "1",
      name: "Summer Camp 2024",
      location: "Lakeview Park",
      from: "2024-06-01",
      to: "2024-06-15",
      type: "Camp Meeting",
      description: "A fun-filled summer camp for all ages.",
      adultPrice: 200,
      childPrice: 100,
      createdBy: "Alice Johnson",
      sessions:3
    },
    {
      id: "2",
      name: "Annual Convention 2024",
      location: "Downtown Conference Center",
      from: "2024-09-10",
      to: "2024-09-12",
      type: "Convension",
      description: "Networking and workshops for professionals.",
      adultPrice: 350,
      childPrice: 0,
      createdBy: "Bob Smith",
      sessions:19
    },
    {
      id: "3",
      name: "Youth CYP Retreat",
      location: "Mountain Lodge",
      from: "2024-07-20",
      to: "2024-07-25",
      type: "CYP",
      description: "A retreat designed for youth empowerment.",
      adultPrice: 150,
      childPrice: 75,
      createdBy: "Charlie Brown",
      sessions:15
    },
    {
      id: "4",
      name: "Family Camp Weekend",
      location: "Sunny Meadows",
      from: "2024-08-15",
      to: "2024-08-18",
      type: "Camp Meeting",
      description: "A weekend of family activities and bonding.",
      adultPrice: 180,
      childPrice: 90,
      createdBy: "Diana Prince",
      sessions:8
    },
    {
      id: "5",
      name: "Tech Convention 2024",
      location: "Tech City Arena",
      from: "2024-11-01",
      to: "2024-11-03",
      type: "Convension",
      description: "The latest in technology and innovation.",
      adultPrice: 400,
      childPrice: 0,
      createdBy: "Ethan Hunt",
      sessions:13
    },
    {
      id: "6",
      name: "CYP Leadership Summit",
      location: "Seaside Resort",
      from: "2024-10-10",
      to: "2024-10-12",
      type: "CYP",
      description: "A summit for future leaders.",
      adultPrice: 250,
      childPrice: 125,
      createdBy: "Fiona Green",
      sessions:29
    },
    {
      id: "7",
      name: "Spring Camp 2024",
      location: "Green Valley",
      from: "2024-04-05",
      to: "2024-04-12",
      type: "Camp Meeting",
      description: "Spring activities for all ages.",
      adultPrice: 220,
      childPrice: 110,
      createdBy: "George White",
      sessions:14
    },
    {
      id: "8",
      name: "Global Health Convention",
      location: "City Hall",
      from: "2024-05-15",
      to: "2024-05-17",
      type: "Convension",
      description: "Discussing global health challenges.",
      adultPrice: 300,
      childPrice: 0,
      createdBy: "Hannah Lee",
      sessions:24
    },
    {
      id: "9",
      name: "CYP Empowerment Workshop",
      location: "Community Center",
      from: "2024-03-20",
      to: "2024-03-22",
      type: "CYP",
      description: "Workshops to empower youth.",
      adultPrice: 100,
      childPrice: 50,
      createdBy: "Isaac Newton",
      sessions:13
    },
    {
      id: "10",
      name: "Adventure Camp",
      location: "Adventure Park",
      from: "2024-07-01",
      to: "2024-07-10",
      type: "Camp Meeting",
      description: "Adventure and outdoor activities.",
      adultPrice: 250,
      childPrice: 125,
      createdBy: "Jessica Alba",
      sessions:5
    },
    {
      id: "11",
      name: "Annual Business Convention",
      location: "Business District",
      from: "2024-08-10",
      to: "2024-08-12",
      type: "Convension",
      description: "A convention for business networking.",
      adultPrice: 500,
      childPrice: 0,
      createdBy: "Kevin Bacon",
      sessions:5
    },
    {
      id: "12",
      name: "CYP Creative Arts Festival",
      location: "Cultural Center",
      from: "2024-06-22",
      to: "2024-06-24",
      type: "CYP",
      description: "Showcasing youth creativity.",
      adultPrice: 120,
      childPrice: 60,
      createdBy: "Laura Croft",
      sessions:5
    },
    {
      id: "13",
      name: "Winter Camp Retreat",
      location: "Snowy Mountains",
      from: "2024-12-01",
      to: "2024-12-10",
      type: "Camp Meeting",
      description: "A winter wonderland experience.",
      adultPrice: 230,
      childPrice: 115,
      createdBy: "Mark Twain",
      sessions:8
    },
    {
      id: "14",
      name: "Global Trade Convention",
      location: "Convention Center",
      from: "2024-09-05",
      to: "2024-09-07",
      type: "Convension",
      description: "Discussing global trade issues.",
      adultPrice: 450,
      childPrice: 0,
      createdBy: "Nina Simone",
      sessions:8
    },
    {
      id: "15",
      name: "CYP Sports Day",
      location: "Local Stadium",
      from: "2024-05-30",
      to: "2024-05-30",
      type: "CYP",
      description: "A day of sports and fun.",
      adultPrice: 80,
      childPrice: 40,
      createdBy: "Oscar Wilde",
      sessions:20
    },
    {
      id: "16",
      name: "Nature Camp",
      location: "Forest Retreat",
      from: "2024-07-15",
      to: "2024-07-25",
      type: "Camp Meeting",
      description: "Experience nature and wildlife.",
      adultPrice: 210,
      childPrice: 105,
      createdBy: "Paula Abdul",
      sessions:15
    },
    {
      id: "17",
      name: "Health & Wellness Convention",
      location: "Wellness Center",
      from: "2024-10-05",
      to: "2024-10-07",
      type: "Convension",
      description: "Focus on health and wellness topics.",
      adultPrice: 320,
      childPrice: 0,
      createdBy: "Quincy Jones",
      sessions:2
    },
    {
      id: "18",
      name: "CYP Innovation Challenge",
      location: "Innovation Hub",
      from: "2024-03-15",
      to: "2024-03-17",
      type: "CYP",
      description: "Challenge to innovate and create.",
      adultPrice: 130,
      childPrice: 65,
      createdBy: "Rita Hayworth",
      sessions:26
    },
    {
      id: "19",
      name: "Beach Camp",
      location: "Oceanfront",
      from: "2024-08-01",
      to: "2024-08-10",
      type: "Camp Meeting",
      description: "Enjoy the sun and surf.",
      adultPrice: 240,
      childPrice: 120,
      createdBy: "Steve Jobs",
      sessions:16
    },
    {
      id: "20",
      name: "Educational Convention 2024",
      location: "Learning Center",
      from: "2024-11-10",
      to: "2024-11-12",
      type: "Convension",
      description: "Focus on education and learning.",
      adultPrice: 400,
      childPrice: 0,
      createdBy: "Tina Fey",
      sessions:2
    },
    {
      id: "21",
      name: "CYP Volunteer Day",
      location: "Community Park",
      from: "2024-04-15",
      to: "2024-04-15",
      type: "CYP",
      description: "A day of giving back to the community.",
      adultPrice: 50,
      childPrice: 25,
      createdBy: "Ursula K. Le Guin",
      sessions:9
    },
    {
      id: "22",
      name: "Cultural Camp",
      location: "Cultural Village",
      from: "2024-08-20",
      to: "2024-08-25",
      type: "Camp Meeting",
      description: "Explore different cultures.",
      adultPrice: 200,
      childPrice: 100,
      createdBy: "Victor Hugo",
      sessions:21
    },
    {
      id: "23",
      name: "Annual Science Convention",
      location: "Science Hall",
      from: "2024-09-15",
      to: "2024-09-17",
      type: "Convension",
      description: "Latest trends in science.",
      adultPrice: 370,
      childPrice: 0,
      createdBy: "Walt Disney",
      sessions:4
    },
    {
      id: "24",
      name: "CYP Mentorship Program",
      location: "Youth Center",
      from: "2024-05-10",
      to: "2024-05-12",
      type: "CYP",
      description: "Mentorship for youth in different fields.",
      adultPrice: 110,
      childPrice: 55,
      createdBy: "Xena Warrior",
      sessions:24
    },
    {
      id: "25",
      name: "Outdoor Adventure Camp",
      location: "Explorer Base",
      from: "2024-06-10",
      to: "2024-06-20",
      type: "Camp Meeting",
      description: "Adventure activities in the great outdoors.",
      adultPrice: 260,
      childPrice: 130,
      createdBy: "Yasmin Bleeth",
      sessions:27
    },
    {
      id: "26",
      name: "Digital Marketing Convention",
      location: "Marketing Hall",
      from: "2024-10-15",
      to: "2024-10-17",
      type: "Convension",
      description: "Trends in digital marketing.",
      adultPrice: 380,
      childPrice: 0,
      createdBy: "Zelda Fitzgerald",
      sessions:26
    },
    {
      id: "27",
      name: "CYP Health Awareness Day",
      location: "Health Center",
      from: "2024-04-25",
      to: "2024-04-25",
      type: "CYP",
      description: "Promoting health awareness among youth.",
      adultPrice: 60,
      childPrice: 30,
      createdBy: "Albert Einstein",
      sessions:23
    },
    {
      id: "28",
      name: "Adventure Sports Camp",
      location: "Extreme Sports Park",
      from: "2024-05-01",
      to: "2024-05-05",
      type: "Camp Meeting",
      description: "Thrilling sports and activities.",
      adultPrice: 300,
      childPrice: 150,
      createdBy: "Beethoven",
      sessions:24
    },
    {
      id: "29",
      name: "Marketing Strategies Convention",
      location: "Business Expo",
      from: "2024-07-10",
      to: "2024-07-12",
      type: "Convension",
      description: "Strategies for effective marketing.",
      adultPrice: 420,
      childPrice: 0,
      createdBy: "Chopin",
      sessions:17
    },
    {
      id: "30",
      name: "CYP Robotics Challenge",
      location: "Tech Center",
      from: "2024-10-01",
      to: "2024-10-03",
      type: "CYP",
      description: "A challenge in robotics for youth.",
      adultPrice: 140,
      childPrice: 70,
      createdBy: "Dante Alighieri",
      sessions:15
    },
    {
      id: "31",
      name: "Family Reunion Camp",
      location: "Heritage Park",
      from: "2024-06-05",
      to: "2024-06-12",
      type: "Camp Meeting",
      description: "A reunion for families to connect.",
      adultPrice: 190,
      childPrice: 95,
      createdBy: "Edgar Allan Poe",
      sessions:21
    },
    {
      id: "32",
      name: "Entrepreneurship Convention",
      location: "Startup Hub",
      from: "2024-11-20",
      to: "2024-11-22",
      type: "Convension",
      description: "For aspiring entrepreneurs.",
      adultPrice: 450,
      childPrice: 0,
      createdBy: "Frank Sinatra",
      sessions:2
    },
    {
      id: "33",
      name: "CYP Environmental Awareness",
      location: "Green Space",
      from: "2024-03-30",
      to: "2024-03-30",
      type: "CYP",
      description: "Promoting environmental awareness among youth.",
      adultPrice: 70,
      childPrice: 35,
      createdBy: "Gandhi",
      sessions:25
    },
    {
      id: "34",
      name: "Culinary Camp",
      location: "Culinary School",
      from: "2024-07-10",
      to: "2024-07-15",
      type: "Camp Meeting",
      description: "Exploring cooking and culinary arts.",
      adultPrice: 230,
      childPrice: 115,
      createdBy: "Homer Simpson",
      sessions:6
    },
    {
      id: "35",
      name: "CYP Innovation Expo",
      location: "Expo Center",
      from: "2024-12-05",
      to: "2024-12-07",
      type: "CYP",
      description: "An expo showcasing youth innovations.",
      adultPrice: 160,
      childPrice: 80,
      createdBy: "Ivy League",
      sessions:3
    },
  ];

export const EventRegistrations: EventRegProps[] = [
    {
      id: "1",
      memberId: "1",
      regType: "Individual",
      status: "Pending",
      badgeIssued: 'No'
    },
    {
      id: "2",
      memberId: "2",
      regType: "Group",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "1"
    },
    {
      id: "3",
      memberId: "3",
      regType: "Family",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "2"
    },
    {
      id: "4",
      memberId: "4",
      regType: "Individual",
      status: "Checked-in",
      badgeIssued: 'Yes'
    },
    {
      id: "5",
      memberId: "5",
      regType: "Group",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "3"
    },
    {
      id: "6",
      memberId: "6",
      regType: "Family",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "4"
    },
    {
      id: "7",
      memberId: "7",
      regType: "Individual",
      status: "Pending",
      badgeIssued: 'No'
    },
    {
      id: "8",
      memberId: "8",
      regType: "Group",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "1"
    },
    {
      id: "9",
      memberId: "9",
      regType: "Family",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "5"
    },
    {
      id: "10",
      memberId: "10",
      regType: "Individual",
      status: "Checked-in",
      badgeIssued: 'Yes'
    },
    {
      id: "11",
      memberId: "11",
      regType: "Group",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "2"
    },
    {
      id: "12",
      memberId: "12",
      regType: "Family",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "6"
    },
    {
      id: "13",
      memberId: "13",
      regType: "Individual",
      status: "Pending",
      badgeIssued: 'No'
    },
    {
      id: "14",
      memberId: "14",
      regType: "Group",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "3"
    },
    {
      id: "15",
      memberId: "15",
      regType: "Family",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "7"
    },
    {
      id: "16",
      memberId: "16",
      regType: "Individual",
      status: "Checked-in",
      badgeIssued: 'Yes'
    },
    {
      id: "17",
      memberId: "17",
      regType: "Group",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "4"
    },
    {
      id: "18",
      memberId: "18",
      regType: "Family",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "8"
    },
    {
      id: "19",
      memberId: "19",
      regType: "Individual",
      status: "Pending",
      badgeIssued: 'No'
    },
    {
      id: "20",
      memberId: "20",
      regType: "Group",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "5"
    },
    {
      id: "21",
      memberId: "21",
      regType: "Family",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "9"
    },
    {
      id: "22",
      memberId: "22",
      regType: "Individual",
      status: "Checked-in",
      badgeIssued: 'Yes'
    },
    {
      id: "23",
      memberId: "23",
      regType: "Group",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "6"
    },
    {
      id: "24",
      memberId: "24",
      regType: "Family",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "10"
    },
    {
      id: "25",
      memberId: "25",
      regType: "Individual",
      status: "Pending",
      badgeIssued: 'No'
    },
    {
      id: "26",
      memberId: "26",
      regType: "Group",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "7"
    },
    {
      id: "27",
      memberId: "27",
      regType: "Family",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "11"
    },
    {
      id: "28",
      memberId: "28",
      regType: "Individual",
      status: "Checked-in",
      badgeIssued: 'Yes'
    },
    {
      id: "29",
      memberId: "29",
      regType: "Group",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "8"
    },
    {
      id: "30",
      memberId: "30",
      regType: "Family",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "12"
    },
    {
      id: "31",
      memberId: "31",
      regType: "Individual",
      status: "Pending",
      badgeIssued: 'No'
    },
    {
      id: "32",
      memberId: "32",
      regType: "Group",
      status: "Checked-in",
      badgeIssued: 'Yes',
      groupId: "9"
    },
    {
      id: "33",
      memberId: "33",
      regType: "Family",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "13"
    },
    {
      id: "34",
      memberId: "34",
      regType: "Individual",
      status: "Checked-in",
      badgeIssued: 'Yes'
    },
    {
      id: "35",
      memberId: "35",
      regType: "Group",
      status: "Pending",
      badgeIssued: 'No',
      groupId: "10"
    },
  ];



export const SessionsData: SessionProps[] = [
  {
      id: '1',
      name: 'Morning Yoga',
      venue: 'Community Center',
      from: '2023-11-01',
      to: '2023-11-01',
      startTime: '07:00',
      endTime: '08:00',
      time: 'Morning',
      status: 'Ongoing',
      eventId: 'event1',
      createdBy: 'user1'
  },
  {
      id: '2',
      name: 'Afternoon Workshop',
      venue: 'City Hall',
      from: '2023-11-01',
      to: '2023-11-01',
      startTime: '13:00',
      endTime: '15:00',
      time: 'Afternoon',
      status: 'Completed',
      eventId: 'event2',
      createdBy: 'user2'
  },
  {
      id: '3',
      name: 'Evening Concert',
      venue: 'Downtown Park',
      from: '2023-11-01',
      to: '2023-11-01',
      startTime: '18:00',
      endTime: '20:00',
      time: 'Evening',
      status: 'Completed',
      eventId: 'event3',
      createdBy: 'user3'
  },
  {
      id: '4',
      name: 'Dawn Meditation',
      venue: 'Beachfront',
      from: '2023-11-02',
      to: '2023-11-02',
      startTime: '05:00',
      endTime: '06:00',
      time: 'Dawn',
      status: 'Ongoing',
      eventId: 'event4',
      createdBy: 'user4'
  },
  {
      id: '5',
      name: 'Morning Running Club',
      venue: 'City Park',
      from: '2023-11-02',
      to: '2023-11-02',
      startTime: '06:30',
      endTime: '07:30',
      time: 'Morning',
      status: 'Completed',
      eventId: 'event5',
      createdBy: 'user5'
  },
  {
      id: '6',
      name: 'Afternoon Book Club',
      venue: 'Library Room A',
      from: '2023-11-02',
      to: '2023-11-02',
      startTime: '14:00',
      endTime: '15:30',
      time: 'Afternoon',
      status: 'Ongoing',
      eventId: 'event6',
      createdBy: 'user6'
  },
  {
      id: '7',
      name: 'Evening Art Exhibition',
      venue: 'Art Gallery',
      from: '2023-11-02',
      to: '2023-11-02',
      startTime: '17:00',
      endTime: '19:00',
      time: 'Evening',
      status: 'Completed',
      eventId: 'event7',
      createdBy: 'user7'
  },
  {
      id: '8',
      name: 'Dawn Cycling',
      venue: 'Riverside Path',
      from: '2023-11-03',
      to: '2023-11-03',
      startTime: '05:30',
      endTime: '07:00',
      time: 'Dawn',
      status: 'Ongoing',
      eventId: 'event8',
      createdBy: 'user8'
  },
  {
      id: '9',
      name: 'Morning Coffee Meetup',
      venue: 'Coffee Shop',
      from: '2023-11-03',
      to: '2023-11-03',
      startTime: '09:00',
      endTime: '10:00',
      time: 'Morning',
      status: 'Upcoming',
      eventId: 'event9',
      createdBy: 'user9'
  },
  {
      id: '10',
      name: 'Afternoon Tech Talk',
      venue: 'Tech Hub',
      from: '2023-11-03',
      to: '2023-11-03',
      startTime: '15:00',
      endTime: '16:30',
      time: 'Afternoon',
      status: 'Ongoing',
      eventId: 'event10',
      createdBy: 'user10'
  },
  {
      id: '11',
      name: 'Evening Family Dinner',
      venue: 'Restaurant',
      from: '2023-11-03',
      to: '2023-11-03',
      startTime: '19:00',
      endTime: '21:00',
      time: 'Evening',
      status: 'Upcoming',
      eventId: 'event11',
      createdBy: 'user11'
  },
  {
      id: '12',
      name: 'Dawn Nature Walk',
      venue: 'Nature Reserve',
      from: '2023-11-04',
      to: '2023-11-04',
      startTime: '06:00',
      endTime: '07:30',
      time: 'Dawn',
      status: 'Ongoing',
      eventId: 'event12',
      createdBy: 'user12'
  },
  {
      id: '13',
      name: 'Morning Fitness Class',
      venue: 'Gym Studio',
      from: '2023-11-04',
      to: '2023-11-04',
      startTime: '08:00',
      endTime: '09:00',
      time: 'Morning',
      status: 'Completed',
      eventId: 'event13',
      createdBy: 'user13'
  },
  {
      id: '14',
      name: 'Afternoon Gardening Workshop',
      venue: 'Community Garden',
      from: '2023-11-04',
      to: '2023-11-04',
      startTime: '14:30',
      endTime: '16:00',
      time: 'Afternoon',
      status: 'Upcoming',
      eventId: 'event14',
      createdBy: 'user14'
  },
  {
      id: '15',
      name: 'Evening Movie Night',
      venue: 'Local Theater',
      from: '2023-11-04',
      to: '2023-11-04',
      startTime: '20:00',
      endTime: '22:00',
      time: 'Evening',
      status: 'Completed',
      eventId: 'event15',
      createdBy: 'user15'
  },
  {
      id: '16',
      name: 'Dawn Photography Meetup',
      venue: 'Scenic Overlook',
      from: '2023-11-05',
      to: '2023-11-05',
      startTime: '05:45',
      endTime: '07:15',
      time: 'Dawn',
      status: 'Ongoing',
      eventId: 'event16',
      createdBy: 'user16'
  },
  {
      id: '17',
      name: 'Morning Cooking Class',
      venue: 'Culinary School',
      from: '2023-11-05',
      to: '2023-11-05',
      startTime: '10:00',
      endTime: '12:00',
      time: 'Morning',
      status: 'Completed',
      eventId: 'event17',
      createdBy: 'user17'
  },
  {
      id: '18',
      name: 'Afternoon Dance Party',
      venue: 'Dance Studio',
      from: '2023-11-05',
      to: '2023-11-05',
      startTime: '16:00',
      endTime: '18:00',
      time: 'Afternoon',
      status: 'Ongoing',
      eventId: 'event18',
      createdBy: 'user18'
  },
  {
      id: '19',
      name: 'Evening Networking Event',
      venue: 'Conference Center',
      from: '2023-11-05',
      to: '2023-11-05',
      startTime: '19:30',
      endTime: '21:30',
      time: 'Evening',
      status: 'Completed',
      eventId: 'event19',
      createdBy: 'user19'
  },
  {
      id: '20',
      name: 'Dawn Run',
      venue: 'City Trail',
      from: '2023-11-06',
      to: '2023-11-06',
      startTime: '06:15',
      endTime: '07:45',
      time: 'Dawn',
      status: 'Ongoing',
      eventId: 'event20',
      createdBy: 'user20'
  }
];


export const AttendanceData:AttendanceProps[]= [
  { 
      id: '1', 
      member: 'Alice Smith', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '2', 
      member: 'Bob Johnson', 
      late: 'Yes', 
      time: '2023-10-01T09:15:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '3', 
      member: 'Charlie Brown', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '4', 
      member: 'Diana Prince', 
      late: 'No', 
      time: '2023-10-01T09:05:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '5', 
      member: 'Ethan Hunt', 
      late: 'Yes', 
      time: '2023-10-01T09:20:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '6', 
      member: 'Fiona Gallagher', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '7', 
      member: 'George Martin', 
      late: 'Yes', 
      time: '2023-10-01T09:10:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '8', 
      member: 'Hannah Baker', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '9', 
      member: 'Ian Malcolm', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '10', 
      member: 'Jane Doe', 
      late: 'Yes', 
      time: '2023-10-01T09:25:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '11', 
      member: 'Kevin Spacey', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '12', 
      member: 'Laura Croft', 
      late: 'No', 
      time: '2023-10-01T09:05:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '13', 
      member: 'Mark Twain', 
      late: 'Yes', 
      time: '2023-10-01T09:30:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '14', 
      member: 'Nina Simone', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '15', 
      member: 'Oscar Wilde', 
      late: 'Yes', 
      time: '2023-10-01T09:20:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '16', 
      member: 'Pablo Picasso', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '17', 
      member: 'Quincy Adams', 
      late: 'No', 
      time: '2023-10-01T09:05:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '18', 
      member: 'Rita Hayworth', 
      late: 'Yes', 
      time: '2023-10-01T09:35:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '19', 
      member: 'Sam Spade', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '20', 
      member: 'Tina Turner', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '21', 
      member: 'Ursula K. Le Guin', 
      late: 'Yes', 
      time: '2023-10-01T09:40:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '22', 
      member: 'Victor Hugo', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '23', 
      member: 'Winston Churchill', 
      late: 'No', 
      time: '2023-10-01T09:05:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '24', 
      member: 'Xena Warrior', 
      late: 'Yes', 
      time: '2023-10-01T09:45:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '25', 
      member: 'Yoko Ono', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '26', 
      member: 'Zach Galifianakis', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '27', 
      member: 'Albus Dumbledore', 
      late: 'Yes', 
      time: '2023-10-01T09:50:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '28', 
      member: 'Bella Swan', 
      late: 'No', 
      time: '2023-10-01T09:00:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '29', 
      member: 'Cinderella', 
      late: 'No', 
      time: '2023-10-01T09:05:00Z', 
      sessionId: 'session1' 
  },
  { 
      id: '30', 
      member: 'Darth Vader', 
      late: 'Yes', 
      time: '2023-10-01T09:55:00Z', 
      sessionId: 'session1' 
  }
]
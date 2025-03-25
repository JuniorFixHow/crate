'use client';

import { NavItems } from '@/components/Dummy/Data';
import { NavigationProps } from '@/types/Types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import Link from 'next/link';
import NavSwitch from '@/components/features/NavSwitch';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { usePathname, useRouter } from 'next/navigation';
import { deleteSession, } from '@/lib/session';
import { IVendor } from '@/lib/database/models/vendor.model';
import { useAuth } from '@/hooks/useAuth';
import { getVendor } from '@/lib/actions/vendor.action';
import '@/components/features/customscroll.css';
import { canAccessNavItem } from '@/functions/misc';


type TitleProps = {
  parent: string;
  child?: string;
  grandchild?: string;
};;

const Navbar = () => {
  const [currentTtitle, setCurrentTitle] = useState<TitleProps>({
    parent: 'Dashboard',
    child: '',
  });

  const [collapse, setCollapse] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<IVendor | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const res = await getVendor(user?.userId);
          setCurrentUser(res);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleParentClick = (item: NavigationProps) => {
    if (!item.children) {
      router.push(item.link!);
      setCurrentTitle({ parent: item.title });
      setCollapse(false);
    } else if (collapse && currentTtitle.parent === item.title) {
      setCollapse(false);
    } else {
      setCurrentTitle({ parent: item.title });

      if (item?.children?.length) {
        setCollapse(true);
      }
    }
  };

  const handleClickChild = (text: string, link: string) => {
    setCurrentTitle((prev) => ({ ...prev, child: text }));
    router.push(link);
  };
  

  useEffect(() => {
    NavItems.forEach((item) => {
      if (item?.link) {
        if (path === item.link || path?.startsWith(`${item.link}/`)) {
          setCurrentTitle({ parent: item.title });
        }
      } else {
        item.children?.forEach((child) => {
          if (path === child.path || path?.startsWith(`${child.path}/`)) {
            setCurrentTitle({ parent: item.title, child: child.text });
            setCollapse(true);
          }else{
            child?.children?.forEach((gchild)=>{
              if(path === gchild.path || path.startsWith(`${gchild.path}/`)){
                setCurrentTitle({parent:item.title, child:child.text, grandchild:gchild.text})
              }
            })
          }
        });
      }
    });
  }, [path]);


  
  


  const handleProfile = () => {
    setCurrentTitle({ parent: 'Account & Settings' });
    router.push('/dashboard/profile');
  };
  // alert(path)

  if(!user) return;

  const renderChildren = (children: NavigationProps['children']) => {
    return children?.map((child) => (
      <div key={child.text} className="ml-4 flex flex-col">
        <div
          onClick={() => handleClickChild(child.text, child.path)}
          className={`flex items-center flex-row dark:hover:text-[#3C60CA] hover:text-[#3C60CA] cursor-pointer gap-2 ${
            currentTtitle.child === child.text ? 'text-[#3C60CA]' : 'text-black dark:text-white'
          }`}
        >
          {child.image}
          <span className="text-[0.9rem] font-normal">{child.text}</span>
        </div>
        {child.children && renderChildren(child.children)}
      </div>
    ));
  };
  

  return (
    <div
      className={`flex xl:p-4 z-20 min-h-screen absolute xl:relative dark:border-r border-slate-200  lg:flex flex-col gap-6 ${
        toggle ? 'pt-4' : 'p-4'
      } bg-white dark:bg-[#0F1214] shadow-xl rounded-lg scrollbar-custom`}
    >
      <div className="flex flex-col gap-6 relative h-fit">
        <div className="flex flex-row items-center w-full justify-between">
          <Link
            href="/dashboard"
            className={`${
              toggle ? 'hidden' : 'flex'
            } xl:flex flex-col cursor-pointer`}
          >
            <Image src="/Logo.png" alt="logo" width={100} height={10} />
            <span className="text-xs text-[#949191] font-medium">
              {typeof currentUser?.church === 'object' &&
                'name' in currentUser?.church &&
                currentUser?.church?.name}
            </span>
          </Link>
          <NavSwitch value={toggle} setValue={setToggle} />
        </div>

        <div
          className={`flex ${toggle ? 'hidden' : 'flex'} xl:flex flex-col grow justify-between gap-6`}
        >
          <div className={`${toggle ? 'hidden' : 'flex'} xl:flex flex-col gap-6`}>
            {
              // (user?.roles?.length as number) > 0  &&
              <div className="flex flex-col gap-3 w-max">
                <span className="text-[1rem] text-[#949191] font-medium">Menu</span>
                {NavItems
                .filter((item) => canAccessNavItem(item, user))
                .map((item: NavigationProps) => (
                  <div key={item.title} className="flex flex-col gap-2">
                    <div
                      onClick={() => handleParentClick(item)}
                      className={`flex items-center flex-row dark:hover:text-[#3C60CA] hover:text-[#3C60CA] cursor-pointer gap-2 ${
                        currentTtitle.parent === item.title ? 'text-[#3C60CA]' : 'text-black dark:text-white'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[0.8rem] font-medium">{item.title}</span>
                      {item?.children?.length ? (
                        collapse && currentTtitle.parent === item.title ? <IoIosArrowUp className="ml-4" /> : <IoIosArrowDown className="ml-4" />
                      ) : null}
                    </div>
                    {collapse && currentTtitle.parent === item.title && renderChildren(item.children)}
                  </div>
                ))
              }
              </div>
            }

            <div className="flex flex-col gap-4">
              <span className="text-[1rem] text-[#949191] font-medium">Account</span>
              <div
                onClick={handleProfile}
                className={`flex items-center flex-row hover:text-[#3C60CA] dark:hover:text-[#3C60CA] cursor-pointer gap-2 ${
                  currentTtitle.parent === 'Account & Settings'
                    ? 'text-[#3C60CA]'
                    : 'text-black dark:text-white'
                }`}
              >
                <FaRegUser />
                <span className="text-[0.9rem] font-medium ">
                  Account & Settings
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              onClick={async () => await deleteSession()}
              className="flex flex-row gap-2 dark:text-slate-200 hover:text-[#3C60CA] items-center cursor-pointer"
            >
              <CiLogout />
              <span className="text-[0.9rem] font-medium">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

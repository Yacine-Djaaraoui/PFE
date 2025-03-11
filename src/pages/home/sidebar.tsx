import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logowithtitle.png";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Tableau de bord");
  const navigate = useNavigate();

  const handleItemClick = (itemName: string, path: string) => {
    setActiveItem(itemName);
    navigate(path);
  };

  return (
    <div className="bg-white w-[17%] flex py-10 border-r border-[#E6E4F0] shadow-lg flex-col items-center gap-4 min-h-screen">
      <img src={logo} alt="#" className="w-[150px]" />
      <nav className="flex flex-col gap-1 items-start text-[16px] mt-12">
        {/* Tableau de bord */}
        <NavLink
          to="/dashboard"
          className={({ isActive }: { isActive: boolean }) =>
            `group flex items-center gap-2 py-3 pl-3 w-[200px] rounded-lg cursor-pointer font-medium ${
              isActive
                ? "text-white bg-secondary"
                : "text-[#9896A3] hover:text-white hover:bg-secondary"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`w-6 h-6 group-hover:[&>svg]:fill-white [&>svg]:${
                  isActive ? "fill-white" : ""
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#19488E"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.67489 4.752C9.65049 4.752 10.4437 5.5452 10.4437 6.5208V8.72642C10.4437 9.70202 9.65049 10.4952 8.67489 10.4952H6.46929C5.49369 10.4952 4.70049 9.70202 4.70049 8.72642V6.5208C4.70049 5.5452 5.49369 4.752 6.46929 4.752H8.67489ZM8.67489 3.552H6.46929C4.83009 3.552 3.50049 4.8816 3.50049 6.5208V8.72642C3.50049 10.3656 4.83009 11.6952 6.46929 11.6952H8.67489C10.3141 11.6952 11.6437 10.3656 11.6437 8.72642V6.5208C11.6437 4.8816 10.3141 3.552 8.67489 3.552Z" />
                  <path d="M10.4434 13.5048V17.5692C10.4434 18.4956 9.68982 19.2492 8.76342 19.2492H6.37902C5.45262 19.2492 4.69902 18.4956 4.69902 17.5692V15.1848C4.69902 14.2584 5.45262 13.5048 6.37902 13.5048H10.4434ZM10.4434 12.3048H6.37902C4.78902 12.3048 3.49902 13.5948 3.49902 15.1848V17.5692C3.49902 19.1592 4.78902 20.4492 6.37902 20.4492H8.76342C10.3534 20.4492 11.6434 19.1592 11.6434 17.5692V13.5048C11.6434 12.8424 11.1058 12.3048 10.4434 12.3048Z" />
                  <path d="M17.5316 4.752C18.5072 4.752 19.3004 5.5452 19.3004 6.5208V8.72642C19.3004 9.70202 18.5072 10.4952 17.5316 10.4952H13.5572V6.5208C13.5572 5.5452 14.3504 4.752 15.326 4.752H17.5316ZM17.5316 3.552H15.326C13.6868 3.552 12.3572 4.8816 12.3572 6.5208V10.4952C12.3572 11.1576 12.8948 11.6952 13.5572 11.6952H17.5316C19.1708 11.6952 20.5004 10.3656 20.5004 8.72642V6.5208C20.5004 4.8816 19.1708 3.552 17.5316 3.552Z" />
                  <path d="M17.5316 13.5048C18.5072 13.5048 19.3004 14.298 19.3004 15.2736V17.4792C19.3004 18.4548 18.5072 19.248 17.5316 19.248H15.326C14.3504 19.248 13.5572 18.4548 13.5572 17.4792V15.2736C13.5572 14.298 14.3504 13.5048 15.326 13.5048H17.5316ZM17.5316 12.3048H15.326C13.6868 12.3048 12.3572 13.6344 12.3572 15.2736V17.4792C12.3572 19.1184 13.6868 20.448 15.326 20.448H17.5316C19.1708 20.448 20.5004 19.1184 20.5004 17.4792V15.2736C20.5004 13.6344 19.1708 12.3048 17.5316 12.3048Z" />
                </svg>
              </span>
              <span>Tableau de bord</span>
            </>
          )}
        </NavLink>

        {/* Mes collègues */}
        <NavLink
          to="/colleagues"
          className={({ isActive }: { isActive: boolean }) =>
            `group flex items-center gap-2 py-3 pl-3 w-[200px] rounded-lg cursor-pointer font-medium ${
              isActive
                ? "text-white bg-secondary"
                : "text-[#9896A3] hover:text-white hover:bg-secondary"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`w-6 h-6 group-hover:[&>svg]:fill-white [&>svg]:${
                  isActive ? "fill-white" : ""
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="#19488E"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.51764 1.72014C10.0344 1.72014 11.2692 2.95493 11.2692 4.47173C11.2692 5.98853 10.0344 7.22334 8.51764 7.22334C7.00084 7.22334 5.76604 5.98853 5.76604 4.47173C5.76604 2.95493 7.00084 1.72014 8.51764 1.72014ZM8.51764 0.520142C6.33484 0.520142 4.56604 2.28893 4.56604 4.47173C4.56604 6.65453 6.33484 8.42334 8.51764 8.42334C10.7004 8.42334 12.4692 6.65453 12.4692 4.47173C12.4692 2.28893 10.7004 0.520142 8.51764 0.520142Z" />
                  <path d="M13.4196 12.1493C14.7432 12.1493 15.8196 13.2257 15.8196 14.5493V15.0797C15.8196 15.7409 15.2808 16.2797 14.6196 16.2797H2.4C1.7388 16.2797 1.2 15.7409 1.2 15.0797V14.5493C1.2 13.2257 2.2764 12.1493 3.6 12.1493H13.4196ZM13.4196 10.9493H3.6C1.6116 10.9493 0 12.5609 0 14.5493V15.0797C0 16.4057 1.074 17.4797 2.4 17.4797H14.6196C15.9456 17.4797 17.0196 16.4057 17.0196 15.0797V14.5493C17.0196 12.5609 15.408 10.9493 13.4196 10.9493Z" />
                  <path d="M16.1161 8.55779H13.0441C12.7129 8.55779 12.4441 8.28899 12.4441 7.95779C12.4441 7.62659 12.7129 7.35779 13.0441 7.35779H16.1161C16.4473 7.35779 16.7161 7.62659 16.7161 7.95779C16.7161 8.28899 16.4473 8.55779 16.1161 8.55779Z" />
                  <path d="M14.5803 10.0938C14.2491 10.0938 13.9803 9.82497 13.9803 9.49377V6.42178C13.9803 6.09058 14.2491 5.82178 14.5803 5.82178C14.9115 5.82178 15.1803 6.09058 15.1803 6.42178V9.49377C15.1803 9.82497 14.9115 10.0938 14.5803 10.0938Z" />
                </svg>
              </span>
              <span>Mes collègues</span>
            </>
          )}
        </NavLink>

        {/* Messagerie */}
        <NavLink
          to="/messaging"
          className={({ isActive }: { isActive: boolean }) =>
            `group flex items-center gap-2 py-3 pl-3 w-[200px] rounded-lg cursor-pointer font-medium ${
              isActive
                ? "text-white bg-secondary"
                : "text-[#9896A3] hover:text-white hover:bg-secondary"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`w-6 h-6 group-hover:[&>svg]:fill-white group-hover:fill-white [&>svg]:${
                  isActive ? "fill-white" : ""
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#19488E"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 4.65593C16.05 4.65593 19.3452 7.95113 19.3452 12.0011C19.3452 16.0487 16.0548 19.3415 12.0084 19.3463H12.0048C11.982 19.3451 11.9604 19.3451 11.9376 19.3451L10.728 19.3367V19.3463H6.10443C5.31003 19.3463 4.66443 18.7007 4.66443 17.9063V12.3215V12.2999L4.66324 12.2783L4.66204 12.2615C4.65844 12.1691 4.65483 12.0827 4.65483 12.0023C4.65483 11.9219 4.65844 11.8355 4.66204 11.7431L4.66324 11.7263L4.66443 11.7047V11.6903V11.6879C4.74483 9.79313 5.54284 8.02434 6.91324 6.70674C8.28604 5.38314 10.0932 4.65593 12 4.65593ZM12 3.45593C7.40283 3.45593 3.65643 7.08593 3.46443 11.6351H3.46324V11.6807C3.45964 11.7875 3.45483 11.8931 3.45483 12.0011C3.45483 12.1091 3.45844 12.2147 3.46324 12.3215V17.9063C3.46324 19.3643 4.64524 20.5463 6.10324 20.5463H11.9268V20.5439C11.9508 20.5439 11.9748 20.5463 12 20.5463C16.7196 20.5463 20.5452 16.7207 20.5452 12.0011C20.5452 7.28153 16.7196 3.45593 12 3.45593Z" />
                  <path d="M10.4548 10.1531H7.16201C6.83081 10.1531 6.56201 9.88432 6.56201 9.55312C6.56201 9.22192 6.83081 8.95312 7.16201 8.95312H10.4548C10.786 8.95312 11.0548 9.22192 11.0548 9.55312C11.0548 9.88432 10.786 10.1531 10.4548 10.1531Z" />
                  <path d="M13.8698 15.0083H7.16055C6.82935 15.0083 6.56055 14.7395 6.56055 14.4083C6.56055 14.0771 6.82935 13.8083 7.16055 13.8083H13.8698C14.201 13.8083 14.4698 14.0771 14.4698 14.4083C14.4698 14.7395 14.201 15.0083 13.8698 15.0083Z" />
                </svg>
              </span>
              <span>Messagerie</span>
            </>
          )}
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }: { isActive: boolean }) =>
            `group flex items-center gap-2 py-3 pl-3 w-[200px] rounded-lg cursor-pointer font-medium 
     ${
       isActive
         ? "text-white bg-secondary"
         : "text-[#9896A3] hover:text-white hover:bg-secondary"
     }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`w-6 h-6 g group-hover:[&>svg]:fill-white [&>svg]:${
                  isActive ? "fill-white" : ""
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#19488E"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.0071 4.72075C13.5239 4.72075 14.7587 5.95554 14.7587 7.47234C14.7587 8.98914 13.5239 10.224 12.0071 10.224C10.4903 10.224 9.25554 8.98914 9.25554 7.47234C9.25554 5.95554 10.4903 4.72075 12.0071 4.72075ZM12.0071 3.52075C9.82434 3.52075 8.05554 5.28954 8.05554 7.47234C8.05554 9.65514 9.82434 11.424 12.0071 11.424C14.1899 11.424 15.9587 9.65514 15.9587 7.47234C15.9587 5.28954 14.1899 3.52075 12.0071 3.52075Z" />
                  <path d="M16.9091 15.15C18.2327 15.15 19.3091 16.2264 19.3091 17.55V18.0804C19.3091 18.7416 18.7703 19.2804 18.1091 19.2804H5.8895C5.2283 19.2804 4.6895 18.7416 4.6895 18.0804V17.55C4.6895 16.2264 5.7659 15.15 7.0895 15.15H16.9091ZM16.9091 13.95H7.0895C5.1011 13.95 3.4895 15.5616 3.4895 17.55V18.0804C3.4895 19.4064 4.5635 20.4804 5.8895 20.4804H18.1091C19.4351 20.4804 20.5091 19.4064 20.5091 18.0804V17.55C20.5091 15.5616 18.8975 13.95 16.9091 13.95Z" />
                </svg>
              </span>
              Profile
            </>
          )}
        </NavLink>
        <NavLink
          to="/mon-projet"
          className={({ isActive }: { isActive: boolean }) =>
            `group flex items-center gap-2 py-3 pl-3 w-[200px] rounded-lg cursor-pointer font-medium 
     ${
       isActive
         ? "text-white bg-secondary"
         : "text-[#9896A3] hover:text-white hover:bg-secondary"
     }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`w-6 h-6 g group-hover:[&>svg]:fill-white [&>svg]:${
                  isActive ? "fill-white" : ""
                }`}
              >
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="#19488E"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.0864 15.7628H2.92562C1.58522 15.7628 0.494423 14.6516 0.494423 13.2872V6.21079C0.486023 6.17119 0.482422 6.13038 0.482422 6.08838V2.82559C0.482422 1.39759 1.60802 0.237183 2.99282 0.237183H5.94122C6.66962 0.237183 7.36202 0.563606 7.83842 1.13121L8.35442 1.73838C8.94722 2.43438 9.81482 2.8364 10.7292 2.8364H15.0864C16.4268 2.8364 17.5176 3.94759 17.5176 5.31199V13.2884C17.5176 14.6528 16.4268 15.7628 15.0864 15.7628ZM1.68242 5.18838C1.69082 5.22798 1.69442 5.26879 1.69442 5.31079V13.2872C1.69442 13.9904 2.24642 14.5628 2.92562 14.5628H15.0864C15.7656 14.5628 16.3176 13.9904 16.3176 13.2872V5.31079C16.3176 4.60759 15.7656 4.0352 15.0864 4.0352H10.7304C9.46442 4.0352 8.26202 3.47958 7.44122 2.51478L6.92162 1.9052C6.67082 1.6064 6.31442 1.43598 5.94002 1.43598H2.99162C2.26922 1.43598 1.68122 2.05879 1.68122 2.82439V5.18838H1.68242Z" />
                  <path d="M14.0242 8.69597H10.5814C10.2502 8.69597 9.98145 8.42717 9.98145 8.09597C9.98145 7.76477 10.2502 7.49597 10.5814 7.49597H14.0242C14.3554 7.49597 14.6242 7.76477 14.6242 8.09597C14.6242 8.42717 14.3554 8.69597 14.0242 8.69597Z" />
                </svg>
              </span>
              Mon Projet
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;

"use client";
import { HiOutlineHome, HiOutlineChatBubbleLeftRight, HiOutlineHeart, HiOutlinePlus } from "react-icons/hi2";
import { IoCompassOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { getIsLoggedIn } from "@/redux/reducer/authSlice";
import { setIsLoginOpen } from "@/redux/reducer/globalStateSlice";
import { useNavigate } from "@/components/Common/useNavigate";
import { t } from "@/utils";
import { usePathname } from "next/navigation";

const BottomNav = ({ setIsLocationModalOpen }) => {
  const { navigate } = useNavigate();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isLoggedIn = useSelector(getIsLoggedIn);

  const handleProtectedAction = (path, action = null) => {
    if (!isLoggedIn) {
      dispatch(setIsLoginOpen(true));
      return;
    }
    action ? action() : navigate(path);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] pb-safe">
      <div className="flex justify-around items-center h-16 px-1">

        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 ${pathname === "/" ? "text-slate-900" : "text-gray-500"}`}
        >
          <div className="relative">
            <HiOutlineHome size={24} strokeWidth={1.5} />
            {pathname === "/" && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-slate-600 rounded-full border border-white"></span>
            )}
          </div>
          <span className="text-[10px] font-medium">{t("Inicio")}</span>
        </button>

        <button
          onClick={() => handleProtectedAction("/favorites")}
          className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 ${pathname === "/favorites" ? "text-slate-900" : "text-gray-500"}`}
        >
          <HiOutlineHeart size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">{t("Favoritos")}</span>
        </button>

        <button
          onClick={() => handleProtectedAction("/ad-listing")}
          className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-gray-500"
        >
          <HiOutlinePlus size={26} strokeWidth={2} className="border-2 border-gray-500 rounded-sm p-0.5" />
          <span className="text-[10px] font-medium">{t("Anunciar")}</span>
        </button>

        <button
          onClick={() => handleProtectedAction("/chat")}
          className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 ${pathname === "/chat" ? "text-slate-900" : "text-gray-500"}`}
        >
          <HiOutlineChatBubbleLeftRight size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">{t("Chat")}</span>
        </button>

        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-gray-500"
        >
          <IoCompassOutline size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">{t("Localização")}</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
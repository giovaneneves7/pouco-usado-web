"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { t, truncate } from "@/utils"; // Adicionei truncate que faltava na importação
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrLocation } from "react-icons/gr";
import { FaAngleDown } from "react-icons/fa6";
import {
  IoIosAddCircleOutline,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { setIsLoginOpen } from "@/redux/reducer/globalStateSlice";
import { usePathname } from "next/navigation";
import CustomImage from "@/components/Common/CustomImage";
import { Loader2, UserCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { userSignUpData } from "@/redux/reducer/authSlice";
import CustomLink from "@/components/Common/CustomLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiChat, BiDollarCircle, BiReceipt, BiTrashAlt } from "react-icons/bi";
import { LiaAdSolid } from "react-icons/lia";
import { LuHeart } from "react-icons/lu";
import { MdOutlineRateReview, MdWorkOutline } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import { settingsData } from "@/redux/reducer/settingSlice";
import FilterTree from "@/components/Filter/FilterTree";

const HomeMobileMenu = ({
  setIsLocationModalOpen,
  setIsRegisterModalOpen,
  setIsLogout,
  locationText,
  handleAdListing,
  IsAdListingClicked,
  setManageDeleteAccount,
  userData,
  IsLoggedin
}) => {
  const settings = useSelector(settingsData);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const showMenu = !!userData;
  const showCategories = !pathname.startsWith("/ads");

  const openLocationEditModal = () => {
    setIsOpen(false);
    setIsLocationModalOpen(true);
  };

  const handleLogin = () => {
    setIsOpen(false);
    setIsLoginOpen(true);
  };

  const handleRegister = () => {
    setIsOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSignOut = () => {
    setIsOpen(false);
    setIsLogout(true);
  };

  const handleDeleteAccount = () => {
    setIsOpen(false);
    setManageDeleteAccount((prev) => ({
      ...prev,
      IsDeleteAccount: true,
    }));
  };

  // Links do usuário
  const navItems = (
    <div className="flex flex-col px-4 pb-4">
      <CustomLink href="/notifications" className="flex items-center gap-1 py-4">
        <IoMdNotificationsOutline size={24} />
        <span>{t("Notificações")}</span>
      </CustomLink>
      <CustomLink href="/chat" className="flex items-center gap-1 py-4">
        <BiChat size={24} />
        <span>{t("chat")}</span>
      </CustomLink>
      <CustomLink href="/user-subscription" className="flex items-center gap-1 py-4">
        <BiDollarCircle size={24} />
        <span>{t("Assinatura")}</span>
      </CustomLink>
      <CustomLink href="/my-ads" className="flex items-center gap-1 py-4">
        <LiaAdSolid size={24} />
        <span>{t("Meus Anúncios")}</span>
      </CustomLink>
      <CustomLink href="/favorites" className="flex items-center gap-1 py-4">
        <LuHeart size={24} />
        <span>{t("Favoritos")}</span>
      </CustomLink>
      <CustomLink href="/transactions" className="flex items-center gap-1 py-4">
        <BiReceipt size={24} />
        <span>{t("Transações")}</span>
      </CustomLink>
      <CustomLink href="/reviews" className="flex items-center gap-1 py-4">
        <MdOutlineRateReview size={24} />
        <span>{t("Minhas Avaliações")}</span>
      </CustomLink>
      <CustomLink href="/job-applications" className="flex items-center gap-1 py-4">
        <MdWorkOutline size={24} />
        <span>{t("Vagas")}</span>
      </CustomLink>
      <button onClick={handleSignOut} className="flex items-center gap-1 py-4">
        <RiLogoutCircleLine size={24} />
        <span>{t("Sair")}</span>
      </button>
      <button onClick={handleDeleteAccount} className="flex items-center gap-1 text-destructive py-4">
        <BiTrashAlt size={24} />
        <span>{t("deleteAccount")}</span>
      </button>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className={`group flex items-center gap-2 border border-gray-300 rounded-full hover:shadow-md transition-all bg-white cursor-pointer ml-2 shrink-0 ${
            IsLoggedin ? "pl-1 pr-3 py-2.5" : "px-3 py-2.5"
          }`}
          onClick={(e) => {
             if (!IsLoggedin) {
                 e.preventDefault();
                 setIsLoginOpen(true);
             }
          }}
        >
          {IsLoggedin && userData ? (
            <>
              <div className="relative">
                <CustomImage 
                    src={userData.profile} 
                    alt={userData.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border border-gray-100" 
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate hidden sm:block">
                {truncate(userData.name, 12)}
              </span>
              <FaAngleDown className="text-gray-400 group-hover:text-gray-600 transition-colors" size={12} />
            </>
          ) : (
            <>
                <GiHamburgerMenu size={18} className="text-gray-600" />
                <UserCircle size={24} className="text-gray-500" />
            </>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent side="right" className="[&>button:first-child]:hidden] p-0 overflow-y-auto w-full sm:max-w-md md:w-[25em]">
        <SheetHeader className="p-5 border-b border-gray-100 text-left">
          {/*<SheetTitle className="text-3xl font-bold text-gray-800">
            {t("Menu")}
          </SheetTitle>*/}
          <SheetDescription className="sr-only">Menu principal</SheetDescription>
        </SheetHeader>

        <div className="p-5 flex flex-col gap-6 bg-white">
          <div className="flex items-center gap-3">
            {userData ? (
              <CustomLink href="/profile" className="flex items-center gap-3 group">
                <div className="relative">
                    <CustomImage
                    src={userData?.profile}
                    width={56}
                    height={56}
                    alt={userData?.name}
                    className="rounded-full w-14 h-14 object-cover border-2 border-gray-100 group-hover:border-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                    />
                </div>
                <div className="flex flex-col">
                    <p className="font-bold text-lg text-gray-900 leading-tight group-hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                        {userData?.name}
                    </p>
                </div>
              </CustomLink>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <GiHamburgerMenu size={24} />
                </div>
                <div className="flex flex-col">
                    <p className="font-bold text-lg text-gray-900">{t("Bem-vindo")}</p>
                    <div className="flex items-center gap-1 text-sm text-primary font-medium">
                        <button onClick={handleLogin} className="hover:underline">{t("login")}</button>
                        <span>/</span>
                        <button onClick={handleRegister} className="hover:underline">{t("register")}</button>
                    </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-gray-600 cursor-pointer -mt-2" onClick={openLocationEditModal}>
            <GrLocation size={18} className="flex-shrink-0 text-gray-500" />
            <p className="text-sm font-medium leading-snug line-clamp-1" title={locationText ? locationText : t("addLocation")}>
              {locationText ? locationText : t("Adicionar localização")}
            </p>
          </div>

          <button
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3.5 px-4 rounded-xl font-semibold transition-all shadow-sm active:scale-[0.98]"
            disabled={IsAdListingClicked}
            onClick={handleAdListing}
          >
            {IsAdListingClicked ? <Loader2 size={20} className="animate-spin" /> : <IoIosAddCircleOutline size={22} />}
            <span>{t("Anunciar Grátis")}</span>
          </button>
        </div>

        <div className="border-t border-gray-100">
            {showMenu && showCategories ? (
            <Tabs defaultValue="menu" className="w-full">
                <TabsList className="w-full flex h-12 bg-gray-50 p-1">
                <TabsTrigger value="menu" className="flex-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-gray-600 font-medium">{t("Menu")}</TabsTrigger>
                <TabsTrigger value="categories" className="flex-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-gray-600 font-medium">{t("Categorias")}</TabsTrigger>
                </TabsList>
                <TabsContent value="menu" className="mt-0">{navItems}</TabsContent>
                <TabsContent value="categories" className="mt-0 px-4 pb-4 pt-4"><FilterTree /></TabsContent>
            </Tabs>
            ) : showMenu ? (
            navItems
            ) : showCategories ? (
            <div className="px-4 pb-4 pt-4 flex flex-col gap-4">
                <h1 className="font-bold text-gray-900 px-2">{t("Categorias")}</h1>
                <FilterTree />
            </div>
            ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HomeMobileMenu;
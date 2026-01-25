"use client";
import LanguageDropdown from "@/components/Common/LanguageDropdown";
import { CurrentLanguageData } from "@/redux/reducer/languageSlice";
import { getIsFreAdListing, settingsData } from "@/redux/reducer/settingSlice";
import { t, truncate } from "@/utils";
import CustomLink from "@/components/Common/CustomLink";
import { useSelector } from "react-redux";
import { FiHeart, FiMessageSquare, FiTarget } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { getCityData } from "@/redux/reducer/locationSlice";
import HomeMobileMenu from "./HomeMobileMenu.jsx";
import MailSentSuccessModal from "@/components/Auth/MailSentSuccessModal.jsx";
import { useState } from "react";
import {
  getIsLoggedIn,
  logoutSuccess,
  userSignUpData,
} from "@/redux/reducer/authSlice.js";
import ProfileDropdown from "./ProfileDropdown.jsx";
import { toast } from "sonner";
import FirebaseData from "@/utils/Firebase.js";
import {
  CategoryData,
  getIsCatLoading,
} from "@/redux/reducer/categorySlice.js";
import { IoIosAddCircleOutline } from "react-icons/io";
import dynamic from "next/dynamic";
import {
  getIsLoginModalOpen,
  setIsLoginOpen,
} from "@/redux/reducer/globalStateSlice.js";
import ReusableAlertDialog from "@/components/Common/ReusableAlertDialog";
import { deleteUserApi, getLimitsApi, logoutApi } from "@/utils/api.js";
import { useMediaQuery } from "usehooks-ts";
import UnauthorizedModal from "@/components/Auth/UnauthorizedModal.jsx";
import CustomImage from "@/components/Common/CustomImage.jsx";
import { Loader2, UserCircle } from "lucide-react";
import { useNavigate } from "@/components/Common/useNavigate.jsx";
import { usePathname } from "next/navigation.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import HeaderCategories from "./HeaderCategories.jsx";
import { deleteUser, getAuth } from "firebase/auth";
import BottomNav from "@/components/Layout/BottomNav.jsx";

const Search = dynamic(() => import("./Search.jsx"), {
  ssr: false,
});
const LoginModal = dynamic(() => import("@/components/Auth/LoginModal.jsx"), {
  ssr: false,
});
const RegisterModal = dynamic(
  () => import("@/components/Auth/RegisterModal.jsx"),
  {
    ssr: false,
  }
);
const LocationModal = dynamic(
  () => import("@/components/Location/LocationModal.jsx"),
  {
    ssr: false,
  }
);

const HeaderCategoriesSkeleton = () => {
  return (
    <div className="container">
      <div className="py-1.5 border-b">
        <Skeleton className="w-full h-[40px]" />
      </div>
    </div>
  );
};

const HomeHeader = () => {
  const { navigate } = useNavigate();
  const { signOut } = FirebaseData();
  const pathname = usePathname();

  const userData = useSelector(userSignUpData);
  const IsLoggedin = useSelector(getIsLoggedIn);
  const IsLoginOpen = useSelector(getIsLoginModalOpen);
  const isCategoryLoading = useSelector(getIsCatLoading);
  const cateData = useSelector(CategoryData);
  const IsFreeAdListing = useSelector(getIsFreAdListing);
  const cityData = useSelector(getCityData);
  const settings = useSelector(settingsData);

  const [IsRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [IsLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [IsLogout, setIsLogout] = useState(false);
  const [IsLoggingOut, setIsLoggingOut] = useState(false);
  const [IsUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [IsAdListingClicked, setIsAdListingClicked] = useState(false);
  const [IsMailSentSuccess, setIsMailSentSuccess] = useState(false);

  const [manageDeleteAccount, setManageDeleteAccount] = useState({
    IsDeleteAccount: false,
    IsDeleting: false,
  });

  const isLargeScreen = useMediaQuery("(min-width: 992px)");

  const handleProtectedAction = (action) => {
    if (!IsLoggedin) {
      setIsLoginOpen(true);
      return;
    }
    action();
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      const res = await logoutApi.logoutApi({
        ...(userData?.fcm_id && { fcm_token: userData?.fcm_id }),
      });
      if (res?.data?.error === false) {
        logoutSuccess();
        toast.success(t("signOutSuccess"));
        setIsLogout(false);
        if (pathname !== "/") {
          navigate("/");
        }
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log("Failed to log out", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAdListing = async () => {
    if (!IsLoggedin) {
      setIsLoginOpen(true);
      return;
    }
    if (!userData?.name || !userData?.email) {
      setIsUpdatingProfile(true);
      return;
    }
    if (IsFreeAdListing) {
      navigate("/ad-listing");
      return;
    }
    try {
      setIsAdListingClicked(true);
      const res = await getLimitsApi.getLimits({
        package_type: "item_listing",
      });
      if (res?.data?.error === false) {
        navigate("/ad-listing");
      } else {
        toast.error(t("purchasePlan"));
        navigate("/subscription");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsAdListingClicked(false);
    }
  };

  const handleUpdateProfile = () => {
    setIsUpdatingProfile(false);
    navigate("/profile");
  };

  const handleDeleteAcc = async () => {
    try {
      setManageDeleteAccount((prev) => ({ ...prev, IsDeleting: true }));
      const auth = getAuth();
      const user = auth.currentUser;
      await deleteUser(user);
      await deleteUserApi.deleteUser();
      logoutSuccess();
      toast.success(t("userDeleteSuccess"));
      setManageDeleteAccount((prev) => ({ ...prev, IsDeleteAccount: false }));
      if (pathname !== "/") {
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
      if (error.code === "auth/requires-recent-login") {
        logoutSuccess();
        toast.error(t("deletePop"));
        setManageDeleteAccount((prev) => ({ ...prev, IsDeleteAccount: false }));
      }
    } finally {
      setManageDeleteAccount((prev) => ({ ...prev, IsDeleting: false }));
    }
  };

  const locationText = cityData?.formattedAddress;

  return (
    <>
      <header className="py-3 border-b bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px]">
          <div className="flex items-center justify-between gap-2 md:gap-4">

            <div className="flex-shrink-0">
              <CustomLink href="/">
                <CustomImage
                  src={settings?.header_logo}
                  alt="logo"
                  width={180}
                  height={45}
                  // ALTERAÇÃO AQUI: Aumentado h-[40px] (mobile) e proporcionalmente nos outros breakpoints
                  className="h-[40px] xs:h-[45px] md:h-[50px] w-auto object-contain"
                />
              </CustomLink>
            </div>

            <div className="flex-1 min-w-0 mx-1 md:mx-4 lg:max-w-[600px]">
              <div className="w-full">
                <Search />
              </div>
            </div>

            {isLargeScreen && (
              <div className="hidden lg:flex items-center gap-3 xl:gap-5 flex-shrink-0">
                <div className="flex items-center gap-4 text-gray-600">
                  <button
                    title="Favoritos"
                    onClick={() => handleProtectedAction(() => navigate('/favorites'))}
                    className="hover:text-primary transition"
                  >
                    <FiHeart size={20} />
                  </button>

                  <button
                    title="Chat"
                    onClick={() => handleProtectedAction(() => navigate('/chat'))}
                    className="hover:text-primary transition"
                  >
                    <FiMessageSquare size={20} />
                  </button>

                  <button
                    onClick={() => setIsLocationModalOpen(true)}
                    title={locationText ? locationText : t("addLocation")}
                    className="hover:text-primary transition"
                  >
                    <FiTarget size={22} />
                  </button>
                </div>

                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-colors shadow-sm whitespace-nowrap"
                  disabled={IsAdListingClicked}
                  onClick={handleAdListing}
                >
                  {IsAdListingClicked ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <IoIosAddCircleOutline size={20} />
                  )}
                  <span className="hidden xl:inline">Anunciar grátis</span>
                  <span className="xl:hidden">Anunciar</span>
                </button>

                {IsLoggedin ? (
                  <ProfileDropdown setIsLogout={setIsLogout} IsLogout={IsLogout} />
                ) : (
                  <div
                    className="flex items-center gap-2 border border-gray-300 rounded-full py-1.5 px-3 hover:shadow-md transition-all bg-white cursor-pointer"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    <UserCircle size={24} className="text-gray-500" />
                    <div className="flex flex-col gap-[3px]">
                      <span className="w-4 h-[1px] bg-gray-600"></span>
                      <span className="w-4 h-[1px] bg-gray-600"></span>
                      <span className="w-4 h-[1px] bg-gray-600"></span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isLargeScreen && (
              <div
                className="flex items-center gap-1 xs:gap-2 border border-gray-300 rounded-full py-1 px-2 xs:px-3 hover:shadow-md transition-all bg-white cursor-pointer shrink-0"
                onClick={() => !IsLoggedin && setIsLoginOpen(true)}
              >
                <div className="text-gray-500 shrink-0">
                  {IsLoggedin && userData?.profile ? (
                    <img src={userData.profile} className="w-5 h-5 xs:w-6 xs:h-6 rounded-full object-cover" alt="user" />
                  ) : (
                    <UserCircle size={20} className="xs:w-6 xs:h-6" />
                  )}
                </div>

                <HomeMobileMenu
                  setIsLocationModalOpen={setIsLocationModalOpen}
                  setIsRegisterModalOpen={setIsRegisterModalOpen}
                  setIsLogout={setIsLogout}
                  locationText={locationText}
                  handleAdListing={handleAdListing}
                  IsAdListingClicked={IsAdListingClicked}
                  setManageDeleteAccount={setManageDeleteAccount}
                />
              </div>
            )}
          </div>
        </nav>
      </header>

      {IsLoggedin && (
        <>
          {isCategoryLoading && !cateData.length ? (
            <HeaderCategoriesSkeleton />
          ) : (
            cateData &&
            cateData.length > 0 && <HeaderCategories cateData={cateData} />
          )}
        </>
      )}

      <BottomNav setIsLocationModalOpen={setIsLocationModalOpen} />

      <LoginModal
        key={IsLoginOpen}
        IsLoginOpen={IsLoginOpen}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
      />
      <RegisterModal
        setIsMailSentSuccess={setIsMailSentSuccess}
        IsRegisterModalOpen={IsRegisterModalOpen}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
        key={`${IsRegisterModalOpen}-register-modal`}
      />
      <MailSentSuccessModal
        IsMailSentSuccess={IsMailSentSuccess}
        setIsMailSentSuccess={setIsMailSentSuccess}
      />
      <ReusableAlertDialog
        open={IsLogout}
        onCancel={() => setIsLogout(false)}
        onConfirm={handleLogout}
        title={t("confirmLogout")}
        description={t("areYouSureToLogout")}
        cancelText={t("cancel")}
        confirmText={t("yes")}
        confirmDisabled={IsLoggingOut}
      />
      <ReusableAlertDialog
        open={IsUpdatingProfile}
        onCancel={() => setIsUpdatingProfile(false)}
        onConfirm={handleUpdateProfile}
        title={t("updateProfile")}
        description={t("youNeedToUpdateProfile")}
        confirmText={t("yes")}
      />
      {!isLargeScreen && (
        <ReusableAlertDialog
          open={manageDeleteAccount?.IsDeleteAccount}
          onCancel={() =>
            setManageDeleteAccount((prev) => ({
              ...prev,
              IsDeleteAccount: false,
            }))
          }
          onConfirm={handleDeleteAcc}
          title={t("areYouSure")}
          description={
            <ul className="list-disc list-inside mt-2">
              <li>{t("adsAndTransactionWillBeDeleted")}</li>
              <li>{t("accountsDetailsWillNotRecovered")}</li>
              <li>{t("subWillBeCancelled")}</li>
              <li>{t("savedMesgWillBeLost")}</li>
            </ul>
          }
          cancelText={t("cancel")}
          confirmText={t("yes")}
          confirmDisabled={manageDeleteAccount?.IsDeleting}
        />
      )}

      <LocationModal
        key={`${IsLocationModalOpen}-location-modal`}
        IsLocationModalOpen={IsLocationModalOpen}
        setIsLocationModalOpen={setIsLocationModalOpen}
      />
      <UnauthorizedModal />
    </>
  );
};

export default HomeHeader;
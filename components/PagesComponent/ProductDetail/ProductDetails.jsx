"use client";
import { useEffect, useState } from "react";
import {
  allItemApi,
  getMyItemsApi,
  setItemTotalClickApi,
  manageFavouriteApi
} from "@/utils/api";
import ProductFeature from "./ProductFeature";
import ProductDescription from "./ProductDescription";
import SellerDetailCard from "./SellerDetailCard";
import ProductLocation from "./ProductLocation";
import SimilarProducts from "./SimilarProducts";
// import AdsReportCard from "./AdsReportCard"; // Não é mais necessário se usarmos o Modal direto
import { usePathname, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import ProductGallery from "./ProductGallery";
import ReportModal from "@/components/User/ReportModal"; // Certifique-se que este import está correto
import {
  getFilteredCustomFields,
  getYouTubeVideoId,
  t,
  truncate,
} from "@/utils";
import PageLoader from "@/components/Common/PageLoader";
import OpenInAppDrawer from "@/components/Common/OpenInAppDrawer";
import { useDispatch, useSelector } from "react-redux";
import { CurrentLanguageData } from "@/redux/reducer/languageSlice";
import { userSignUpData } from "@/redux/reducer/authSlice";
import { setIsLoginOpen } from "@/redux/reducer/globalStateSlice";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import { setBreadcrumbPath } from "@/redux/reducer/breadCrumbSlice";
import NoData from "@/components/EmptyStates/NoData";
import {
  Share2,
  Heart,
  Flag,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  MapPin,
  Calendar,
  Hash
} from "lucide-react";
import { toast } from "sonner";

const ProductDetails = ({ slug }) => {
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const userData = useSelector(userSignUpData);
  const dispatch = useDispatch();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const isShare = searchParams.get("share") == "true" ? true : false;
  const isMyListing = pathName?.startsWith("/my-listing") ? true : false;

  const [productDetails, setProductDetails] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [status, setStatus] = useState("");
  const [videoData, setVideoData] = useState({ url: "", thumbnail: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenInApp, setIsOpenInApp] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [CurrentLanguage?.id]);

  useEffect(() => {
    if (window.innerWidth <= 768 && !isMyListing && isShare) {
      setIsOpenInApp(true);
    }
  }, []);

  const fetchMyListingDetails = async (slug) => {
    const response = await getMyItemsApi.getMyItems({ slug });
    const product = response?.data?.data?.data?.[0];
    if (!product) throw new Error("My listing product not found");
    setProductDetails(product);
    const videoLink = product?.video_link;
    if (videoLink) {
      const videoId = getYouTubeVideoId(videoLink);
      const thumbnail = videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : "";
      setVideoData((prev) => ({ ...prev, url: videoLink, thumbnail }));
    }

    const galleryImages =
      product?.gallery_images?.map((image) => image?.image) || [];
    setGalleryImages([product?.image, ...galleryImages]);
    setStatus(product?.status);
    dispatch(
      setBreadcrumbPath([
        { name: t("myAds"), slug: "/my-ads" },
        { name: truncate(product?.translated_item?.name || product?.name, 80) },
      ])
    );
  };

  const incrementViews = async (item_id) => {
    try {
      if (!item_id) return;
      await setItemTotalClickApi.setItemTotalClick({ item_id });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const fetchPublicListingDetails = async (slug) => {
    const response = await allItemApi.getItems({ slug });
    const product = response?.data?.data?.data?.[0];

    if (!product) throw new Error("Public listing product not found");
    setProductDetails(product);
    const videoLink = product?.video_link;
    if (videoLink) {
      setVideoData((prev) => ({ ...prev, url: videoLink }));
      const videoId = getYouTubeVideoId(videoLink);
      const thumbnail = videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : "";
      setVideoData((prev) => ({ ...prev, thumbnail }));
    }

    const galleryImages =
      product?.gallery_images?.map((image) => image?.image) || [];
    setGalleryImages([product?.image, ...galleryImages]);
    await incrementViews(product?.id);
  };

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      if (isMyListing) {
        await fetchMyListingDetails(slug);
      } else {
        await fetchPublicListingDetails(slug);
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productDetails?.name,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t("Link copiado"));
    }
  };

  const handleFavorite = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    try {
      if (!userData) {
        dispatch(setIsLoginOpen(true));
        return;
      }

      const response = await manageFavouriteApi.manageFavouriteApi({
        item_id: productDetails?.id,
      });

      if (response?.data?.error === false) {
        toast.success(response?.data?.message);
        setProductDetails((prev) => ({
          ...prev,
          is_liked: !prev.is_liked,
        }));
      } else {
        toast.error(t("failedToLike"));
      }
    } catch (error) {
      console.log(error);
      toast.error(t("failedToLike"));
    }
  };

  const handleReport = () => {
    if (!userData) {
      dispatch(setIsLoginOpen(true));
      return;
    }
    setIsReportModalOpen(true);
  };

  const filteredFields = getFilteredCustomFields(
    productDetails?.all_translated_custom_fields,
    CurrentLanguage?.id
  );

  return (
    <Layout>
      {isLoading ? (
        <PageLoader />
      ) : productDetails ? (
        <>
          <div className="bg-white border-b hidden md:block">
            <BreadCrumb title2={truncate(productDetails?.translated_item?.name || productDetails?.name, 80)} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px] mt-6 md:mt-8 pb-12">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* === ESQUERDA === */}
              <div className="lg:col-span-8 flex flex-col gap-8">

                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <ProductGallery galleryImages={galleryImages} videoData={videoData} />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 px-1">
                  <span className="text-gray-400">Publicado em</span>
                  <span className="font-semibold text-orange-500">
                    {productDetails?.category?.translated_name || productDetails?.category?.name}
                  </span>
                  <ChevronRight size={16} className="text-gray-300" />
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{productDetails?.created_at}</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <div className="flex items-center gap-1">
                    <Hash size={14} />
                    <span>ID: {productDetails?.id}</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{t("Detalhes")}</h3>
                  {filteredFields.length > 0 ? (
                    <ProductFeature filteredFields={filteredFields} />
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Condição</span>
                        <span className="font-medium text-gray-800">Usado</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{t("Descrição do vendedor")}</h3>
                  <ProductDescription productDetails={productDetails} />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{t("Localização")}</h3>
                  {/*<div className="mb-4 text-gray-600 flex items-center gap-2">
                    <MapPin size={18} />
                    {productDetails?.translated_address || productDetails?.address}
                  </div>*/}
                  <ProductLocation productDetails={productDetails} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 border-t pt-6">
                  <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-all text-sm font-medium shadow-sm">
                    <Share2 size={18} /> {t("Compartilhar")}
                  </button>

                  <button
                    onClick={handleFavorite}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 border rounded-full transition-all text-sm font-medium shadow-sm group ${productDetails?.is_liked
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <Heart
                      size={18}
                      fill={productDetails?.is_liked ? "currentColor" : "none"}
                      className={productDetails?.is_liked ? "text-red-600" : "text-gray-600"}
                    />
                    <span className="ml-2">
                      {productDetails?.is_liked ? t("Favoritado") : t("Favoritar")}
                    </span>
                  </button>

                  <button
                    onClick={handleReport}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-all text-sm font-medium shadow-sm"
                  >
                    <Flag size={18} /> {t("Denunciar")}
                  </button>
                </div>

              </div>

              <div className="lg:col-span-4 space-y-6">

                <div className="lg:hidden space-y-2 mb-4">
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">
                    {productDetails?.translated_item?.name || productDetails?.name}
                  </h1>
                  <p className="text-2xl font-extrabold text-gray-900">
                    {productDetails?.price ? `R$ ${productDetails.price}` : t("priceNotMentioned")}
                  </p>
                </div>

                <div className="sticky top-24 space-y-6">

                  <div className="hidden lg:block bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                      {productDetails?.translated_item?.name || productDetails?.name}
                    </h1>
                    <div className="text-3xl font-black text-gray-900">
                      {productDetails?.price ? `R$ ${productDetails.price}` : t("priceNotMentioned")}
                    </div>
                  </div>

                  {!isMyListing && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <SellerDetailCard
                        productDetails={productDetails}
                        setProductDetails={setProductDetails}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-center p-4">
                    <span className="text-xs text-gray-400 uppercase tracking-widest">Publicidade</span>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 text-base">
                      {t("Dicas de segurança")}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3 items-start">
                        <ShieldCheck size={20} className="text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-600 leading-relaxed">
                          Nunca pague antes de conhecer o pessoalmente
                        </span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <ShieldAlert size={20} className="text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-600 leading-relaxed">
                          Desconfie de muitas facilidades e preços muito abaixo do mercado
                        </span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <ShieldCheck size={20} className="text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-600 leading-relaxed">
                          Sempre marque encontros em lugares públicos com bastante movimentação
                        </span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>

            {!isMyListing && (
              <div className="mt-16 pt-8 border-t">
                <SimilarProducts productDetails={productDetails} />
              </div>
            )}
          </div>

          <OpenInAppDrawer
            isOpen={isOpenInApp}
            setIsOpen={setIsOpenInApp}
            productDetails={productDetails}
          />

          <ReportModal
            productDetails={productDetails}
            setProductDetails={setProductDetails}
            isReportModalOpen={isReportModalOpen}
            setIsReportModalOpen={setIsReportModalOpen}
          />
        </>
      ) : (
        <NoData name={t("oneAdvertisement")} />
      )}
    </Layout>
  );
};

export default ProductDetails;
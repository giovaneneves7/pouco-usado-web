"use client";
import { useEffect, useState } from "react";
import { allItemApi, getMyItemsApi, setItemTotalClickApi } from "@/utils/api";
import ProductFeature from "./ProductFeature";
import ProductDescription from "./ProductDescription";
import ProductDetailCard from "./ProductDetailCard";
import SellerDetailCard from "./SellerDetailCard";
import ProductLocation from "./ProductLocation";
import AdsReportCard from "./AdsReportCard";
import SimilarProducts from "./SimilarProducts";
import MyAdsListingDetailCard from "./MyAdsListingDetailCard";
import AdsStatusChangeCards from "./AdsStatusChangeCards";
import { usePathname, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import ProductGallery from "./ProductGallery";
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
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import { setBreadcrumbPath } from "@/redux/reducer/breadCrumbSlice";
import MakeFeaturedAd from "./MakeFeaturedAd";
import RenewAd from "./RenewAd";
import AdEditedByAdmin from "./AdEditedByAdmin";
import NoData from "@/components/EmptyStates/NoData";

const ProductDetails = ({ slug }) => {
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const dispatch = useDispatch();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const isShare = searchParams.get("share") == "true" ? true : false;
  const isMyListing = pathName?.startsWith("/my-listing") ? true : false;
  const [productDetails, setProductDetails] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [status, setStatus] = useState("");
  const [videoData, setVideoData] = useState({
    url: "",
    thumbnail: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenInApp, setIsOpenInApp] = useState(false);

  const IsShowFeaturedAd =
    isMyListing &&
    !productDetails?.is_feature &&
    productDetails?.status === "approved";

  const isMyAdExpired = isMyListing && productDetails?.status === "expired";
  const isEditedByAdmin =
    isMyListing && productDetails?.is_edited_by_admin === 1;

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
        {
          name: t("myAds"),
          slug: "/my-ads",
        },
        {
          name: truncate(product?.translated_item?.name || product?.name, 80),
        },
      ])
    );
  };
  const incrementViews = async (item_id) => {
    try {
      if (!item_id) {
        console.error("Invalid item_id for incrementViews");
        return;
      }
      const res = await setItemTotalClickApi.setItemTotalClick({ item_id });
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
      // You can also show a toast or error message here
    } finally {
      setIsLoading(false);
    }
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

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px] mt-4 md:mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-xl overflow-hidden border">
                  <ProductGallery galleryImages={galleryImages} videoData={videoData} />
                </div>

                <div className="lg:hidden space-y-2 px-1">
                  <h1 className="text-xl font-bold text-gray-900">
                    {productDetails?.translated_item?.name || productDetails?.name}
                  </h1>
                  <p className="text-2xl font-extrabold text-gray-900">
                    {productDetails?.price ? `R$ ${productDetails.price}` : t("priceNotMentioned")}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border space-y-8">
                  <div className="hidden lg:block border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {productDetails?.translated_item?.name || productDetails?.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span>Publicado em {productDetails?.created_at}</span>
                      <span>ID: {productDetails?.id}</span>
                    </div>
                  </div>

                  {filteredFields.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold border-l-4 border-primary pl-3">{t("Details")}</h2>
                      <ProductFeature filteredFields={filteredFields} />
                    </div>
                  )}

                  <div className="space-y-4">
                    <h2 className="text-lg font-bold border-l-4 border-primary pl-3">{t("description")}</h2>
                    <ProductDescription productDetails={productDetails} />
                  </div>

                  <div className="pt-4">
                    <ProductLocation productDetails={productDetails} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="hidden lg:block bg-white p-6 rounded-xl border shadow-sm sticky top-24">
                  <div className="text-3xl font-black text-gray-900 mb-6">
                    {productDetails?.price ? `R$ ${productDetails.price}` : t("priceNotMentioned")}
                  </div>

                  {!isMyListing && (
                    <SellerDetailCard
                      productDetails={productDetails}
                      setProductDetails={setProductDetails}
                    />
                  )}

                </div>

                <div className="lg:hidden">
                  {!isMyListing && <SellerDetailCard productDetails={productDetails} />}
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                  <h3 className="font-bold text-sm text-gray-700 mb-4 text-center uppercase tracking-wider">Dicas de segurança</h3>
                  <ul className="text-xs space-y-3 text-gray-600">
                    <li className="flex gap-2">🛡️ <span>Nunca pague antes de ver o produto.</span></li>
                    <li className="flex gap-2">🤝 <span>Encontros em locais públicos e movimentados.</span></li>
                  </ul>
                </div>
              </div>

            </div>

            {!isMyListing && (
              <div className="mt-12">
                <SimilarProducts productDetails={productDetails} />
              </div>
            )}
          </div>
        </>
      ) : (
        <NoData name={t("oneAdvertisement")} />
      )}
    </Layout>
  );
};

export default ProductDetails;

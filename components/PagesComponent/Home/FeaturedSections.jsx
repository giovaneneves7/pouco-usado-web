"use client";
import { t } from "@/utils";
import CustomLink from "@/components/Common/CustomLink";
import ProductCard from "@/components/Common/ProductCard";
import { Fragment, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SectionSlider = ({ data, handleLike }) => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = 300; 
      
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0 -ml-4 hidden sm:flex"
        aria-label="Scroll Left"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 px-1 no-scrollbar items-stretch"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          /* Chrome, Safari, Opera */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {data.map((item) => (
          <div 
            key={item?.id} 
            className="w-60 sm:w-64 md:w-72 flex-shrink-0 h-full"
          >
            <ProductCard item={item} handleLike={handleLike} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4 hidden sm:flex"
        aria-label="Scroll Right"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

const FeaturedSections = ({ featuredData, setFeaturedData, allEmpty }) => {
  const handleLike = (id) => {
    const updatedData = featuredData.map((section) => {
      const updatedSectionData = section.section_data.map((item) => {
        if (item.id === id) {
          return { ...item, is_liked: !item.is_liked };
        }
        return item;
      });
      return { ...section, section_data: updatedSectionData };
    });
    setFeaturedData(updatedData);
  };

  return (
    featuredData &&
    featuredData.length > 0 &&
    !allEmpty && (
      <section className="container">
        {featuredData.map(
          (ele) =>
            ele?.section_data.length > 0 && (
              <Fragment key={ele?.id}>
                <div className="flex justify-between items-center gap-2 mt-12 mb-6">
                  <h5 className="text-xl sm:text-2xl font-medium text-gray-900">
                    {ele?.translated_name || ele?.title}
                  </h5>

                  <CustomLink
                    href={`/ads?featured_section=${ele?.slug}`}
                    className="text-sm sm:text-base font-medium text-primary hover:underline whitespace-nowrap"
                    prefetch={false}
                  >
                    {t("viewAll")}
                  </CustomLink>
                </div>

                <SectionSlider 
                    data={ele?.section_data} 
                    handleLike={handleLike} 
                />
                
              </Fragment>
            )
        )}
      </section>
    )
  );
};

export default FeaturedSections;
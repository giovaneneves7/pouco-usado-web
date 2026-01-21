"use client";
import { isPdf, t } from "@/utils/index";
import { MdOutlineAttachFile } from "react-icons/md";
import { HiCheck } from "react-icons/hi2"; 
import CustomLink from "@/components/Common/CustomLink";
import CustomImage from "@/components/Common/CustomImage";

const ProductFeature = ({ filteredFields }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold border-l-4 border-primary pl-3">
        {t("Details")}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 mt-4">
        {filteredFields?.map((feature, index) => {
          return (
            <div className="flex items-start gap-2.5" key={index}>
              <div className="mt-1 bg-gray-100 rounded-full p-1 shrink-0">
                <HiCheck size={14} className="text-gray-500" />
              </div>

              <div className="flex flex-col min-w-0">
                <p className="text-[10px] text-gray-400 uppercase font-bold leading-tight truncate">
                  {feature?.translated_name || feature?.name}
                </p>

                <div className="text-sm font-semibold text-gray-700 mt-0.5">
                  {feature.type === "fileinput" ? (
                    isPdf(feature?.value?.[0]) ? (
                      <div className="flex gap-1 items-center text-primary">
                        <MdOutlineAttachFile size={16} />
                        <CustomLink
                          href={feature?.value?.[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {t("viewPdf")}
                        </CustomLink>
                      </div>
                    ) : (
                      <CustomLink
                        href={feature?.value?.[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CustomImage
                          src={feature?.value?.[0]}
                          alt="Preview"
                          width={40}
                          height={40}
                          className="rounded-md border mt-1"
                        />
                      </CustomLink>
                    )
                  ) : (
                    <p className="break-words">
                      {Array.isArray(feature?.translated_selected_values)
                        ? feature?.translated_selected_values.join(", ")
                        : feature?.translated_selected_values}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFeature;
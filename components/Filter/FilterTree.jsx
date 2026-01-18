import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { t } from "@/utils";
import CategoryNode from "./CategoryNode";
import { useNavigate } from "../Common/useNavigate";
import useGetCategories from "../Layout/useGetCategories";

const FilterTree = ({ extraDetails }) => {
  const { navigate } = useNavigate();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const {
    getCategories,
    cateData,
    isCatLoading,
    isCatLoadMore,
    catCurrentPage,
    catLastPage,
  } = useGetCategories();
  const hasMore = catCurrentPage < catLastPage;

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    Object.keys(extraDetails || {})?.forEach((key) => {
      params.delete(key);
    });

    if (pathname.startsWith("/ads")) {
      window.history.pushState(null, "", `/ads?${params.toString()}`);
    } else {
      navigate(`/ads?${params.toString()}`);
    }
  };

  return (
    <div className="w-full">
      {/* Lista Limpa */}
      {cateData.length > 0 ? (
        <ul className="space-y-1">
          {/* Item opcional 'Todas' caso queira manter a lógica, mas estilizado simples */}
          {/* Se quiser remover 'Todas as Categorias' e deixar só a lista como na imagem, comente as linhas abaixo */}
          <li>
             <button
                onClick={handleClick}
                className={cn(
                  "text-sm w-full text-left py-1.5 px-1 hover:text-primary transition-colors flex items-center gap-2",
                  !searchParams.get("category") ? "font-bold text-black" : "text-gray-600"
                )}
            >
                {t("allCategories")}
            </button>
          </li>

          {/* Nós de Categoria */}
          {cateData.map((category) => (
            <CategoryNode
              key={category.id + "filter-tree"}
              category={category}
              extraDetails={extraDetails}
            />
          ))}

          {/* Botão Carregar Mais */}
          {hasMore && (
            <button
              onClick={() => getCategories(catCurrentPage + 1)}
              className="text-gray-500 text-xs mt-3 hover:text-black hover:underline block w-full text-left pl-1"
              disabled={isCatLoadMore}
            >
              {isCatLoadMore ? (
                  <span className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> {t("loading")}
                  </span>
              ) : (
                  t("loadMore")
              )}
            </button>
          )}
        </ul>
      ) : (
        /* Estado de Loading Inicial */
        isCatLoading && (
            <div className="flex justify-start p-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
        )
      )}
    </div>
  );
};

export default FilterTree;
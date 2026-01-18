"use client";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { t } from "@/utils";
// Removi o BiPlanet pois não tem na imagem
import { FaSearch } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useNavigate } from "@/components/Common/useNavigate";
import useGetCategories from "@/components/Layout/useGetCategories";

const Search = () => {
  // Mantendo a lógica de categorias caso precise reativar no futuro,
  // mas visualmente focaremos apenas no input conforme a imagem.
  const {
    cateData,
    getCategories,
    isCatLoadMore,
    catLastPage,
    catCurrentPage,
  } = useGetCategories();

  const pathname = usePathname();
  const { navigate } = useNavigate();
  const categoryList = [
    { slug: "all-categories", translated_name: t("allCategories") },
    ...cateData,
  ];
  
  // O estado 'value' continua controlando a categoria (default: all-categories)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("all-categories");
  const selectedItem = categoryList.find((item) => item.slug === value);
  const hasMore = catCurrentPage < catLastPage;
  const { ref, inView } = useInView();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open && inView && hasMore && !isCatLoadMore) {
      getCategories(catCurrentPage + 1);
    }
  }, [hasMore, inView, isCatLoadMore, open]);

  const handleSearchNav = (e) => {
    e.preventDefault();

    const query = encodeURIComponent(searchQuery);
    const baseUrl = `/ads?query=${query}`;
    
    // Se a categoria estiver selecionada (mesmo que oculta), usa ela.
    const url =
      selectedItem?.slug === "all-categories"
        ? baseUrl
        : `/ads?category=${selectedItem?.slug}&query=${query}`;

    if (pathname === "/ads") {
      window.history.pushState(null, "", url);
    } else {
      navigate(url);
    }
  };

  return (
    <div className="w-full relative">
      {/* O Dropdown de categorias (Popover) foi ocultado aqui para corresponder 
         exatamente ao design da imagem enviada. Se quiser que o usuário possa 
         filtrar categorias, você pode reintroduzi-lo ou colocá-lo em outro lugar.
      */}

      <form
        onSubmit={handleSearchNav}
        className="w-full flex items-center bg-gray-100 rounded-full pl-5 pr-1.5 py-1.5 transition-all focus-within:ring-1 focus-within:ring-gray-300"
      >
        {/* Input Transparente */}
        <input
          type="text"
          placeholder="Busca por algo..." 
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm h-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Botão de Busca Circular e Escuro */}
        <button
          className="flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white w-9 h-9 rounded-full transition-colors flex-shrink-0 ml-2 shadow-sm"
          type="submit"
        >
          <FaSearch size={14} />
        </button>
      </form>
    </div>
  );
};

export default Search;
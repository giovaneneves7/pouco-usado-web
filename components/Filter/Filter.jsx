import FilterTree from "./FilterTree";
import { t } from "@/utils";
import { useSelector } from "react-redux";
import { getCurrentLangCode } from "@/redux/reducer/languageSlice";
import LocationTree from "./LocationTree";
import ExtraDetailsFilter from "./ExtraDetailsFilter";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useNavigate } from "../Common/useNavigate";

const Filter = ({
  customFields,
  extraDetails,
  setExtraDetails,
  newSearchParams, // Prop herdada, caso usada externamente
  country,
  state,
  city,
  area,
}) => {
  const langId = useSelector(getCurrentLangCode);
  const { navigate } = useNavigate();
  const searchParams = useSearchParams();

  // --- ESTADOS DOS FILTROS ---
  // Inicializamos com o valor que já está na URL (para não perder o filtro ao recarregar)
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [bairro, setBairro] = useState(searchParams.get("bairro") || ""); // Ajuste a chave se seu backend usar outro nome
  const [condition, setCondition] = useState(searchParams.get("condition") || "");
  const [transactionType, setTransactionType] = useState(searchParams.get("type") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [isDonation, setIsDonation] = useState(searchParams.get("donation") === "true");
  const [datePosted, setDatePosted] = useState(searchParams.get("datePosted") || "");
  const [isPremium, setIsPremium] = useState(searchParams.get("premium") === "true");
  const [hasPhone, setHasPhone] = useState(searchParams.get("hasPhone") === "true");

  const isShowCustomfieldFilter =
    customFields &&
    customFields.length > 0 &&
    customFields.some(
      (field) =>
        field.type === "checkbox" ||
        field.type === "radio" ||
        field.type === "dropdown"
    );

  // --- FUNÇÃO DE BUSCA ---
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    // Atualiza ou remove parâmetros conforme o estado
    if (keyword) params.set("keyword", keyword); else params.delete("keyword");
    if (bairro) params.set("bairro", bairro); else params.delete("bairro");
    if (condition && condition !== "Todos") params.set("condition", condition); else params.delete("condition");
    if (transactionType && transactionType !== "Todos") params.set("type", transactionType); else params.delete("type");
    
    // Lógica de Preço
    if (isDonation) {
        params.set("donation", "true");
        params.delete("minPrice");
        params.delete("maxPrice");
    } else {
        params.delete("donation");
        if (minPrice) params.set("minPrice", minPrice); else params.delete("minPrice");
        if (maxPrice) params.set("maxPrice", maxPrice); else params.delete("maxPrice");
    }

    if (datePosted && datePosted !== "Todos") params.set("datePosted", datePosted); else params.delete("datePosted");
    if (isPremium) params.set("premium", "true"); else params.delete("premium");
    if (hasPhone) params.set("hasPhone", "true"); else params.delete("hasPhone");

    // Navega para a página de resultados com os novos parâmetros
    navigate(`/ads?${params.toString()}`);
  };

  // Estilos visuais
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";
  const inputStyle = "w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-500 bg-white placeholder:text-gray-400";
  const selectStyle = "w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-500 bg-white appearance-none cursor-pointer";

  return (
    <div className="w-full bg-white ">
      
      {/* --- FORMULÁRIO DE FILTROS --- */}
      <div className="flex flex-col gap-4 mb-8">
        
        {/* Palavra-chave */}
        <div>
          <label className={labelStyle}>Palavra-chave</label>
          <input 
            type="text" 
            placeholder="Busca por algo..." 
            className={inputStyle}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Localização */}
        <div>
          <label className={labelStyle}>{t("location")}</label>
          <div className="border border-gray-300 rounded bg-white">
             <div className="overflow-hidden rounded">
                <LocationTree />
             </div>
          </div>
        </div>

        {/* Bairro */}
        <div>
          <label className={labelStyle}>Bairro</label>
          <input 
            type="text" 
            placeholder="Bairro completo..." 
            className={inputStyle}
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
        </div>

        {/* Condição */}
        <div>
          <label className={labelStyle}>Condição</label>
          <div className="relative">
            <select 
                className={selectStyle}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="new">Novo</option>
              <option value="used">Usado</option>
            </select>
          </div>
        </div>

        {/* Transação */}
        <div>
          <label className={labelStyle}>Transação</label>
          <div className="relative">
            <select 
                className={selectStyle}
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="sell">Venda</option>
              <option value="rent">Aluguel</option>
            </select>
          </div>
        </div>

        {/* Faixa de preço */}
        <div>
          <label className={labelStyle}>{t("budget") || "Faixa de preço (R$)"}</label>
          <div className="flex gap-2 mb-2">
            <input 
              type="number" 
              placeholder="Min" 
              className={inputStyle}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              disabled={isDonation} // Desabilita se for doação
            />
            <input 
              type="number" 
              placeholder="Max" 
              className={inputStyle}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              disabled={isDonation}
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="chk-donation" 
              className="rounded border-gray-300 text-slate-700 focus:ring-0 w-4 h-4 cursor-pointer"
              checked={isDonation}
              onChange={(e) => setIsDonation(e.target.checked)}
            />
            <label htmlFor="chk-donation" className="text-sm text-gray-500 cursor-pointer select-none">Doação</label>
          </div>
        </div>

        {/* Período */}
        <div>
          <label className={labelStyle}>{t("datePosted") || "Período"}</label>
          <div className="relative">
            <select 
                className={selectStyle}
                value={datePosted}
                onChange={(e) => setDatePosted(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="today">Hoje</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mês</option>
            </select>
          </div>
        </div>

        {/* Checkboxes Finais */}
        <div className="space-y-2 pt-1">
           <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-slate-700 focus:ring-0 w-4 h-4" 
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
              />
              <span className="text-sm text-gray-500 select-none">Anúncios premium</span>
           </label>
           <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-slate-700 focus:ring-0 w-4 h-4" 
                checked={hasPhone}
                onChange={(e) => setHasPhone(e.target.checked)}
              />
              <span className="text-sm text-gray-500 select-none">Com telefone</span>
           </label>
        </div>

        <button 
            onClick={handleSearch}
            className="w-full bg-[#3f4455] hover:bg-[#2c303b] text-white font-medium py-2.5 rounded flex items-center justify-center gap-2 transition-colors mt-2 shadow-sm"
        >
          <Search size={16} strokeWidth={2.5} />
          <span>{t("Procurar") || "Procurar"}</span>
        </button>

      </div>

      {/* --- DETALHES EXTRAS --- */}
      {/*{isShowCustomfieldFilter && (
        <div className="mb-8 border-t pt-4">
           <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="extra" className="border-b-0">
               <AccordionTrigger className="py-2 text-xs font-bold text-gray-800 hover:no-underline uppercase">
                 <span>{t("extradetails")}</span>
               </AccordionTrigger>
               <AccordionContent>
                <ExtraDetailsFilter
                  customFields={customFields}
                  extraDetails={extraDetails}
                  setExtraDetails={setExtraDetails}
                  newSearchParams={newSearchParams}
                />
               </AccordionContent>
            </AccordionItem>
           </Accordion>
        </div>
      )}*/}

      {/* --- SEÇÃO DE CATEGORIAS --- */}
      <div className="pt-2">
        <h3 className="font-bold text-sm text-gray-900 mb-4 px-0.5">
            {t("category") || "Escolha uma categoria"}
        </h3>
        <FilterTree key={langId} extraDetails={extraDetails} />
      </div>

    </div>
  );
};

export default Filter;
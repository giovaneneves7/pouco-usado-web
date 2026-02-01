"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import { t } from "@/utils";
import { getCurrentLangCode } from "@/redux/reducer/languageSlice";
import { useNavigate } from "../Common/useNavigate";
import { Slider } from "@/components/ui/slider"; // Importando o Slider

import FilterTree from "./FilterTree";
import LocationTree from "./LocationTree";

const Filter = ({
  customFields,
  extraDetails,
  setExtraDetails,
  country,
  state,
  city,
  area,
}) => {
  const langId = useSelector(getCurrentLangCode);
  const { navigate } = useNavigate();
  const searchParams = useSearchParams();

  // --- ESTADOS DOS FILTROS ---
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [bairro, setBairro] = useState(searchParams.get("bairro") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "");
  const [transactionType, setTransactionType] = useState(searchParams.get("type") || "");

  const MAX_PRICE_LIMIT = 87000;
  const initialMin = Number(searchParams.get("minPrice")) || 0;
  const initialMax = Number(searchParams.get("maxPrice")) || MAX_PRICE_LIMIT;
  const [priceRange, setPriceRange] = useState([initialMin, initialMax]);

  const [isDonation, setIsDonation] = useState(searchParams.get("donation") === "true");
  const [datePosted, setDatePosted] = useState(searchParams.get("datePosted") || "");
  const [isPremium, setIsPremium] = useState(searchParams.get("premium") === "true");
  const [hasPhone, setHasPhone] = useState(searchParams.get("hasPhone") === "true");

  const dateOptions = [
    { label: "Qualquer data", value: "" },
    { label: "Últimas 24h", value: "today" },
    { label: "Últimos 7 dias", value: "week" },
    { label: "Últimos 30 dias", value: "month" },
  ];

  // Atualiza slider se URL mudar externamente
  useEffect(() => {
    const min = Number(searchParams.get("minPrice")) || 0;
    const max = Number(searchParams.get("maxPrice")) || MAX_PRICE_LIMIT;
    setPriceRange([min, max]);
  }, [searchParams]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  // --- AÇÃO DE BUSCA ---
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (keyword) params.set("keyword", keyword); else params.delete("keyword");
    if (bairro) params.set("bairro", bairro); else params.delete("bairro");
    if (condition && condition !== "") params.set("condition", condition); else params.delete("condition");
    if (transactionType && transactionType !== "") params.set("type", transactionType); else params.delete("type");

    // Lógica de Preço / Doação
    if (isDonation) {
      params.set("donation", "true");
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.delete("donation");
      // Só seta se for diferente dos extremos (opcional, para limpar URL)
      // ou sempre seta para garantir o filtro exato
      params.set("minPrice", priceRange[0]);
      params.set("maxPrice", priceRange[1]);
    }

    if (datePosted && datePosted !== "") params.set("datePosted", datePosted); else params.delete("datePosted");

    if (isPremium) params.set("premium", "true"); else params.delete("premium");
    if (hasPhone) params.set("hasPhone", "true"); else params.delete("hasPhone");

    navigate(`/ads?${params.toString()}`);
  };

  // Classes utilitárias
  const labelStyle = "block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide";
  const inputStyle = "w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all bg-white shadow-sm";
  const selectStyle = "w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer shadow-sm appearance-none";

  return (
    <div className="w-full bg-white rounded-lg">

      <div className="flex flex-col gap-5 mb-8">

        {/* 1. Palavra-chave */}
        <div>
          <label className={labelStyle}>{t("search") || "Palavra-chave"}</label>
          <input
            type="text"
            placeholder="O que você procura?"
            className={inputStyle}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">
            {t("Categorias") || "Categorias"}
          </h3>
          <div className="pl-1">
            <FilterTree key={langId} extraDetails={extraDetails} />
          </div>
        </div>

        <div>
          <label className={labelStyle}>{t("Localização") || "Localização"}</label>
          <div className="border border-gray-300 rounded-md bg-white p-1 shadow-sm">
            <LocationTree />
          </div>
        </div>

        {/* 3. Bairro */}
        <div>
          <label className={labelStyle}>{t("Bairro") || "Bairro"}</label>
          <input
            type="text"
            placeholder="Ex: Centro, Jardins..."
            className={inputStyle}
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
        </div>

        {/* 4. Condição */}
        <div>
          <label className={labelStyle}>{t("condition") || "Condição"}</label>
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

        {/* 5. Transação */}
        <div>
          <label className={labelStyle}>{t("Tipo") || "Transação"}</label>
          <div className="relative">
            <select
              className={selectStyle}
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="sell">Venda</option>
              <option value="rent">Aluguel</option>
              <option value="exchange">Troca</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className={labelStyle.replace('mb-1.5', 'mb-0')}>{t("Faixa de Preço") || "Preço (R$)"}</label>
            {!isDonation && (
              <span className="text-xs text-gray-500 font-medium">
                R$ {priceRange[0]} - R$ {priceRange[1]}+
              </span>
            )}
          </div>

          <div className="px-1 py-2">
            <Slider
              disabled={isDonation}
              defaultValue={[0, MAX_PRICE_LIMIT]}
              value={priceRange}
              min={0}
              max={MAX_PRICE_LIMIT}
              step={100}
              onValueChange={handlePriceChange}
              className="my-2"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="chk-donation"
              className="rounded border-gray-300 text-slate-800 focus:ring-0 w-4 h-4 cursor-pointer accent-slate-800"
              checked={isDonation}
              onChange={(e) => setIsDonation(e.target.checked)}
            />
            <label htmlFor="chk-donation" className="text-sm text-gray-600 cursor-pointer select-none font-medium">
              Apenas Doações
            </label>
          </div>
        </div>

        <div>
          <label className={labelStyle}>{t("Data Publicação") || "Publicado em"}</label>
          <div className="flex flex-col gap-3 mt-2">
            {dateOptions.map((option) => (
              <label
                key={option.value || "all"}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="datePosted"
                  value={option.value}
                  checked={datePosted === option.value}
                  onChange={(e) => setDatePosted(e.target.value)}
                  className="w-4 h-4 text-slate-800 border-gray-300 focus:ring-slate-800 cursor-pointer accent-slate-800"
                />
                <span className={`text-sm ${datePosted === option.value ? "text-gray-900 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-1 border-t border-gray-100 mt-1">
          <label className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-slate-800 focus:ring-0 w-4 h-4 accent-slate-800"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
            />
            <span className="text-sm text-gray-600 select-none">Anúncios Premium</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-slate-800 focus:ring-0 w-4 h-4 accent-slate-800"
              checked={hasPhone}
              onChange={(e) => setHasPhone(e.target.checked)}
            />
            <span className="text-sm text-gray-600 select-none">Tem telefone</span>
          </label>
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-2 shadow-md active:scale-[0.98]"
        >
          <Search size={18} strokeWidth={2.5} />
          <span>{t("Buscar") || "Filtrar Resultados"}</span>
        </button>

      </div>

    </div>
  );
};

export default Filter;
"use client";
import CustomLink from "@/components/Common/CustomLink";
import { FaFacebook, FaLinkedin, FaWhatsapp, FaPinterest } from "react-icons/fa";
import { FaInstagram, FaSquareXTwitter } from "react-icons/fa6";
import { t } from "@/utils";
import { quickLinks } from "@/utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { settingsData } from "@/redux/reducer/settingSlice";
import { CurrentLanguageData } from "@/redux/reducer/languageSlice";
import { getIsLoggedIn } from "@/redux/reducer/authSlice";
import { setIsLoginOpen } from "@/redux/reducer/globalStateSlice";
import CustomImage from "../Common/CustomImage";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Footer() {
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const settings = useSelector(settingsData);
  const currentYear = new Date().getFullYear();
  const IsLoggedin = useSelector(getIsLoggedIn);
  const dispatch = useDispatch();
  const router = useRouter();

  // Função para lidar com o clique no botão "Criar conta" na barra escura
  const handleCreateAccount = () => {
    if (IsLoggedin) {
      router.push("/ad-listing");
    } else {
      dispatch(setIsLoginOpen(true));
    }
  };

  return (
    <footer>
      <div className="bg-slate-800 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px] flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-white text-lg md:text-xl font-medium text-center md:text-left">
            Você tem alguma coisa usada e quer vender?
          </h2>
          <button 
            onClick={handleCreateAccount}
            className="border border-white/30 text-white hover:bg-white hover:text-slate-800 transition-colors px-6 py-2 rounded-md font-medium text-sm uppercase tracking-wide"
          >
            {IsLoggedin ? t("Anunciar") : t("Cadastre-se")}
          </button>
        </div>
      </div>

      <div className="bg-gray-100 text-gray-600 pt-12 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            
            <div className="lg:col-span-4 space-y-4">
                <CustomLink href="/">
                  <CustomImage
                    src={settings?.footer_logo} 
                    alt="Logo"
                    width={150}
                    height={45}
                    className="object-contain ltr:object-left rtl:object-right h-[45px] w-auto"
                  />
                </CustomLink>
                
                <p className="text-sm leading-relaxed text-gray-500">
                  {settings?.footer_description || "Anuncie grátis! Venda eletrônicos, carros, celulares e muito mais sem taxas ou comissões."}
                </p>

                <div className="pt-2">
                    <Link href="/blog" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1.5 px-4 rounded text-sm transition-colors">
                        Blog
                    </Link>
                </div>
            </div>

            <div className="lg:col-span-4">
              <h3 className="text-gray-900 font-bold text-lg mb-4">Compartilhar</h3>
              <ul className="space-y-3">
                 <li>
                    <Link 
                        href="whatsapp://send?text=https%3A%2F%2Fpoucousado.com.br%2F" 
                        target="_blank" 
                        className="flex items-center gap-3 hover:text-[var(--primary-color)] transition-colors"
                    >
                        <FaWhatsapp size={18} />
                        <span>Whatsapp</span>
                    </Link>
                 </li>
                 
                 <li>
                    <Link 
                        href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpoucousado.com.br%2F" 
                        target="_blank" 
                        className="flex items-center gap-3 hover:text-[var(--primary-color)] transition-colors"
                    >
                        <FaFacebook size={18} />
                        <span>Facebook</span>
                    </Link>
                 </li>

                 <li>
                     <Link 
                        href="https://twitter.com/home?status=https%3A%2F%2Fpoucousado.com.br%2F%20-%20" 
                        target="_blank" 
                        className="flex items-center gap-3 hover:text-[var(--primary-color)] transition-colors"
                    >
                        <FaSquareXTwitter size={18} />
                        <span>Twitter / X</span>
                    </Link>
                 </li>

                 <li>
                     <Link 
                        href="https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fpoucousado.com.br%2F&title=&summary=&source=" 
                        target="_blank" 
                        className="flex items-center gap-3 hover:text-[var(--primary-color)] transition-colors"
                    >
                        <FaLinkedin size={18} />
                        <span>LinkedIn</span>
                    </Link>
                 </li>
                 
                 {settings?.instagram_link && (
                    <li>
                         <Link href={settings.instagram_link} target="_blank" className="flex items-center gap-3 hover:text-[var(--primary-color)] transition-colors">
                            <FaInstagram size={18} />
                            <span>Instagram</span>
                        </Link>
                    </li>
                 )}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h3 className="text-gray-900 font-bold text-lg mb-4">{t("Informações")}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                    <Link href="/privacy-policy" className="hover:underline hover:text-gray-900 block py-1">
                        {t("Política e Privacidade")}
                    </Link>
                </li>
                <li>
                    <Link href="/terms-and-condition" className="hover:underline hover:text-gray-900 block py-1">
                        {t("Termos e Condições")}
                    </Link>
                </li>
                {quickLinks.slice(0, 4).map((link) => (
                    <li key={link.id}>
                        <CustomLink href={link.href} className="hover:underline hover:text-gray-900 block py-1">
                             {t(link.labelKey)}
                        </CustomLink>
                    </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Divisor */}
          <div className="border-t border-gray-300 mt-10 mb-6"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-gray-500">
            
            <div className="flex flex-col gap-1">
                <h4 className="font-bold text-gray-700 text-sm mb-1">{t("Contato")}</h4>
                <p>
                    {t("copyright")} © {settings?.company_name} {currentYear}. {t("Todos os Direitos Reservados")}
                </p>
            </div>
            
            <div className="flex gap-4">
                 <Link href="/refund-policy" className="hover:text-gray-800 transition-colors">
                    {t("refundPolicy")}
                 </Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
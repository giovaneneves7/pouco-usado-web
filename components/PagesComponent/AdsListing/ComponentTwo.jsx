import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getCurrencyPosition,
  getCurrencySymbol,
} from "@/redux/reducer/settingSlice";
import { t } from "@/utils"; 
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";

const ComponentTwo = ({
  setTranslations,
  current,
  langId,
  handleDetailsSubmit,
  handleDeatilsBack,
  is_job_category,
  isPriceOptional,
  defaultLangId,
}) => {
  const currencyPosition = useSelector(getCurrencyPosition);
  const currencySymbol = useSelector(getCurrencySymbol);
  const placeholderLabel =
    currencyPosition === "right"
      ? `00 ${currencySymbol}`
      : `${currencySymbol} 00`;

  const handleField = (field) => (e) => {
    const value = e.target.value;
    setTranslations((prev) => {
      const updatedLangData = {
        ...prev[langId],
        [field]: value,
      };

      return {
        ...prev,
        [langId]: updatedLangData,
      };
    });
  };

  const handlePhoneChange = (value, data) => {
    const dial = data?.dialCode || ""; // Dial code like "91", "1"
    const iso2 = data?.countryCode || ""; // Region code like "in", "us", "ae"
    setTranslations((prev) => {
      const pureMobile = value.startsWith(dial)
        ? value.slice(dial.length)
        : value;
      return {
        ...prev,
        [langId]: {
          ...prev[langId],
          contact: pureMobile,
          country_code: dial,
          region_code: iso2,
        },
      };
    });
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="title"
          className={langId === defaultLangId ? "requiredInputLabel" : ""}
        >
          {t("Título")}
        </Label>
        <Input
          type="text"
          name="title"
          id="title"
          placeholder={t("Insira o título")}
          value={current.name || ""}
          onChange={handleField("name")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="description"
          className={langId === defaultLangId ? "requiredInputLabel" : ""}
        >
          {t("Descrição")}
        </Label>
        <Textarea
          name="description"
          id="description"
          cols="30"
          rows="3"
          placeholder={t("Insira a descrição")}
          className="border rounded-md px-4 py-2 outline-none"
          value={current.description || ""}
          onChange={handleField("description")}
        ></Textarea>
      </div>

      {/* Render the rest only for default language */}
      {langId === defaultLangId && (
        <>
          {is_job_category ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="salaryMin">{t("salaryMin")}</Label>
                <Input
                  type="number"
                  name="salaryMin"
                  id="salaryMin"
                  min={0}
                  placeholder={placeholderLabel}
                  value={current.min_salary || ""}
                  onChange={handleField("min_salary")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="salaryMax">{t("salaryMax")}</Label>
                <Input
                  type="number"
                  min={0}
                  name="salaryMax"
                  id="salaryMax"
                  placeholder={placeholderLabel}
                  value={current.max_salary || ""}
                  onChange={handleField("max_salary")}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="price"
                className={
                  !isPriceOptional && langId === defaultLangId
                    ? "requiredInputLabel"
                    : ""
                }
              >
                {t("Preço")}
              </Label>

              <Input
                type="number"
                name="price"
                id="price"
                min={0}
                placeholder={placeholderLabel}
                value={current.price || ""}
                onChange={handleField("price")}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="phonenumber"
              className={langId === defaultLangId ? "requiredInputLabel" : ""}
            >
              {t("phoneNumber")}
            </Label>
            <PhoneInput
              country={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY}
              value={`${current.country_code}${current.contact}`}
              onChange={(phone, data) => handlePhoneChange(phone, data)}
              inputProps={{
                name: "phonenumber",
                id: "phonenumber",
              }}
              enableLongNumbers
            />
          </div>
          
        </>
      )}
      <div className="flex justify-end gap-3">
        <button
          className="bg-black text-white px-4 py-2 rounded-md text-xl font-light"
          onClick={handleDeatilsBack}
        >
          {t("back")}
        </button>
        <button
          className="bg-primary text-white  px-4 py-2 rounded-md text-xl font-light"
          onClick={handleDetailsSubmit}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};

export default ComponentTwo;
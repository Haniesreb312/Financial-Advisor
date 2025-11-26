import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";
import { ArrowLeftRight, TrendingUp, DollarSign, Copy } from "lucide-react";
import { toast } from "./ui/sonner";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);

  // Comprehensive list of world currencies (60+ major currencies)
  const currencies: Currency[] = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
    { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
    { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
    { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
    { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
    { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
    { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
    { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
    { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
    
    // Middle East & North Africa
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
    { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", flag: "🇶🇦" },
    { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼" },
    { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", flag: "🇴🇲" },
    { code: "BHD", name: "Bahraini Dinar", symbol: "د.ب", flag: "🇧🇭" },
    { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", flag: "🇯🇴" },
    { code: "ILS", name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱" },
    { code: "EGP", name: "Egyptian Pound", symbol: "£", flag: "🇪🇬" },
    { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل", flag: "🇱🇧" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
    { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", flag: "🇲🇦" },
    { code: "TND", name: "Tunisian Dinar", symbol: "د.ت", flag: "🇹🇳" },
    { code: "DZD", name: "Algerian Dinar", symbol: "د.ج", flag: "🇩🇿" },
    
    // Latin America
    { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷" },
    { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱" },
    { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴" },
    { code: "PEN", name: "Peruvian Sol", symbol: "S/", flag: "🇵🇪" },
    { code: "UYU", name: "Uruguayan Peso", symbol: "$", flag: "🇺🇾" },
    
    // Africa
    { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
    { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
    { code: "UGX", name: "Ugandan Shilling", symbol: "USh", flag: "🇺🇬" },
    { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿" },
    
    // Asia
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
    { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰" },
    { code: "NPR", name: "Nepalese Rupee", symbol: "रू", flag: "🇳🇵" },
    { code: "MMK", name: "Myanmar Kyat", symbol: "K", flag: "🇲🇲" },
    { code: "KHR", name: "Cambodian Riel", symbol: "៛", flag: "🇰🇭" },
    { code: "LAK", name: "Lao Kip", symbol: "₭", flag: "🇱🇦" },
    
    // Eastern Europe
    { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
    { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
    { code: "RON", name: "Romanian Leu", symbol: "lei", flag: "🇷🇴" },
    { code: "BGN", name: "Bulgarian Lev", symbol: "лв", flag: "🇧🇬" },
    { code: "HRK", name: "Croatian Kuna", symbol: "kn", flag: "🇭🇷" },
    { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", flag: "🇺🇦" },
    { code: "RSD", name: "Serbian Dinar", symbol: "дин", flag: "🇷🇸" },
    
    // Other regions
    { code: "ISK", name: "Icelandic Krona", symbol: "kr", flag: "🇮🇸" },
    { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", flag: "🇹🇼" },
  ];

  // Mock exchange rates (in real app, would fetch from API)
  const exchangeRates: { [key: string]: { [key: string]: number } } = {
    USD: { 
      EUR: 0.92, GBP: 0.79, JPY: 149.50, CHF: 0.88, CAD: 1.36, AUD: 1.52, NZD: 1.65, 
      CNY: 7.24, INR: 83.12, SGD: 1.34, HKD: 7.82, KRW: 1305.50, MXN: 17.08, BRL: 4.97, 
      ZAR: 18.65, RUB: 92.50, SEK: 10.38, NOK: 10.52, DKK: 6.87, PLN: 3.97, THB: 34.85, 
      MYR: 4.47, IDR: 15625, PHP: 55.75,
      // Middle East & North Africa
      AED: 3.67, SAR: 3.75, QAR: 3.64, KWD: 0.31, OMR: 0.38, BHD: 0.38, JOD: 0.71,
      ILS: 3.64, EGP: 48.85, LBP: 89500, TRY: 32.15, MAD: 9.87, TND: 3.09, DZD: 134.50,
      // Latin America
      ARS: 1015.50, CLP: 975.30, COP: 3915.75, PEN: 3.72, UYU: 39.45,
      // Africa
      NGN: 1545.25, KES: 129.50, GHS: 15.85, UGX: 3685.50, TZS: 2515.75,
      // Asia
      PKR: 278.50, BDT: 119.85, VND: 24835, LKR: 299.50, NPR: 133.10, MMK: 2098.50, KHR: 4065, LAK: 21950,
      // Eastern Europe
      CZK: 22.65, HUF: 354.25, RON: 4.57, BGN: 1.80, HRK: 6.94, UAH: 41.25, RSD: 107.85,
      // Other
      ISK: 137.65, TWD: 31.85
    },
    EUR: { 
      USD: 1.09, GBP: 0.86, JPY: 162.50, CHF: 0.96, CAD: 1.48, AUD: 1.65, NZD: 1.79, 
      CNY: 7.88, INR: 90.43, SGD: 1.46, HKD: 8.51, KRW: 1420.75, MXN: 18.59, BRL: 5.41, 
      ZAR: 20.29, RUB: 100.65, SEK: 11.29, NOK: 11.44, DKK: 7.47, PLN: 4.32, THB: 37.92, 
      MYR: 4.86, IDR: 17000, PHP: 60.65,
      // Middle East & North Africa
      AED: 4.00, SAR: 4.08, QAR: 3.96, KWD: 0.34, OMR: 0.42, BHD: 0.41, JOD: 0.77,
      ILS: 3.96, EGP: 53.15, LBP: 97400, TRY: 34.99, MAD: 10.74, TND: 3.36, DZD: 146.35,
      // Latin America
      ARS: 1105.25, CLP: 1061.50, COP: 4260.50, PEN: 4.05, UYU: 42.95,
      // Africa
      NGN: 1681.50, KES: 140.95, GHS: 17.25, UGX: 4010.50, TZS: 2738.50,
      // Asia
      PKR: 303.15, BDT: 130.45, VND: 27025, LKR: 326.05, NPR: 144.85, MMK: 2283.50, KHR: 4425, LAK: 23895,
      // Eastern Europe
      CZK: 24.65, HUF: 385.50, RON: 4.97, BGN: 1.96, HRK: 7.55, UAH: 44.89, RSD: 117.45,
      // Other
      ISK: 149.85, TWD: 34.65
    },
    GBP: { 
      USD: 1.27, EUR: 1.16, JPY: 189.50, CHF: 1.12, CAD: 1.73, AUD: 1.93, NZD: 2.09, 
      CNY: 9.20, INR: 105.59, SGD: 1.70, HKD: 9.93, KRW: 1658.75, MXN: 21.71, BRL: 6.31, 
      ZAR: 23.69, RUB: 117.49, SEK: 13.19, NOK: 13.36, DKK: 8.72, PLN: 5.04, THB: 44.28, 
      MYR: 5.68, IDR: 19850, PHP: 70.82,
      // Middle East & North Africa
      AED: 4.67, SAR: 4.76, QAR: 4.62, KWD: 0.39, OMR: 0.49, BHD: 0.48, JOD: 0.90,
      ILS: 4.62, EGP: 62.05, LBP: 113700, TRY: 40.85, MAD: 12.54, TND: 3.93, DZD: 170.85,
      // Latin America
      ARS: 1290.25, CLP: 1239.50, COP: 4973.75, PEN: 4.73, UYU: 50.15,
      // Africa
      NGN: 1962.50, KES: 164.55, GHS: 20.14, UGX: 4682.50, TZS: 3197.50,
      // Asia
      PKR: 353.85, BDT: 152.25, VND: 31550, LKR: 380.65, NPR: 169.15, MMK: 2666.50, KHR: 5165, LAK: 27895,
      // Eastern Europe
      CZK: 28.77, HUF: 450.15, RON: 5.80, BGN: 2.29, HRK: 8.82, UAH: 52.39, RSD: 137.15,
      // Other
      ISK: 174.95, TWD: 40.45
    },
    JPY: { 
      USD: 0.0067, EUR: 0.0062, GBP: 0.0053, CHF: 0.0059, CAD: 0.0091, AUD: 0.0102, 
      NZD: 0.0110, CNY: 0.0484, INR: 0.556, SGD: 0.0090, HKD: 0.0523, KRW: 8.73, 
      MXN: 0.1143, BRL: 0.0332, ZAR: 0.1247, RUB: 0.6187, SEK: 0.0694, NOK: 0.0703, 
      DKK: 0.0459, PLN: 0.0265, THB: 0.2331, MYR: 0.0299, IDR: 104.50, PHP: 0.3729,
      // Middle East & North Africa
      AED: 0.0246, SAR: 0.0251, QAR: 0.0244, KWD: 0.0021, OMR: 0.0026, BHD: 0.0025, JOD: 0.0047,
      ILS: 0.0243, EGP: 0.3267, LBP: 598.50, TRY: 0.2150, MAD: 0.0660, TND: 0.0207, DZD: 0.8995,
      // Latin America
      ARS: 6.79, CLP: 6.52, COP: 26.19, PEN: 0.0249, UYU: 0.2639,
      // Africa
      NGN: 10.33, KES: 0.8665, GHS: 0.1060, UGX: 24.65, TZS: 16.83,
      // Asia
      PKR: 1.86, BDT: 0.801, VND: 166.05, LKR: 2.003, NPR: 0.890, MMK: 14.03, KHR: 27.19, LAK: 146.85,
      // Eastern Europe
      CZK: 0.1514, HUF: 2.37, RON: 0.0305, BGN: 0.0120, HRK: 0.0464, UAH: 0.2758, RSD: 0.7220,
      // Other
      ISK: 0.9210, TWD: 0.2130
    },
  };

  const convertCurrency = () => {
    let rate = 1;
    
    if (fromCurrency === toCurrency) {
      rate = 1;
    } else if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
      rate = exchangeRates[fromCurrency][toCurrency];
    } else if (exchangeRates[toCurrency] && exchangeRates[toCurrency][fromCurrency]) {
      rate = 1 / exchangeRates[toCurrency][fromCurrency];
    } else {
      // Convert through USD as intermediary
      const toUSD = exchangeRates[fromCurrency]?.USD || 1;
      const fromUSD = exchangeRates.USD[toCurrency] || 1;
      rate = toUSD * fromUSD;
    }

    setExchangeRate(rate);
    setConvertedAmount(amount * rate);
  };

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    toast.success("Currencies swapped!");
  };

  const copyResult = () => {
    const text = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    navigator.clipboard.writeText(text);
    toast.success("Conversion copied to clipboard!");
  };

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);

  const popularPairs = [
    { from: "USD", to: "EUR" },
    { from: "USD", to: "GBP" },
    { from: "EUR", to: "GBP" },
    { from: "USD", to: "AED" },
    { from: "USD", to: "QAR" },
    { from: "EUR", to: "HUF" },
    { from: "GBP", to: "EGP" },
    { from: "USD", to: "ILS" },
    { from: "EUR", to: "LBP" },
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <DollarSign className="h-10 w-10 text-blue-600" />
            <h2 className="text-gray-900">Currency Converter</h2>
          </div>
          <p className="text-gray-600">Convert between 70+ world currencies including USD, EUR, GBP, AED, QAR, HUF, EGP, ILS, LBP and more</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* From Currency */}
              <div className="space-y-4">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="text-lg"
                  min="0"
                  step="0.01"
                />
                
                <Label htmlFor="fromCurrency">From Currency</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger id="fromCurrency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <span className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code} - {currency.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center md:col-span-2 -my-4">
                <Button
                  onClick={swapCurrencies}
                  variant="outline"
                  className="rounded-full p-3 hover:bg-blue-50 hover:scale-110 hover:shadow-lg transition-all duration-300 group"
                >
                  <ArrowLeftRight className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                </Button>
              </div>

              {/* To Currency */}
              <div className="space-y-4">
                <Label htmlFor="converted">Converted Amount</Label>
                <div className="flex gap-2">
                  <div className="flex-1 text-gray-900 p-3 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-200 hover:shadow-md transition-shadow">
                    {convertedAmount.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyResult}
                    className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <Label htmlFor="toCurrency">To Currency</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger id="toCurrency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <span className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code} - {currency.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Exchange Rate Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-gray-600 text-sm mb-1 flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Exchange Rate
              </div>
              <div className="text-gray-900 hover:scale-105 transition-transform inline-block">
                1 {fromCurrencyData?.symbol} {fromCurrency} = {exchangeRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {toCurrencyData?.symbol} {toCurrency}
              </div>
            </div>
          </Card>

          {/* Popular Currency Pairs */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-gray-900 mb-4">Popular Currency Pairs</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {popularPairs.map((pair, index) => {
                const rate = exchangeRates[pair.from]?.[pair.to] || 1;
                const fromCurr = currencies.find(c => c.code === pair.from);
                const toCurr = currencies.find(c => c.code === pair.to);
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setFromCurrency(pair.from);
                      setToCurrency(pair.to);
                      toast.success(`Switched to ${pair.from}/${pair.to}`);
                    }}
                    className="p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-300 text-left border hover:border-blue-300 hover:shadow-md hover:scale-105 group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="group-hover:scale-125 transition-transform">{fromCurr?.flag}</span>
                      <span className="text-gray-900">{pair.from}</span>
                      <ArrowLeftRight className="h-3 w-3 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
                      <span className="group-hover:scale-125 transition-transform">{toCurr?.flag}</span>
                      <span className="text-gray-900">{pair.to}</span>
                    </div>
                    <div className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
                      1 {pair.from} = {rate.toFixed(4)} {pair.to}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

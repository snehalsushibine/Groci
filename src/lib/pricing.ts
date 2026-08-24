// Region-aware sample pricing table for illustrative grocery storefront displays

interface RegionalPricing {
  [countryCode: string]: {
    [productId: string]: {
      price: number;
      salePrice?: number;
    };
  };
}



// Sample prices per region based on realistic retail grocery averages
const REGIONAL_PRICES: RegionalPricing = {
  // India (INR ₹)
  IN: {
    p1:  { price: 62 },
    p2:  { price: 190, salePrice: 165 },
    p3:  { price: 150 },
    p4:  { price: 220 },
    p5:  { price: 65 },
    p6:  { price: 85,  salePrice: 72 },
    p7:  { price: 120 },
    p8:  { price: 110 },
    p9:  { price: 160 },
    p10: { price: 50,  salePrice: 42 },
    p11: { price: 110 },
    p12: { price: 180, salePrice: 149 },
    p13: { price: 90 },
    p14: { price: 140 },
    p15: { price: 40 },
    p16: { price: 35 },
    p17: { price: 30 },
    p18: { price: 40 },
    p19: { price: 65 },
    p20: { price: 75,  salePrice: 60 },
    p21: { price: 45 },
    p22: { price: 50 },
    p23: { price: 160, salePrice: 135 },
    p24: { price: 65 },
    p25: { price: 45 },
    p26: { price: 140, salePrice: 119 },
    p27: { price: 150 },
    p28: { price: 140 },
    p29: { price: 130, salePrice: 109 },
    p30: { price: 60 },
    p31: { price: 20 },
    p32: { price: 55 },
    p33: { price: 180, salePrice: 149 },
    p34: { price: 280 },
    p35: { price: 50 },
    p36: { price: 260, salePrice: 219 },
    p37: { price: 70 },
    p38: { price: 190 },
    p39: { price: 45 },
    p40: { price: 120 },
    p41: { price: 160, salePrice: 139 },
    p42: { price: 280 },
    p43: { price: 450 },
    p44: { price: 110 },
    p45: { price: 120 },
    p46: { price: 320, salePrice: 269 },
    p47: { price: 180 },
    p48: { price: 140 }
  },

  // United States (USD $)
  US: {
    p1:  { price: 3.80 },
    p2:  { price: 4.50, salePrice: 3.90 },
    p3:  { price: 4.20 },
    p4:  { price: 5.50 },
    p5:  { price: 3.20 },
    p6:  { price: 4.50, salePrice: 3.80 },
    p7:  { price: 3.80 },
    p8:  { price: 4.20 },
    p9:  { price: 3.00 },
    p10: { price: 1.50, salePrice: 1.20 },
    p11: { price: 3.50 },
    p12: { price: 6.00, salePrice: 4.90 },
    p13: { price: 3.80 },
    p14: { price: 4.50 },
    p15: { price: 2.20 },
    p16: { price: 1.80 },
    p17: { price: 1.60 },
    p18: { price: 2.80 },
    p19: { price: 3.20 },
    p20: { price: 2.50, salePrice: 2.00 },
    p21: { price: 2.00 },
    p22: { price: 3.50 },
    p23: { price: 5.00, salePrice: 4.20 },
    p24: { price: 4.00 },
    p25: { price: 2.80 },
    p26: { price: 3.80, salePrice: 3.00 },
    p27: { price: 4.50 },
    p28: { price: 4.50 },
    p29: { price: 3.50, salePrice: 2.80 },
    p30: { price: 2.00 },
    p31: { price: 1.20 },
    p32: { price: 2.50 },
    p33: { price: 4.80, salePrice: 3.90 },
    p34: { price: 7.50 },
    p35: { price: 2.50 },
    p36: { price: 6.00, salePrice: 4.90 },
    p37: { price: 2.20 },
    p38: { price: 4.20 },
    p39: { price: 2.80 },
    p40: { price: 4.50 },
    p41: { price: 6.00, salePrice: 4.90 },
    p42: { price: 7.50 },
    p43: { price: 12.00 },
    p44: { price: 3.50 },
    p45: { price: 3.00 },
    p46: { price: 10.00, salePrice: 8.50 },
    p47: { price: 4.50 },
    p48: { price: 3.80 }
  },

  // United Kingdom (GBP £)
  GB: {
    p1:  { price: 1.45 },
    p2:  { price: 2.20, salePrice: 1.85 },
    p3:  { price: 2.00 },
    p4:  { price: 3.20 },
    p5:  { price: 1.60 },
    p6:  { price: 2.40, salePrice: 1.95 },
    p7:  { price: 2.10 },
    p8:  { price: 2.50 },
    p9:  { price: 2.00 },
    p10: { price: 1.00, salePrice: 0.85 },
    p11: { price: 2.20 },
    p12: { price: 3.80, salePrice: 3.00 },
    p13: { price: 2.40 },
    p14: { price: 2.80 },
    p15: { price: 1.40 },
    p16: { price: 1.10 },
    p17: { price: 1.00 },
    p18: { price: 1.80 },
    p19: { price: 2.00 },
    p20: { price: 1.60, salePrice: 1.30 },
    p21: { price: 1.20 },
    p22: { price: 1.50 },
    p23: { price: 3.00, salePrice: 2.40 },
    p24: { price: 1.90 },
    p25: { price: 1.40 },
    p26: { price: 2.20, salePrice: 1.80 },
    p27: { price: 2.50 },
    p28: { price: 2.50 },
    p29: { price: 2.00, salePrice: 1.60 },
    p30: { price: 1.20 },
    p31: { price: 0.80 },
    p32: { price: 1.60 },
    p33: { price: 3.00, salePrice: 2.40 },
    p34: { price: 4.80 },
    p35: { price: 1.80 },
    p36: { price: 3.80, salePrice: 3.00 },
    p37: { price: 1.40 },
    p38: { price: 2.60 },
    p39: { price: 1.60 },
    p40: { price: 2.50 },
    p41: { price: 3.80, salePrice: 3.00 },
    p42: { price: 4.50 },
    p43: { price: 8.50 },
    p44: { price: 2.20 },
    p45: { price: 2.00 },
    p46: { price: 6.50, salePrice: 5.20 },
    p47: { price: 2.80 },
    p48: { price: 2.40 }
  },

  // Japan (JPY ¥)
  JP: {
    p1:  { price: 220 },
    p2:  { price: 380, salePrice: 320 },
    p3:  { price: 320 },
    p4:  { price: 580 },
    p5:  { price: 280 },
    p6:  { price: 380, salePrice: 310 },
    p7:  { price: 340 },
    p8:  { price: 380 },
    p9:  { price: 380 },
    p10: { price: 180, salePrice: 145 },
    p11: { price: 350 },
    p12: { price: 680, salePrice: 550 },
    p13: { price: 380 },
    p14: { price: 480 },
    p15: { price: 220 },
    p16: { price: 180 },
    p17: { price: 160 },
    p18: { price: 280 },
    p19: { price: 320 },
    p20: { price: 250, salePrice: 200 },
    p21: { price: 190 },
    p22: { price: 240 },
    p23: { price: 480, salePrice: 390 },
    p24: { price: 320 },
    p25: { price: 220 },
    p26: { price: 380, salePrice: 310 },
    p27: { price: 420 },
    p28: { price: 380 },
    p29: { price: 320, salePrice: 260 },
    p30: { price: 180 },
    p31: { price: 120 },
    p32: { price: 220 },
    p33: { price: 480, salePrice: 390 },
    p34: { price: 780 },
    p35: { price: 180 },
    p36: { price: 780, salePrice: 640 },
    p37: { price: 220 },
    p38: { price: 450 },
    p39: { price: 280 },
    p40: { price: 380 },
    p41: { price: 580, salePrice: 470 },
    p42: { price: 680 },
    p43: { price: 1400 },
    p44: { price: 320 },
    p45: { price: 280 },
    p46: { price: 880, salePrice: 720 },
    p47: { price: 420 },
    p48: { price: 350 }
  }
};

export function getRegionalPrice(productId: string, defaultUSDPrice: number, countryCode: string = 'US', isOnSale: boolean = false): { price: number; salePrice?: number } {
  const regionTable = REGIONAL_PRICES[countryCode] || REGIONAL_PRICES['US'];
  const pData = regionTable[productId];

  if (pData) {
    return {
      price: pData.price,
      salePrice: isOnSale && pData.salePrice ? pData.salePrice : undefined
    };
  }

  // Fallback multiplier for countries without an explicit table (EUR, CAD, AUD, AED, SAR, SGD)
  const multipliers: Record<string, number> = {
    DE: 0.92, FR: 0.92, ES: 0.92,
    CA: 1.35, AU: 1.50, AE: 3.67,
    SA: 3.75, SG: 1.34
  };

  const mult = multipliers[countryCode] || 1.0;
  const basePrice = Math.round(defaultUSDPrice * mult * 100) / 100;
  const salePrice = isOnSale ? Math.round(basePrice * 0.82 * 100) / 100 : undefined;

  return { price: basePrice, salePrice };
}

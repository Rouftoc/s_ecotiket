export const BOTTLE_RATES = {
    jumbo: { bottles: 1, tickets: 2, label: 'Botol Jumbo', size: 'Galon, Jerigen, Ember, dll' },
    besar: { bottles: 5, tickets: 1, label: 'Botol Besar', size: 'Botol 1.5 Liter' },
    sedang: { bottles: 8, tickets: 1, label: 'Botol Sedang', size: 'Botol 700 Mililiter' },
    kecil: { bottles: 15, tickets: 1, label: 'Botol Kecil', size: 'Botol 220 Mililiter' },
    cup: { bottles: 20, tickets: 1, label: 'Gelas Cup', size: 'Gelas Cup Plastik' }
};

export type BottleType = keyof typeof BOTTLE_RATES;

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  old: number;
  rating: number;
  reviews: number;
  tag: string;
  icon: string;
  category: string;
  brand: string;
  inStock: boolean;
  description: string;
  specs: string[][];
  image?: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Смартфон Pro Max 256GB', price: 79990, old: 99990, rating: 4.9, reviews: 1240, tag: 'Хит', icon: 'Smartphone', category: 'Электроника', brand: 'TechPro', inStock: true, description: 'Флагманский смартфон с процессором нового поколения, 256 ГБ встроенной памяти и камерой 200 МП.', specs: [['Дисплей', 'AMOLED 6.7", 120 Гц'], ['Процессор', 'Snapdragon 8 Gen 3'], ['Память', '12 ГБ / 256 ГБ'], ['Камера', '200 МП'], ['Батарея', '5000 мАч, 65W'], ['ОС', 'Android 14']] },
  { id: 2, name: 'Беспроводные наушники Air X', price: 12490, old: 17990, rating: 4.8, reviews: 860, tag: '-31%', icon: 'Headphones', category: 'Электроника', brand: 'SoundMax', inStock: true, description: 'Наушники с ANC, до 30 ч работы и кристально чистым звуком.', specs: [['Тип', 'Полноразмерные'], ['ANC', 'Активное шумоподавление'], ['Автономность', '30 ч'], ['Bluetooth', '5.3'], ['Вес', '250 г'], ['Цвет', 'Midnight Black']] },
  { id: 3, name: 'Умные часы Series 9', price: 24990, old: 29990, rating: 4.9, reviews: 980, tag: 'Топ', icon: 'Watch', category: 'Электроника', brand: 'TechPro', inStock: true, description: 'Смарт-часы с мониторингом ЧСС, SpO2, стресса. AMOLED 1.9", GPS, NFC.', specs: [['Экран', 'AMOLED 1.9"'], ['Защита', 'IP68'], ['Автономность', '14 дней'], ['Датчики', 'ЧСС, SpO2, GPS'], ['NFC', 'Оплата'], ['Совместимость', 'iOS / Android']] },
  { id: 4, name: 'Планшет Ultra 11"', price: 54990, old: 69990, rating: 4.7, reviews: 540, tag: '-21%', icon: 'Tablet', category: 'Электроника', brand: 'TechPro', inStock: false, description: 'Мощный планшет для работы и творчества. IPS 11", Dimensity 9300, 256 ГБ.', specs: [['Дисплей', 'IPS 11", 2K, 120 Гц'], ['Процессор', 'Dimensity 9300'], ['Память', '12 ГБ / 256 ГБ'], ['Батарея', '10000 мАч'], ['ОС', 'Android 14'], ['Разъём', 'USB-C 3.2']] },
  { id: 5, name: 'Робот-пылесос Clean+', price: 18900, old: 26900, rating: 4.6, reviews: 311, tag: '-30%', icon: 'Bot', category: 'Дом и сад', brand: 'HomeBot', inStock: true, description: 'Умный робот-пылесос с лазерной навигацией LiDAR и влажной уборкой. Мощность 4000 Па.', specs: [['Навигация', 'Лазерная (LiDAR)'], ['Мощность', '4000 Па'], ['Уборка', 'Сухая + влажная'], ['Автономность', '3 ч'], ['Управление', 'Приложение'], ['Площадь', 'до 200 м²']] },
  { id: 6, name: 'Кроссовки Street Run', price: 6790, old: 9900, rating: 4.7, reviews: 432, tag: 'Новинка', icon: 'Footprints', category: 'Обувь', brand: 'RunFast', inStock: true, description: 'Лёгкие кроссовки с дышащим верхом Flyknit и амортизирующей подошвой EVA.', specs: [['Верх', 'Flyknit mesh'], ['Подошва', 'EVA + резина'], ['Вес', '280 г'], ['Сезон', 'Всесезонные'], ['Уход', 'Ручная стирка'], ['Размеры', '36–47']] },
  { id: 7, name: 'Парфюм Aura 100ml', price: 8490, old: 11900, rating: 4.8, reviews: 654, tag: 'Хит', icon: 'Sparkles', category: 'Красота', brand: 'LuxScent', inStock: true, description: 'Изысканный парфюм для уверенных. Ноты: бергамот, роза, пачули, ваниль, мускус.', specs: [['Объём', '100 мл'], ['Тип', 'EDP'], ['Стойкость', '8–10 ч'], ['Шлейф', '4–6 ч'], ['Пол', 'Унисекс'], ['Страна', 'Франция']] },
  { id: 8, name: 'Куртка Winter Pro', price: 12900, old: 18900, rating: 4.6, reviews: 223, tag: '-32%', icon: 'Shirt', category: 'Одежда', brand: 'FashionRu', inStock: true, description: 'Тёплая зимняя куртка с наполнителем синтепон 300 г и пропиткой DWR.', specs: [['Наполнитель', 'Синтепон 300 г/м²'], ['Пропитка', 'DWR'], ['Капюшон', 'Съёмный'], ['Температура', 'до −25°C'], ['Состав', '100% полиэстер'], ['Размеры', 'XS–3XL']] },
  { id: 9, name: 'Велотренажёр CardioX', price: 32900, old: 44900, rating: 4.5, reviews: 187, tag: 'Новинка', icon: 'Dumbbell', category: 'Спорт', brand: 'SportPro', inStock: true, description: 'Магнитный велотренажёр с 16 уровнями сопротивления и встроенным пульсометром.', specs: [['Тип', 'Магнитный'], ['Уровни', '16'], ['Нагрузка', 'до 130 кг'], ['Дисплей', 'ЖК'], ['Пульсометр', 'Встроенный'], ['Вес', '25 кг']] },
  { id: 10, name: 'Автокресло Safe 360°', price: 14900, old: 19900, rating: 4.9, reviews: 412, tag: 'Топ', icon: 'Baby', category: 'Детские товары', brand: 'KidsCare', inStock: true, description: 'Детское автокресло с вращением 360°, ISOFIX, стандарт ECE R129.', specs: [['Группа', '0+/1/2 (0–25 кг)'], ['Поворот', '360°'], ['Крепление', 'ISOFIX'], ['Стандарт', 'ECE R129'], ['Возраст', '0–7 лет'], ['Вес', '13.5 кг']] },
  { id: 11, name: 'Газонокосилка EcoGreen', price: 28900, old: 36900, rating: 4.4, reviews: 98, tag: '-22%', icon: 'Home', category: 'Дом и сад', brand: 'HomeBot', inStock: false, description: 'Аккумуляторная газонокосилка, ширина 42 см, мешок 50 л, до 60 мин работы.', specs: [['Тип', 'Аккумуляторная'], ['Ширина', '42 см'], ['Высота', '25–75 мм'], ['Мешок', '50 л'], ['Работа', '60 мин'], ['Вес', '15 кг']] },
  { id: 12, name: 'Видеорегистратор Cam Pro', price: 7490, old: 9990, rating: 4.7, reviews: 330, tag: 'Хит', icon: 'Car', category: 'Автотовары', brand: 'AutoVision', inStock: true, description: 'Видеорегистратор 4K, Sony StarVis, угол 170°, Wi-Fi, встроенный GPS.', specs: [['Разрешение', '4K 30fps'], ['Угол', '170°'], ['Ночной режим', 'Sony StarVis 2'], ['Wi-Fi', 'Есть'], ['GPS', 'Есть'], ['Карта', 'microSD до 256 ГБ']] },
];

export interface CartItem {
  product: Product;
  qty: number;
}

interface StoreCtx {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: number) => void;
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addProduct = useCallback((p: Product) => {
    setProducts((prev) => [...prev, { ...p, id: Date.now() }]);
  }, []);

  const updateProduct = useCallback((p: Product) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.product.id === product.id);
      if (existing) return prev.map((x) => x.product.id === product.id ? { ...x, qty: x.qty + qty } : x);
      return [...prev, { product, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((x) => x.product.id !== id));
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((x) => x.product.id === id ? { ...x, qty } : x));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const cartTotal = cart.reduce((s, x) => s + x.product.price * x.qty, 0);

  return (
    <StoreContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

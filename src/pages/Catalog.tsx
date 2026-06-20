import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const ALL_PRODUCTS = [
  { id: 1, name: 'Смартфон Pro Max 256GB', price: 79990, old: 99990, rating: 4.9, reviews: 1240, tag: 'Хит', icon: 'Smartphone', category: 'Электроника', brand: 'TechPro', inStock: true },
  { id: 2, name: 'Беспроводные наушники Air X', price: 12490, old: 17990, rating: 4.8, reviews: 860, tag: '-31%', icon: 'Headphones', category: 'Электроника', brand: 'SoundMax', inStock: true },
  { id: 3, name: 'Умные часы Series 9', price: 24990, old: 29990, rating: 4.9, reviews: 980, tag: 'Топ', icon: 'Watch', category: 'Электроника', brand: 'TechPro', inStock: true },
  { id: 4, name: 'Планшет Ultra 11"', price: 54990, old: 69990, rating: 4.7, reviews: 540, tag: '-21%', icon: 'Tablet', category: 'Электроника', brand: 'TechPro', inStock: false },
  { id: 5, name: 'Робот-пылесос Clean+', price: 18900, old: 26900, rating: 4.6, reviews: 311, tag: '-30%', icon: 'Bot', category: 'Дом и сад', brand: 'HomeBot', inStock: true },
  { id: 6, name: 'Кроссовки Street Run', price: 6790, old: 9900, rating: 4.7, reviews: 432, tag: 'Новинка', icon: 'Footprints', category: 'Обувь', brand: 'RunFast', inStock: true },
  { id: 7, name: 'Парфюм Aura 100ml', price: 8490, old: 11900, rating: 4.8, reviews: 654, tag: 'Хит', icon: 'Sparkles', category: 'Красота', brand: 'LuxScent', inStock: true },
  { id: 8, name: 'Куртка Winter Pro', price: 12900, old: 18900, rating: 4.6, reviews: 223, tag: '-32%', icon: 'Shirt', category: 'Одежда', brand: 'FashionRu', inStock: true },
  { id: 9, name: 'Велотренажёр CardioX', price: 32900, old: 44900, rating: 4.5, reviews: 187, tag: 'Новинка', icon: 'Dumbbell', category: 'Спорт', brand: 'SportPro', inStock: true },
  { id: 10, name: 'Автокресло Safe 360°', price: 14900, old: 19900, rating: 4.9, reviews: 412, tag: 'Топ', icon: 'Baby', category: 'Детские товары', brand: 'KidsCare', inStock: true },
  { id: 11, name: 'Газонокосилка EcoGreen', price: 28900, old: 36900, rating: 4.4, reviews: 98, tag: '-22%', icon: 'Home', category: 'Дом и сад', brand: 'HomeBot', inStock: false },
  { id: 12, name: 'Видеорегистратор Cam Pro', price: 7490, old: 9990, rating: 4.7, reviews: 330, tag: 'Хит', icon: 'Car', category: 'Автотовары', brand: 'AutoVision', inStock: true },
];

const CATEGORIES = ['Все', 'Электроника', 'Одежда', 'Обувь', 'Автотовары', 'Детские товары', 'Красота', 'Спорт', 'Дом и сад'];
const SORTS = [
  { label: 'Популярные', value: 'popular' },
  { label: 'Дешевле', value: 'price_asc' },
  { label: 'Дороже', value: 'price_desc' },
  { label: 'Высокий рейтинг', value: 'rating' },
];

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

export default function Catalog() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const [sort, setSort] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filtered = useMemo(() => {
    let res = ALL_PRODUCTS.filter((p) => {
      if (category !== 'Все' && p.category !== category) return false;
      if (onlyInStock && !p.inStock) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (sort === 'price_asc') res = [...res].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') res = [...res].sort((a, b) => b.price - a.price);
    else if (sort === 'rating') res = [...res].sort((a, b) => b.rating - a.rating);
    return res;
  }, [search, category, sort, priceRange, onlyInStock]);

  const toggleWish = (id: number) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-xl brand-gradient text-white glow">F</span>
            FAMIDZ
          </button>
          <div className="relative flex-1">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по каталогу…"
              className="h-10 rounded-xl border-border bg-secondary/60 pl-9 text-sm"
            />
          </div>
          <button onClick={() => navigate('/')} className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex">
            <Icon name="Home" size={16} /> Главная
          </button>
          <button className="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[11px] text-muted-foreground hover:text-[hsl(var(--brand))]">
            <Icon name="ShoppingCart" size={20} />
            <span className="hidden sm:block">Корзина</span>
          </button>
        </div>
      </header>

      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => navigate('/')} className="hover:text-[hsl(var(--brand))]">Главная</button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground font-medium">Каталог</span>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="hidden w-60 shrink-0 md:block">
            <div className="sticky top-24 space-y-6 rounded-2xl border border-border bg-card p-5">
              <div>
                <h3 className="mb-3 font-display text-sm font-bold text-foreground">Категории</h3>
                <ul className="space-y-1">
                  {CATEGORIES.map((c) => (
                    <li key={c}>
                      <button
                        onClick={() => setCategory(c)}
                        className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                          category === c
                            ? 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))] font-semibold'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 font-display text-sm font-bold text-foreground">Цена</h3>
                <Slider
                  min={0}
                  max={100000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{fmt(priceRange[0])}</span>
                  <span>{fmt(priceRange[1])}</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setOnlyInStock((v) => !v)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    onlyInStock ? 'bg-[hsl(var(--brand))]/15 text-[hsl(var(--brand))]' : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded border ${onlyInStock ? 'border-[hsl(var(--brand))] bg-[hsl(var(--brand))]' : 'border-border'}`}>
                    {onlyInStock && <Icon name="Check" size={10} className="text-[hsl(var(--brand-ink))]" />}
                  </span>
                  Только в наличии
                </button>
              </div>

              <div>
                <h3 className="mb-3 font-display text-sm font-bold text-foreground">Рейтинг</h3>
                {[5, 4, 3].map((r) => (
                  <button key={r} className="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <div className="flex text-amber-400">
                      {Array.from({ length: r }).map((_, i) => (
                        <Icon key={i} name="Star" size={12} className="fill-amber-400" />
                      ))}
                    </div>
                    <span>и выше</span>
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl border-border text-muted-foreground hover:text-foreground"
                onClick={() => { setCategory('Все'); setPriceRange([0, 100000]); setOnlyInStock(false); setSearch(''); }}
              >
                Сбросить фильтры
              </Button>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Найдено:</span>
                <Badge className="rounded-full bg-[hsl(var(--brand))]/15 text-[hsl(var(--brand))]">{filtered.length} товаров</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex overflow-hidden rounded-xl border border-border">
                  {SORTS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSort(s.value)}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        sort === s.value ? 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))]' : 'text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="flex overflow-hidden rounded-xl border border-border">
                  <button onClick={() => setView('grid')} className={`px-2.5 py-1.5 transition-colors ${view === 'grid' ? 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))]' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Icon name="LayoutGrid" size={16} />
                  </button>
                  <button onClick={() => setView('list')} className={`px-2.5 py-1.5 transition-colors ${view === 'list' ? 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))]' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Icon name="List" size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile filters strip */}
            <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar md:hidden">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    category === c ? 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))]' : 'border border-border text-muted-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Icon name="PackageSearch" size={48} className="mb-4 text-muted-foreground/40" />
                <p className="text-lg font-semibold">Товары не найдены</p>
                <p className="mt-1 text-sm text-muted-foreground">Попробуйте изменить фильтры или поисковый запрос</p>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p, i) => (
                  <article
                    key={p.id}
                    style={{ animationDelay: `${i * 30}ms` }}
                    className="group flex animate-scale-in cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card opacity-0 transition-all hover:-translate-y-1 hover:border-[hsl(var(--brand))]/50 hover:shadow-xl hover:shadow-[hsl(var(--brand))]/10"
                    onClick={() => navigate(`/product/${p.id}`)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-secondary">
                      {!p.inStock && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Нет в наличии</span>
                        </div>
                      )}
                      <span className="absolute left-2 top-2 z-20 rounded-md bg-[hsl(var(--brand))] px-2 py-0.5 text-[11px] font-bold text-[hsl(var(--brand-ink))]">{p.tag}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
                        className="absolute right-2 top-2 z-20 grid h-8 w-8 place-items-center rounded-full bg-background/70 backdrop-blur transition-colors hover:text-rose-400"
                      >
                        <Icon name="Heart" size={16} className={wishlist.includes(p.id) ? 'fill-rose-400 text-rose-400' : 'text-muted-foreground'} />
                      </button>
                      <div className="grid h-full w-full place-items-center text-[hsl(var(--brand))]/30 transition-transform duration-500 group-hover:scale-110">
                        <Icon name={p.icon} size={64} />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <div className="mb-1 flex items-center gap-1 text-xs text-amber-400">
                        <Icon name="Star" size={12} className="fill-amber-400" />
                        <span className="font-semibold">{p.rating}</span>
                        <span className="text-muted-foreground">({p.reviews})</span>
                      </div>
                      <h3 className="mb-2 line-clamp-2 flex-1 text-sm font-medium leading-snug">{p.name}</h3>
                      <div className="mb-2 flex items-baseline gap-2">
                        <span className="font-display text-base font-extrabold text-[hsl(var(--brand))]">{fmt(p.price)}</span>
                        <span className="text-xs text-muted-foreground line-through">{fmt(p.old)}</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={!p.inStock}
                        className="h-8 w-full rounded-lg bg-[hsl(var(--brand))] text-xs font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)] disabled:opacity-40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon name="ShoppingCart" size={13} className="mr-1" /> В корзину
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((p, i) => (
                  <div
                    key={p.id}
                    style={{ animationDelay: `${i * 30}ms` }}
                    className="group flex animate-fade-in cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 opacity-0 transition-all hover:border-[hsl(var(--brand))]/50 hover:shadow-lg hover:shadow-[hsl(var(--brand))]/10"
                    onClick={() => navigate(`/product/${p.id}`)}
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <div className="grid h-full w-full place-items-center text-[hsl(var(--brand))]/30">
                        <Icon name={p.icon} size={36} />
                      </div>
                    </div>
                    <div className="flex flex-1 min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge className="rounded-full bg-[hsl(var(--brand))]/15 px-2 py-0 text-[10px] text-[hsl(var(--brand))]">{p.tag}</Badge>
                        {!p.inStock && <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px] text-muted-foreground">Нет в наличии</Badge>}
                      </div>
                      <h3 className="font-medium leading-snug">{p.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <Icon name="Star" size={11} className="fill-amber-400" />
                        <span className="font-semibold">{p.rating}</span>
                        <span className="text-muted-foreground">({p.reviews} отзывов)</span>
                        <span className="ml-2 text-muted-foreground">{p.brand}</span>
                      </div>
                    </div>
                    <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="font-display text-xl font-extrabold text-[hsl(var(--brand))]">{fmt(p.price)}</div>
                        <div className="text-xs text-muted-foreground line-through">{fmt(p.old)}</div>
                      </div>
                      <Button
                        size="sm"
                        disabled={!p.inStock}
                        className="rounded-xl bg-[hsl(var(--brand))] font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)] disabled:opacity-40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        В корзину
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

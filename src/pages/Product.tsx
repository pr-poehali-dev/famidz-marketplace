import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/context/StoreContext';



const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const REVIEWS_MOCK = [
  { name: 'Алексей М.', rating: 5, date: '15 июня 2026', text: 'Отличный товар, всё как описано. Доставка пришла быстро, упаковка целая. Рекомендую!' },
  { name: 'Мария К.', rating: 5, date: '10 июня 2026', text: 'Заказала второй раз — снова довольна. Качество на высоте, соответствует цене.' },
  { name: 'Дмитрий В.', rating: 4, date: '3 июня 2026', text: 'Товар хороший, но инструкция только на английском. В остальном претензий нет.' },
];

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, cartCount } = useStore();
  const product = products.find((p) => p.id === Number(id)) ?? products[0];

  const [qty, setQty] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [wished, setWished] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = Math.round(((product.old - product.price) / product.old) * 100);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 font-display text-xl font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-xl brand-gradient text-white glow">F</span>
            FAMIDZ
          </button>
          <button onClick={() => navigate(-1)} className="ml-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <Icon name="ArrowLeft" size={16} /> Назад
          </button>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => navigate('/cart')} className="relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[11px] text-muted-foreground hover:text-[hsl(var(--brand))]">
              <Icon name="ShoppingCart" size={20} />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--brand))] text-[10px] font-bold text-[hsl(var(--brand-ink))]">{cartCount}</span>}
              <span className="hidden sm:block">Корзина</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => navigate('/')} className="hover:text-[hsl(var(--brand))]">Главная</button>
          <Icon name="ChevronRight" size={14} />
          <button onClick={() => navigate('/catalog')} className="hover:text-[hsl(var(--brand))]">Каталог</button>
          <Icon name="ChevronRight" size={14} />
          <button onClick={() => navigate('/catalog')} className="hover:text-[hsl(var(--brand))]">{product.category}</button>
          <Icon name="ChevronRight" size={14} />
          <span className="max-w-[200px] truncate text-foreground">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
              {!product.inStock && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <span className="rounded-full border border-border bg-muted px-4 py-2 font-semibold text-muted-foreground">Нет в наличии</span>
                </div>
              )}
              <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
                <Badge className="rounded-lg bg-[hsl(var(--brand))] text-sm font-bold text-[hsl(var(--brand-ink))] px-2 py-1">−{discount}%</Badge>
              </div>
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-[hsl(var(--brand))]/25">
                  <Icon name={product.icon} size={180} />
                </div>
              )}
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[hsl(var(--brand))] opacity-10 blur-3xl" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <button key={i} className={`aspect-square w-16 overflow-hidden rounded-xl border bg-card transition-colors ${i === 1 ? 'border-[hsl(var(--brand))]' : 'border-border hover:border-[hsl(var(--brand))]/50'}`}>
                  {product.image ? (
                    <img src={product.image} alt="" className="h-full w-full object-cover opacity-70" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[hsl(var(--brand))]/20">
                      <Icon name={product.icon} size={28} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <Badge className="rounded-full bg-[hsl(var(--brand))]/10 text-[hsl(var(--brand))] text-xs">{product.category}</Badge>
              <span className="text-xs text-muted-foreground">{product.brand}</span>
            </div>
            <h1 className="font-display text-2xl font-extrabold leading-tight md:text-3xl">{product.name}</h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="Star" size={16} className={i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-muted/30'} />
                ))}
              </div>
              <span className="text-sm font-semibold text-amber-400">{product.rating}</span>
              <span className="text-sm text-muted-foreground">{product.reviews} отзывов</span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl font-extrabold text-[hsl(var(--brand))]">{fmt(product.price)}</span>
              <span className="text-lg text-muted-foreground line-through">{fmt(product.old)}</span>
              <Badge className="rounded-full bg-rose-500/15 text-rose-400 text-sm">−{discount}%</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Экономия: {fmt(product.old - product.price)}</p>

            {product.inStock ? (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-emerald-400">
                <Icon name="CheckCircle" size={14} /> В наличии · доставка сегодня
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Icon name="Clock" size={14} /> Нет в наличии · ожидается поставка
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center overflow-hidden rounded-xl border border-border bg-secondary">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="Minus" size={16} />
                </button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="Plus" size={16} />
                </button>
              </div>
              <Button
                disabled={!product.inStock}
                onClick={() => { addToCart(product, qty); setInCart(true); }}
                className={`h-11 flex-1 rounded-xl font-semibold transition-all ${inCart ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)] glow'} disabled:opacity-40`}
              >
                <Icon name={inCart ? 'Check' : 'ShoppingCart'} size={18} className="mr-2" />
                {inCart ? 'Добавлено в корзину' : 'В корзину'}
              </Button>
              <button
                onClick={() => setWished((w) => !w)}
                className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-secondary transition-colors hover:border-rose-400/50"
              >
                <Icon name="Heart" size={20} className={wished ? 'fill-rose-400 text-rose-400' : 'text-muted-foreground'} />
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="h-10 flex-1 rounded-xl border-border text-sm font-semibold hover:bg-secondary">
                <Icon name="Zap" size={16} className="mr-1.5 text-[hsl(var(--brand))]" /> Купить в 1 клик
              </Button>
            </div>

            {/* Delivery info */}
            <div className="mt-6 space-y-2 rounded-2xl border border-border bg-card p-4">
              {[
                { icon: 'Truck', text: 'Доставка СДЭК, Boxberry, Почта России' },
                { icon: 'ShieldCheck', text: 'Гарантия 1 год · возврат 30 дней' },
                { icon: 'CreditCard', text: 'СБП, карты, ЮMoney, T-Bank, рассрочка' },
              ].map((r) => (
                <div key={r.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon name={r.icon} size={16} className="shrink-0 text-[hsl(var(--brand))]" />
                  {r.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-border">
            {([['desc', 'Описание'], ['specs', 'Характеристики'], ['reviews', `Отзывы (${REVIEWS_MOCK.length})`]] as const).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold transition-colors ${activeTab === tab ? 'border-b-2 border-[hsl(var(--brand))] text-[hsl(var(--brand))]' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'desc' && (
              <p className="max-w-2xl leading-relaxed text-muted-foreground">{product.description}</p>
            )}
            {activeTab === 'specs' && (
              <div className="max-w-xl overflow-hidden rounded-2xl border border-border">
                {product.specs.map(([k, v], i) => (
                  <div key={k} className={`flex items-center gap-4 px-5 py-3 text-sm ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/40'}`}>
                    <span className="w-40 shrink-0 text-muted-foreground">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="max-w-2xl space-y-4">
                {REVIEWS_MOCK.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--brand))]/15 text-sm font-bold text-[hsl(var(--brand))]">
                          {r.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: r.rating }).map((_, j) => (
                          <Icon key={j} name="Star" size={13} className="fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-5 font-display text-xl font-extrabold">Похожие товары</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {similar.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-[hsl(var(--brand))]/50 hover:shadow-lg hover:shadow-[hsl(var(--brand))]/10"
                >
                  <div className="aspect-square bg-secondary">
                    <div className="grid h-full w-full place-items-center text-[hsl(var(--brand))]/30 transition-transform duration-300 group-hover:scale-110">
                      <Icon name={p.icon} size={52} />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
                    <p className="mt-1 font-display text-base font-extrabold text-[hsl(var(--brand))]">{fmt(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
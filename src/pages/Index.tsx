import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const HERO_IMG = 'https://cdn.poehali.dev/projects/95a2bd18-da3b-4707-bf3b-cc17ef944a11/files/7207ddc1-b937-4a1d-b198-7dcfee207eef.jpg';
const PRODUCTS_IMG = 'https://cdn.poehali.dev/projects/95a2bd18-da3b-4707-bf3b-cc17ef944a11/files/dbe19c63-17ae-4665-838d-f864b12ff354.jpg';

const NAV = ['Главная', 'Каталог', 'О нас', 'Контакты', 'Блог', 'FAQ', 'Поддержка'];

const CATEGORIES = [
  { name: 'Электроника', icon: 'Smartphone' },
  { name: 'Одежда', icon: 'Shirt' },
  { name: 'Обувь', icon: 'Footprints' },
  { name: 'Автотовары', icon: 'Car' },
  { name: 'Детские товары', icon: 'Baby' },
  { name: 'Красота', icon: 'Sparkles' },
  { name: 'Спорт', icon: 'Dumbbell' },
  { name: 'Дом и сад', icon: 'Home' },
  { name: 'Строительство', icon: 'Hammer' },
  { name: 'Услуги', icon: 'Briefcase' },
];

const PRODUCTS = [
  { name: 'Смартфон Pro Max 256GB', price: 79990, old: 99990, rating: 4.9, reviews: 1240, tag: 'Хит', icon: 'Smartphone' },
  { name: 'Беспроводные наушники Air', price: 12490, old: 17990, rating: 4.8, reviews: 860, tag: '-31%', icon: 'Headphones' },
  { name: 'Кроссовки Street Run', price: 6790, old: 9900, rating: 4.7, reviews: 432, tag: 'Новинка', icon: 'Footprints' },
  { name: 'Умные часы Series 9', price: 24990, old: 29990, rating: 4.9, reviews: 980, tag: 'Топ', icon: 'Watch' },
  { name: 'Робот-пылесос Clean+', price: 18900, old: 26900, rating: 4.6, reviews: 311, tag: '-30%', icon: 'Bot' },
  { name: 'Парфюм Aura 100ml', price: 8490, old: 11900, rating: 4.8, reviews: 654, tag: 'Хит', icon: 'Sparkles' },
];

const PAYMENTS = [
  { name: 'СБП', icon: 'QrCode' },
  { name: 'Банковские карты', icon: 'CreditCard' },
  { name: 'ЮMoney', icon: 'Wallet' },
  { name: 'T-Bank', icon: 'Landmark' },
  { name: 'SberPay', icon: 'BadgeRussianRuble' },
  { name: 'Рассрочка', icon: 'CalendarClock' },
];

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

export default function Index() {
  const navigate = useNavigate();
  const [active, setActive] = useState('Главная');

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Top bar */}
      <div className="hidden border-b border-border/40 bg-[hsl(var(--brand-ink))] py-2 text-xs text-slate-400 md:block">
        <div className="container flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon name="Truck" size={14} className="text-[hsl(var(--brand))]" /> Бесплатная доставка по всей России от 3000 ₽
          </span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 hover:text-white"><Icon name="Phone" size={13} /> 8 800 555-35-35</span>
            <span className="cursor-pointer hover:text-white">Стать продавцом</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex items-center gap-6 py-4">
          <a className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight" href="#">
            <span className="grid h-9 w-9 place-items-center rounded-xl brand-gradient text-white glow">F</span>
            FAMIDZ
          </a>

          <Button onClick={() => navigate('/catalog')} className="hidden h-11 gap-2 rounded-xl bg-[hsl(var(--brand))] px-5 font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)] lg:flex">
            <Icon name="LayoutGrid" size={18} /> Каталог
          </Button>

          <div className="relative hidden flex-1 md:block">
            <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Искать товары, бренды и категории…" className="h-11 rounded-xl border-border bg-secondary/60 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-[hsl(var(--brand))]" />
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            {[
              { icon: 'Heart', label: 'Избранное' },
              { icon: 'ShoppingCart', label: 'Корзина' },
              { icon: 'User', label: 'Войти' },
            ].map((a) => (
              <button key={a.label} className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-[hsl(var(--brand))]">
                <Icon name={a.icon} size={22} />
                <span className="hidden sm:block">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <nav className="container flex items-center gap-1 overflow-x-auto pb-3 no-scrollbar">
          {NAV.map((item) => (
            <button
              key={item}
              onClick={() => { setActive(item); if (item === 'Каталог') navigate('/catalog'); }}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active === item ? 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))]' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <section className="container pt-6">
        <div className="relative overflow-hidden rounded-3xl border border-border brand-gradient px-8 py-12 md:px-14 md:py-20">
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div className="relative z-10 max-w-xl animate-fade-in">
            <Badge className="mb-5 rounded-full border-[hsl(var(--brand))]/40 bg-[hsl(var(--brand))]/10 px-3 py-1 text-[hsl(var(--brand))] backdrop-blur">
              🚀 Распродажа недели · до −70%
            </Badge>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-white text-balance md:text-6xl">
              Всё, что нужно,<br /><span className="glow-text text-[hsl(var(--brand))]">в одном месте</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-slate-300 md:text-lg">
              Более 1 000 000 товаров от проверенных продавцов. Быстрая доставка и безопасная оплата по всей России.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => navigate('/catalog')} className="h-12 rounded-xl bg-[hsl(var(--brand))] px-7 font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)] glow">
                Перейти в каталог <Icon name="ArrowRight" size={18} className="ml-1.5" />
              </Button>
              <Button variant="outline" className="h-12 rounded-xl border-white/20 bg-white/5 px-7 font-semibold text-white hover:bg-white/10">
                Акции дня
              </Button>
            </div>
            <div className="mt-9 flex gap-8 text-white">
              {[['1M+', 'товаров'], ['100K+', 'продавцов'], ['4.9★', 'рейтинг']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl font-extrabold text-[hsl(var(--brand))]">{n}</div>
                  <div className="text-xs text-slate-400">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <img src={HERO_IMG} alt="FAMIDZ" className="pointer-events-none absolute -right-10 top-1/2 hidden w-[46%] -translate-y-1/2 animate-float rounded-3xl object-cover opacity-90 md:block" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[hsl(var(--brand))] opacity-30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[hsl(var(--brand-2))] opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Categories */}
      <section className="container pt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-extrabold md:text-3xl">Категории</h2>
          <button className="flex items-center gap-1 text-sm font-medium text-[hsl(var(--brand))] hover:underline">
            Все категории <Icon name="ChevronRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.name}
              style={{ animationDelay: `${i * 40}ms` }}
              className="group flex animate-fade-in flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center opacity-0 transition-all hover:-translate-y-1 hover:border-[hsl(var(--brand))]/50 hover:shadow-lg hover:shadow-[hsl(var(--brand))]/10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-[hsl(var(--brand))] transition-all group-hover:bg-[hsl(var(--brand))] group-hover:text-[hsl(var(--brand-ink))] group-hover:glow">
                <Icon name={c.icon} size={24} />
              </span>
              <span className="text-sm font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="container pt-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold md:text-3xl">Популярные товары</h2>
            <p className="mt-1 text-sm text-muted-foreground">Выбор тысяч покупателей FAMIDZ</p>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-[hsl(var(--brand))] hover:underline">
            Смотреть все <Icon name="ChevronRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {PRODUCTS.map((p, i) => (
            <article
              key={p.name}
              style={{ animationDelay: `${i * 50}ms` }}
              className="group flex animate-scale-in cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card opacity-0 transition-all hover:-translate-y-1 hover:border-[hsl(var(--brand))]/50 hover:shadow-xl hover:shadow-[hsl(var(--brand))]/10"
              onClick={() => navigate(`/product/${i + 1}`)}
            >
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <span className="absolute left-2 top-2 z-10 rounded-md bg-[hsl(var(--brand))] px-2 py-0.5 text-[11px] font-bold text-[hsl(var(--brand-ink))]">{p.tag}</span>
                <button className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-background/70 text-muted-foreground backdrop-blur transition-colors hover:text-rose-400">
                  <Icon name="Heart" size={16} />
                </button>
                <div className="grid h-full w-full place-items-center text-[hsl(var(--brand))]/40 transition-transform duration-500 group-hover:scale-110">
                  <Icon name={p.icon} size={64} />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <div className="mb-1 flex items-center gap-1 text-xs text-amber-400">
                  <Icon name="Star" size={13} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{p.rating}</span>
                  <span className="text-muted-foreground">({p.reviews})</span>
                </div>
                <h3 className="mb-2 line-clamp-2 flex-1 text-sm font-medium leading-snug">{p.name}</h3>
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="font-display text-lg font-extrabold text-[hsl(var(--brand))]">{fmt(p.price)}</span>
                  <span className="text-xs text-muted-foreground line-through">{fmt(p.old)}</span>
                </div>
                <Button size="sm" className="h-9 w-full rounded-lg bg-[hsl(var(--brand))] font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)]">
                  <Icon name="ShoppingCart" size={15} className="mr-1.5" /> В корзину
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <section className="container pt-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: 'Товары дня', d: 'Скидки до −70% каждый день', icon: 'Flame', bg: 'from-rose-500/90 to-orange-500/80' },
            { t: 'Новинки', d: 'Свежие поступления недели', icon: 'Sparkle', bg: 'from-[hsl(var(--brand))]/90 to-cyan-400/70' },
            { t: 'Рекомендуем', d: 'Подобрано лично для вас', icon: 'ThumbsUp', bg: 'from-violet-500/90 to-fuchsia-500/70' },
          ].map((b) => (
            <div key={b.t} className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${b.bg} p-6 text-white transition-transform hover:-translate-y-1`}>
              <Icon name={b.icon} size={28} />
              <h3 className="mt-3 font-display text-xl font-extrabold">{b.t}</h3>
              <p className="text-sm text-white/85">{b.d}</p>
              <Icon name={b.icon} size={110} className="absolute -bottom-6 -right-6 opacity-15" />
            </div>
          ))}
        </div>
      </section>

      {/* Become seller */}
      <section className="container pt-14">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-border bg-card p-8 md:grid-cols-2 md:p-12">
          <div>
            <Badge className="mb-4 rounded-full bg-[hsl(var(--brand))]/10 text-[hsl(var(--brand))]">Для бизнеса</Badge>
            <h2 className="font-display text-3xl font-extrabold text-balance">Продавайте на FAMIDZ</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Откройте магазин за 5 минут и получите доступ к миллионам покупателей по всей России. Удобная аналитика, чат и быстрый вывод средств.
            </p>
            <Button className="mt-6 h-12 rounded-xl bg-[hsl(var(--brand))] px-7 font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)] glow">
              Начать продавать <Icon name="ArrowRight" size={18} className="ml-1.5" />
            </Button>
          </div>
          <img src={PRODUCTS_IMG} alt="Товары" className="aspect-[4/3] w-full rounded-2xl border border-border object-cover" />
        </div>
      </section>

      {/* Payments */}
      <section className="container pt-14">
        <h2 className="mb-1 text-center font-display text-2xl font-extrabold">Удобные способы оплаты</h2>
        <p className="mb-7 text-center text-sm text-muted-foreground">Безопасные платежи с защитой каждой покупки</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {PAYMENTS.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-[hsl(var(--brand))]/50">
              <Icon name={p.icon} size={26} className="text-[hsl(var(--brand))]" />
              <span className="text-center text-xs font-medium">{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-[hsl(var(--brand-ink))] text-slate-400">
        <div className="container grid gap-10 py-14 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2 font-display text-xl font-extrabold text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg brand-gradient glow">F</span> FAMIDZ
            </div>
            <p className="text-sm text-slate-500">Всё, что нужно, в одном месте. Маркетплейс №1 для каждого. 🚀</p>
            <div className="mt-5 flex gap-3">
              {['Send', 'Instagram', 'Youtube'].map((s) => (
                <a key={s} href="#" className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 transition-colors hover:bg-[hsl(var(--brand))] hover:text-[hsl(var(--brand-ink))]">
                  <Icon name={s} size={17} />
                </a>
              ))}
            </div>
          </div>
          {[
            { t: 'Покупателям', l: ['Каталог', 'Акции', 'Доставка', 'Возврат', 'Отзывы'] },
            { t: 'Компания', l: ['О нас', 'Блог', 'Контакты', 'Вакансии', 'Партнёрам'] },
            { t: 'Поддержка', l: ['Помощь', 'FAQ', 'Стать продавцом', 'Безопасность', 'Условия'] },
          ].map((col) => (
            <div key={col.t}>
              <h4 className="mb-4 font-display font-bold text-white">{col.t}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.l.map((x) => (
                  <li key={x}><a href="#" className="transition-colors hover:text-[hsl(var(--brand))]">{x}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-500 md:flex-row">
            <span>© 2026 FAMIDZ. Все права защищены.</span>
            <span className="flex items-center gap-1.5"><Icon name="ShieldCheck" size={14} className="text-[hsl(var(--brand))]" /> Защищённые платежи · SSL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
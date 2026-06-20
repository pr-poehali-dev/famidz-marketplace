import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/context/StoreContext';

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const PAYMENT_METHODS = [
  { id: 'sbp', label: 'СБП', icon: 'QrCode' },
  { id: 'card', label: 'Банковская карта', icon: 'CreditCard' },
  { id: 'ymoney', label: 'ЮMoney', icon: 'Wallet' },
  { id: 'tbank', label: 'T-Bank', icon: 'Landmark' },
  { id: 'sberpay', label: 'SberPay', icon: 'BadgeRussianRuble' },
  { id: 'credit', label: 'Рассрочка 0%', icon: 'CalendarClock' },
];

const DELIVERY_METHODS = [
  { id: 'cdek', label: 'СДЭК', price: 299, days: '2–4 дня', icon: 'Package' },
  { id: 'boxberry', label: 'Boxberry', price: 249, days: '3–5 дней', icon: 'Box' },
  { id: 'post', label: 'Почта России', price: 199, days: '5–10 дней', icon: 'Mail' },
  { id: 'courier', label: 'Курьер', price: 499, days: 'Сегодня', icon: 'Bike' },
];

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, cartCount } = useStore();
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [payment, setPayment] = useState('card');
  const [delivery, setDelivery] = useState('cdek');
  const [ordered, setOrdered] = useState(false);
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });

  const deliveryCost = DELIVERY_METHODS.find((d) => d.id === delivery)?.price ?? 299;
  const discount = promoApplied ? Math.round(cartTotal * 0.1) : 0;
  const total = cartTotal - discount + deliveryCost;

  const applyPromo = () => {
    if (promo.toUpperCase() === 'FAMIDZ10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Промокод не найден');
    }
  };

  const handleOrder = () => {
    setOrdered(true);
    clearCart();
  };

  if (ordered) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground antialiased flex items-center justify-center">
        <div className="text-center max-w-md px-6 animate-scale-in">
          <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
            <Icon name="CheckCircle" size={48} />
          </div>
          <h1 className="font-display text-3xl font-extrabold">Заказ оформлен!</h1>
          <p className="mt-3 text-muted-foreground">Мы отправим вам уведомление на email. Ожидайте звонка от курьера.</p>
          <div className="mt-4 inline-block rounded-2xl border border-border bg-card px-6 py-3 text-sm text-muted-foreground">
            Номер заказа: <span className="font-bold text-[hsl(var(--brand))]">#FAMIDZ-{Math.floor(Math.random() * 90000) + 10000}</span>
          </div>
          <Button onClick={() => navigate('/')} className="mt-8 h-12 w-full rounded-xl bg-[hsl(var(--brand))] font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)]">
            На главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 font-display text-xl font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-xl brand-gradient text-white glow">F</span>
            FAMIDZ
          </button>
          <h1 className="ml-2 font-display text-lg font-bold">Корзина</h1>
          {cartCount > 0 && <Badge className="rounded-full bg-[hsl(var(--brand))]/15 text-[hsl(var(--brand))]">{cartCount} товара</Badge>}
          <button onClick={() => navigate(-1)} className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <Icon name="ArrowLeft" size={16} /> Назад
          </button>
        </div>
        {/* Steps */}
        <div className="container pb-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => setStep('cart')} className={`flex items-center gap-1.5 font-medium ${step === 'cart' ? 'text-[hsl(var(--brand))]' : 'text-muted-foreground'}`}>
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${step === 'cart' ? 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))]' : 'bg-secondary'}`}>1</span>
              Корзина
            </button>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
            <button onClick={() => cart.length > 0 && setStep('checkout')} className={`flex items-center gap-1.5 font-medium ${step === 'checkout' ? 'text-[hsl(var(--brand))]' : 'text-muted-foreground'}`}>
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${step === 'checkout' ? 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))]' : 'bg-secondary'}`}>2</span>
              Оформление
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="mb-5 grid h-24 w-24 place-items-center rounded-3xl bg-secondary text-muted-foreground/30">
              <Icon name="ShoppingCart" size={48} />
            </div>
            <h2 className="font-display text-2xl font-extrabold">Корзина пуста</h2>
            <p className="mt-2 text-muted-foreground">Добавьте товары из каталога</p>
            <Button onClick={() => navigate('/catalog')} className="mt-6 h-12 rounded-xl bg-[hsl(var(--brand))] px-8 font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)]">
              Перейти в каталог
            </Button>
          </div>
        ) : step === 'cart' ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-[hsl(var(--brand))]/30">
                  <div
                    className="h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-secondary"
                    onClick={() => navigate(`/product/${item.product.id}`)}
                  >
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-[hsl(var(--brand))]/30">
                        <Icon name={item.product.icon} size={34} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 min-w-0 flex-col gap-1">
                    <p className="line-clamp-2 text-sm font-medium leading-snug">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.product.brand} · {item.product.category}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-lg border border-border bg-secondary text-sm">
                        <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <Icon name="Minus" size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <Icon name="Plus" size={14} />
                        </button>
                      </div>
                      <span className="font-display text-lg font-extrabold text-[hsl(var(--brand))]">{fmt(item.product.price * item.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="self-start text-muted-foreground transition-colors hover:text-rose-400">
                    <Icon name="X" size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <h3 className="font-display font-bold">Промокод</h3>
                <div className="flex gap-2">
                  <Input
                    value={promo}
                    onChange={(e) => { setPromo(e.target.value); setPromoError(''); }}
                    placeholder="FAMIDZ10"
                    className="h-10 rounded-xl border-border bg-secondary text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                  />
                  <Button onClick={applyPromo} variant="outline" className="h-10 shrink-0 rounded-xl border-border px-4 text-sm">
                    Применить
                  </Button>
                </div>
                {promoApplied && <p className="text-xs text-emerald-400 flex items-center gap-1"><Icon name="Check" size={13} /> Скидка 10% применена</p>}
                {promoError && <p className="text-xs text-rose-400">{promoError}</p>}
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <h3 className="font-display font-bold">Итого</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Товары ({cartCount} шт.)</span>
                    <span>{fmt(cartTotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Скидка (промокод)</span>
                      <span>−{fmt(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Доставка</span>
                    <span>{fmt(deliveryCost)}</span>
                  </div>
                  <div className="my-2 border-t border-border" />
                  <div className="flex justify-between font-display text-xl font-extrabold">
                    <span>К оплате</span>
                    <span className="text-[hsl(var(--brand))]">{fmt(total)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setStep('checkout')}
                  className="mt-2 h-12 w-full rounded-xl bg-[hsl(var(--brand))] font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)] glow"
                >
                  Оформить заказ <Icon name="ArrowRight" size={18} className="ml-1.5" />
                </Button>
                <button onClick={() => navigate('/catalog')} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                  Продолжить покупки
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout */
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
              {/* Contact */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-display text-lg font-bold">Контактные данные</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { key: 'name', label: 'Имя', placeholder: 'Иван Иванов' },
                    { key: 'phone', label: 'Телефон', placeholder: '+7 (900) 000-00-00' },
                    { key: 'email', label: 'Email', placeholder: 'mail@example.com' },
                    { key: 'address', label: 'Адрес доставки', placeholder: 'г. Москва, ул. Примерная, д. 1' },
                  ].map((f) => (
                    <div key={f.key} className={f.key === 'address' ? 'sm:col-span-2' : ''}>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}</label>
                      <Input
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm((x) => ({ ...x, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="h-11 rounded-xl border-border bg-secondary"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <h3 className="font-display text-lg font-bold">Способ доставки</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {DELIVERY_METHODS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDelivery(d.id)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${delivery === d.id ? 'border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/10' : 'border-border hover:border-[hsl(var(--brand))]/40'}`}
                    >
                      <Icon name={d.icon} size={20} className={delivery === d.id ? 'text-[hsl(var(--brand))]' : 'text-muted-foreground'} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{d.label}</p>
                        <p className="text-xs text-muted-foreground">{d.days}</p>
                      </div>
                      <span className={`text-sm font-bold ${delivery === d.id ? 'text-[hsl(var(--brand))]' : 'text-muted-foreground'}`}>{fmt(d.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <h3 className="font-display text-lg font-bold">Способ оплаты</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayment(m.id)}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-colors ${payment === m.id ? 'border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/10 text-[hsl(var(--brand))]' : 'border-border text-muted-foreground hover:border-[hsl(var(--brand))]/40'}`}
                    >
                      <Icon name={m.icon} size={16} />
                      <span className="font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div className="sticky top-28 rounded-2xl border border-border bg-card p-5 space-y-3">
                <h3 className="font-display font-bold">Ваш заказ</h3>
                <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-2 text-sm">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-secondary">
                        {item.product.image ? (
                          <img src={item.product.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-[hsl(var(--brand))]/30">
                            <Icon name={item.product.icon} size={18} />
                          </div>
                        )}
                      </div>
                      <span className="flex-1 line-clamp-1 text-muted-foreground">{item.product.name} ×{item.qty}</span>
                      <span className="font-semibold">{fmt(item.product.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  {discount > 0 && <div className="flex justify-between text-emerald-400"><span>Промокод</span><span>−{fmt(discount)}</span></div>}
                  <div className="flex justify-between text-muted-foreground"><span>Доставка</span><span>{fmt(deliveryCost)}</span></div>
                  <div className="flex justify-between font-display text-xl font-extrabold">
                    <span>Итого</span>
                    <span className="text-[hsl(var(--brand))]">{fmt(total)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleOrder}
                  disabled={!form.name || !form.phone}
                  className="h-12 w-full rounded-xl bg-[hsl(var(--brand))] font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)] glow disabled:opacity-40"
                >
                  <Icon name="ShieldCheck" size={18} className="mr-2" /> Подтвердить заказ
                </Button>
                <p className="text-center text-xs text-muted-foreground">Нажимая кнопку, вы соглашаетесь с <span className="underline">условиями</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

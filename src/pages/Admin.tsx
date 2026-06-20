import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStore, Product } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['Электроника', 'Одежда', 'Обувь', 'Автотовары', 'Детские товары', 'Красота', 'Спорт', 'Дом и сад', 'Строительство', 'Услуги'];
const ICONS = ['Smartphone', 'Headphones', 'Watch', 'Tablet', 'Bot', 'Footprints', 'Sparkles', 'Shirt', 'Dumbbell', 'Baby', 'Home', 'Car', 'Hammer', 'Briefcase', 'Package'];

const EMPTY_FORM = {
  name: '', price: '', old: '', brand: '', category: CATEGORIES[0],
  tag: '', icon: 'Package', description: '', inStock: true, image: '',
};

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

export default function Admin() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      setForm((f) => ({ ...f, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (p: Product) => {
    setForm({
      name: p.name, price: String(p.price), old: String(p.old),
      brand: p.brand, category: p.category, tag: p.tag,
      icon: p.icon, description: p.description, inStock: p.inStock, image: p.image ?? '',
    });
    setImagePreview(p.image ?? '');
    setEditId(p.id);
    setActiveTab('edit');
  };

  const handleSave = () => {
    const product = {
      id: editId ?? Date.now(),
      name: form.name,
      price: Number(form.price),
      old: Number(form.old) || Number(form.price),
      brand: form.brand,
      category: form.category,
      tag: form.tag || 'Новинка',
      icon: form.icon,
      description: form.description,
      inStock: form.inStock,
      image: form.image,
      rating: 5.0,
      reviews: 0,
      specs: [],
    };
    if (editId) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setForm(EMPTY_FORM);
      setImagePreview('');
      setEditId(null);
      setActiveTab('list');
    }, 1200);
  };

  const f = (key: string, value: string | boolean) => setForm((x) => ({ ...x, [key]: value }));

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 font-display text-xl font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-xl brand-gradient text-white glow">F</span>
            FAMIDZ
          </button>
          <Badge className="rounded-full bg-violet-500/15 text-violet-400">Админ</Badge>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="ArrowLeft" size={16} /> На сайт
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { logout(); navigate('/admin-login'); }}
              className="rounded-xl border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
            >
              <Icon name="LogOut" size={15} className="mr-1.5" /> Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold">Управление товарами</h1>
            <p className="mt-1 text-sm text-muted-foreground">{products.length} товаров в каталоге</p>
          </div>
          <div className="flex gap-2">
            {(['list', 'add'] as const).map((t) => (
              <Button
                key={t}
                onClick={() => { setActiveTab(t); setEditId(null); setForm(EMPTY_FORM); setImagePreview(''); }}
                className={t === activeTab ? 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)]' : ''}
                variant={t === activeTab ? 'default' : 'outline'}
              >
                {t === 'list' ? <><Icon name="LayoutList" size={16} className="mr-1.5" />Список</> : <><Icon name="Plus" size={16} className="mr-1.5" />Добавить</>}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Всего товаров', value: products.length, icon: 'Package', color: 'text-[hsl(var(--brand))]' },
            { label: 'В наличии', value: products.filter((p) => p.inStock).length, icon: 'CheckCircle', color: 'text-emerald-400' },
            { label: 'Нет в наличии', value: products.filter((p) => !p.inStock).length, icon: 'XCircle', color: 'text-rose-400' },
            { label: 'Категорий', value: new Set(products.map((p) => p.category)).size, icon: 'LayoutGrid', color: 'text-violet-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <Icon name={s.icon} size={16} className={s.color} />
              </div>
              <div className={`mt-2 font-display text-3xl font-extrabold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {activeTab === 'list' && (
          <div>
            <div className="mb-4 relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию или бренду…"
                className="h-11 rounded-xl border-border bg-card pl-9"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Фото</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Товар</th>
                    <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">Категория</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Цена</th>
                    <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground sm:table-cell">Статус</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-secondary/30">
                      <td className="px-4 py-3">
                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-secondary">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-[hsl(var(--brand))]/30">
                              <Icon name={p.icon} size={22} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="line-clamp-1 font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{p.category}</td>
                      <td className="px-4 py-3 font-semibold text-[hsl(var(--brand))]">{fmt(p.price)}</td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <Badge className={`rounded-full text-xs ${p.inStock ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                          {p.inStock ? 'В наличии' : 'Нет'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => startEdit(p)} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-[hsl(var(--brand))]">
                            <Icon name="Pencil" size={15} />
                          </button>
                          <button onClick={() => deleteProduct(p.id)} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-rose-500/15 hover:text-rose-400">
                            <Icon name="Trash2" size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">Товары не найдены</div>
              )}
            </div>
          </div>
        )}

        {(activeTab === 'add' || activeTab === 'edit') && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-display font-bold">{activeTab === 'edit' ? 'Редактирование товара' : 'Новый товар'}</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Название товара *</label>
                    <Input value={form.name} onChange={(e) => f('name', e.target.value)} placeholder="Смартфон Pro Max 256GB" className="h-11 rounded-xl border-border bg-secondary" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Цена (₽) *</label>
                    <Input value={form.price} onChange={(e) => f('price', e.target.value)} placeholder="79990" type="number" className="h-11 rounded-xl border-border bg-secondary" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Старая цена (₽)</label>
                    <Input value={form.old} onChange={(e) => f('old', e.target.value)} placeholder="99990" type="number" className="h-11 rounded-xl border-border bg-secondary" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Бренд</label>
                    <Input value={form.brand} onChange={(e) => f('brand', e.target.value)} placeholder="TechPro" className="h-11 rounded-xl border-border bg-secondary" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Метка (тег)</label>
                    <Input value={form.tag} onChange={(e) => f('tag', e.target.value)} placeholder="Хит / -30% / Новинка" className="h-11 rounded-xl border-border bg-secondary" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Категория</label>
                    <select
                      value={form.category}
                      onChange={(e) => f('category', e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--brand))]"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Иконка (резервная)</label>
                    <select
                      value={form.icon}
                      onChange={(e) => f('icon', e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--brand))]"
                    >
                      {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Описание</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => f('description', e.target.value)}
                      placeholder="Краткое описание товара…"
                      rows={3}
                      className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--brand))] resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      onClick={() => f('inStock', !form.inStock)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${form.inStock ? 'bg-emerald-500/15 text-emerald-400' : 'bg-secondary text-muted-foreground'}`}
                    >
                      <span className={`flex h-4 w-4 items-center justify-center rounded border ${form.inStock ? 'border-emerald-400 bg-emerald-400' : 'border-border'}`}>
                        {form.inStock && <Icon name="Check" size={10} className="text-background" />}
                      </span>
                      В наличии
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo upload */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <h3 className="font-display font-bold">Фото товара</h3>

                <div
                  onClick={() => fileRef.current?.click()}
                  className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border transition-colors hover:border-[hsl(var(--brand))]/60 hover:bg-[hsl(var(--brand))]/5"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Icon name="ImagePlus" size={36} className="transition-colors group-hover:text-[hsl(var(--brand))]" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Нажмите для загрузки</p>
                        <p className="text-xs text-muted-foreground/70">JPG, PNG, WEBP до 10 МБ</p>
                      </div>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <p className="text-sm font-medium text-foreground">Изменить фото</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

                {imagePreview && (
                  <button
                    onClick={() => { setImagePreview(''); setForm((x) => ({ ...x, image: '' })); }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 py-2 text-xs text-rose-400 transition-colors hover:bg-rose-500/10"
                  >
                    <Icon name="Trash2" size={13} /> Удалить фото
                  </button>
                )}

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5"><Icon name="Check" size={12} className="text-emerald-400" /> Рекомендуемое соотношение 1:1</p>
                  <p className="flex items-center gap-1.5"><Icon name="Check" size={12} className="text-emerald-400" /> Белый или прозрачный фон</p>
                  <p className="flex items-center gap-1.5"><Icon name="Check" size={12} className="text-emerald-400" /> Минимум 800×800 пикселей</p>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={!form.name || !form.price}
                className={`h-12 w-full rounded-xl font-semibold disabled:opacity-40 ${saved ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)] glow'}`}
              >
                <Icon name={saved ? 'Check' : 'Save'} size={18} className="mr-2" />
                {saved ? 'Сохранено!' : activeTab === 'edit' ? 'Сохранить изменения' : 'Добавить товар'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
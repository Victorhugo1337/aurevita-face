import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Sparkles, ShieldCheck } from 'lucide-react'
import { ProductCard } from '../../components/ProductCard'
import { fetchProducts, deriveCategories } from '../../lib/products'
import { useStore } from '../../lib/store'

export function Home() {
  const { isAuthenticated } = useStore()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return

    setLoading(true)
    setError('')
    fetchProducts()
      .then((list) => {
        setProducts(list)
        setCategories(deriveCategories(list))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const featured = products.filter((p) => p.active).slice(0, 4)

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col flex-1">
        <section className="relative overflow-hidden bg-bone-100">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-6">
                — Plataforma B2B
              </p>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-moss-950 leading-[0.95] mb-8">
                Sua rede<br />
                <span className="italic text-moss-700">comercial</span> em<br />
                um só lugar.
              </h1>
              <p className="text-lg text-moss-700 max-w-md mb-8 leading-relaxed">
                Gerencie pedidos, produtos e equipe de distribuição
                com segurança e controle em tempo real.
              </p>
              <Link to="/login" className="btn-primary">
                Entrar na plataforma <ArrowRight size={16} />
              </Link>
            </div>

            <div className="md:col-span-5 relative h-[480px] hidden md:block">
              <div className="absolute top-0 right-0 w-64 h-80 bg-moss-700 rounded-xl2 rotate-3" />
              <div className="absolute bottom-0 left-0 w-56 h-72 bg-clay-500 rounded-xl2 -rotate-6" />
              <div className="absolute top-16 left-20 w-52 h-64 bg-bone-50 border border-moss-200 rounded-xl2 shadow-xl p-6 flex flex-col justify-end">
                <div className="text-xs font-mono text-moss-600 mb-2">AUREVITA / B2B</div>
                <div className="font-display text-2xl text-moss-950 leading-tight">Gestão de pedidos</div>
                <div className="text-sm text-moss-600 mt-1">Do cadastro à entrega</div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex-1 bg-moss-950 text-bone-100">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-3 gap-12">
            {[
              { icon: Leaf,        title: 'Rede integrada',       text: 'Representantes, distribuidores e filiais conectados.' },
              { icon: Sparkles,    title: 'Pedidos em tempo real', text: 'Acompanhe status, aprovações e entregas na hora.' },
              { icon: ShieldCheck, title: 'Acesso seguro',         text: 'Login com perfis e permissões por função.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon size={28} className="text-bone-50 mb-4" strokeWidth={1.4} />
                <h3 className="font-display text-2xl text-bone-50 mb-2">{title}</h3>
                <p className="text-bone-200 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <>
      <section className="relative overflow-hidden bg-bone-100">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-6">
              — Nutrition for life
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-moss-950 leading-[0.95] mb-8">
              O equilíbrio<br />
              <span className="italic text-moss-700">começa</span> com<br />
              o que você escolhe.
            </h1>
            <p className="text-lg text-moss-700 max-w-md mb-8 leading-relaxed">
              Suplementos naturais formulados para apoiar sua rotina —
              sem promessas vazias, com ingredientes que você consegue pronunciar.
            </p>
            <Link to="/loja" className="btn-primary">
              Ver produtos <ArrowRight size={16} />
            </Link>
          </div>

          <div className="md:col-span-5 relative h-[480px] hidden md:block">
            <div className="absolute top-0 right-0 w-64 h-80 bg-moss-700 rounded-xl2 rotate-3" />
            <div className="absolute bottom-0 left-0 w-56 h-72 bg-clay-500 rounded-xl2 -rotate-6" />
            <div className="absolute top-16 left-20 w-52 h-64 bg-bone-50 border border-moss-200 rounded-xl2 shadow-xl p-6 flex flex-col justify-end">
              <div className="text-xs font-mono text-moss-600 mb-2">CATÁLOGO / 2026</div>
              <div className="font-display text-2xl text-moss-950 leading-tight">Linha Presence</div>
              <div className="text-sm text-moss-600 mt-1">Suplementos e nutrição</div>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Linhas</p>
              <h2 className="font-display text-4xl text-moss-950">Para cada momento.</h2>
            </div>
            <Link to="/loja" className="text-sm text-moss-700 hover:text-moss-900 hidden md:inline">
              ver tudo →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/loja?cat=${cat.slug}`}
                className="group card p-6 hover:bg-moss-900 hover:text-bone-50 transition-all"
              >
                <span className="text-xs font-mono text-moss-500 group-hover:text-bone-200">
                  0{i + 1}
                </span>
                <h3 className="font-display text-2xl mt-3 mb-2 leading-tight">{cat.name}</h3>
                <ArrowRight size={16} className="mt-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-moss-950 text-bone-100">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-12">
          {[
            { icon: Leaf,        title: 'Ingredientes selecionados', text: 'Fórmulas curtas, sem aditivos desnecessários.' },
            { icon: Sparkles,    title: 'Fórmulas inovadoras',       text: 'Desenvolvidas com base em ciência e tradição.' },
            { icon: ShieldCheck, title: 'Qualidade garantida',       text: 'Produção e controle rigorosos em todas as etapas.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon size={28} className="text-bone-50 mb-4" strokeWidth={1.4} />
              <h3 className="font-display text-2xl text-bone-50 mb-2">{title}</h3>
              <p className="text-bone-200 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">Destaques</p>
            <h2 className="font-display text-4xl text-moss-950">Mais buscados.</h2>
          </div>
          <Link to="/loja" className="text-sm text-moss-700 hover:text-moss-900">ver tudo →</Link>
        </div>

        {loading && <p className="text-moss-600 text-sm">Carregando produtos…</p>}
        {error && <p className="text-clay-600 text-sm">{error}</p>}

        {featured.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </>
  )
}

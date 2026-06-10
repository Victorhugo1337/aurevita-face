import { Construction } from 'lucide-react'

function Placeholder({ kicker, title, description }) {
  return (
    <div className="p-10">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-moss-600 mb-2">{kicker}</p>
        <h1 className="font-display text-4xl text-moss-950">{title}</h1>
      </div>
      <div className="card p-16 text-center">
        <Construction size={32} className="mx-auto text-moss-400 mb-4" strokeWidth={1.4} />
        <p className="text-moss-700 font-display text-2xl mb-2">Em construção</p>
        <p className="text-moss-600 text-sm max-w-md mx-auto">{description}</p>
      </div>
    </div>
  )
}

export function AdminCustomers() {
  return (
    <Placeholder
      kicker="Base"
      title="Clientes"
      description="Lista de clientes, histórico de pedidos e segmentação. Aguardando endpoint GET /api/customers do back-end."
    />
  )
}

export function AdminSettings() {
  return (
    <Placeholder
      kicker="Sistema"
      title="Configurações"
      description="Configurações da loja: dados da empresa, métodos de pagamento, fretes e usuários do painel."
    />
  )
}

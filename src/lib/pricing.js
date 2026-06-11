import { ROLES } from './roles'

function isPartnerSpecific(price) {
  return Boolean(
    price?.idRepresentant ||
    price?.idDistributor ||
    price?.idDirector ||
    price?.idSeniorDirector
  )
}

/** Escolhe o preço negociado (product_prices) aplicável ao parceiro logado. */
export function findNegotiatedPrice(prices, user) {
  if (!prices?.length || !user) return null

  const list = prices.filter((p) => p?.id != null && p.price != null)

  const byRepresentant = list.find(
    (p) => user.idRepresentant && p.idRepresentant === user.idRepresentant
  )
  if (byRepresentant) return byRepresentant

  const byDistributor = list.find(
    (p) =>
      !p.idRepresentant &&
      user.idDistributor &&
      p.idDistributor === user.idDistributor
  )
  if (byDistributor) return byDistributor

  const byDirector = list.find(
    (p) =>
      !p.idRepresentant &&
      !p.idDistributor &&
      user.idDirector &&
      p.idDirector === user.idDirector
  )
  if (byDirector) return byDirector

  const bySenior = list.find(
    (p) =>
      !p.idRepresentant &&
      !p.idDistributor &&
      !p.idDirector &&
      user.idSeniorDirector &&
      p.idSeniorDirector === user.idSeniorDirector
  )
  if (bySenior) return bySenior

  const role = user.role
  if (!role || role === ROLES.ADMIN) return null

  return (
    list.find(
      (p) => !isPartnerSpecific(p) && p.type?.toUpperCase() === role
    ) ?? null
  )
}

/**
 * Combina tabela padrão (products.*Price) com exceção negociada (product_prices).
 * Checkout: enviar idPrice só quando priceSource === 'negotiated'.
 */
export function resolveProductPricing(apiProduct, user) {
  const standardPrice = Number(apiProduct?.price ?? 0)
  const priceLevel = apiProduct?.priceLevel ?? null
  const priceLevelLabel = apiProduct?.priceLevelLabel ?? null
  const negotiated = findNegotiatedPrice(apiProduct?.prices, user)

  if (negotiated) {
    return {
      price: Number(negotiated.price),
      priceId: negotiated.id,
      priceSource: 'negotiated',
      priceLevel,
      priceLevelLabel: priceLevelLabel
        ? `${priceLevelLabel} · negociado`
        : 'Preço negociado',
      standardPrice,
    }
  }

  return {
    price: standardPrice,
    priceId: null,
    priceSource: 'standard',
    priceLevel,
    priceLevelLabel,
    standardPrice,
  }
}

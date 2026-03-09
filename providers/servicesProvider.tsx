// app/providers/services-provider.tsx
"use client"

import { PurchaseOrderRepository } from "@/repositories/frontend/purchaseOrderRepository"
import { ArticleRepository } from "@/repositories/frontend/articleRepository"
import { ArticleService } from "@/services/frontend/articleService"
import { PurchaseOrderService } from "@/services/frontend/purchaseOrderService"
import { createContext } from "react"

interface ServicesContextType {
  articleService: ArticleService,
  purchaseOrderService: PurchaseOrderService,
}

export const ServicesContext = createContext<ServicesContextType | null>(null)

export function ServicesProvider({ children }: { children: React.ReactNode }) {

  const services = {
    articleService: new ArticleService(new ArticleRepository()),
    purchaseOrderService: new PurchaseOrderService(new PurchaseOrderRepository()),
  }

  return (
    <ServicesContext.Provider value={services!}>
      {children}
    </ServicesContext.Provider>
  )
}
import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
  {
    routeLink: '/general/operations/home',
    icon: 'home',
    label: 'Home'
  },
  {
    routeLink: '/general/operations/accounts',
    icon: 'article',
    label: 'Catálogo de cuentas'
  },
  {
    routeLink: '/general/operations/taxes',
    icon: 'monetization_on',
    label: 'Impuestos'
  },
  {
    routeLink: '/general/operations/third-parties',
    icon: 'groups',
    label: 'Terceros'
  },
  {
    routeLink: '/general/operations/products',
    icon: 'inventory_2',
    label: 'Inventario',
    items: [
      {
        routeLink: '/general/operations/products',
        label: 'Productos',
      },
      {
        routeLink: '/general/operations/product-types',
        label: 'Tipo de Productos',
      },
      {
        routeLink: '/general/operations/categories',
        label: 'Categorías',
      },
      {
        routeLink: '/general/operations/unities',
        label: 'Unidades de Medida',
      }
    ]
  },
  {
    routeLink: '/general/operations/invoice',
    icon: 'receipt_long',
    label: 'Facturas',
    items: [
      {
        routeLink: '/general/operations/invoice',
        label: 'Factura de compra'
      }
    ]
  }
]

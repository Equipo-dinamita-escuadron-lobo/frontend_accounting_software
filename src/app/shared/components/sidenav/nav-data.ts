import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
  {
    routeLink: '/general/operations/home',
    icon: 'home',
    label: 'Home'
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
      }
    ]
  },
]

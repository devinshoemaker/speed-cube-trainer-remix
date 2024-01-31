export interface Case {
  id?: number;
  name: string;
  group: 'Dot';
  algorithm: string;
  image: string;
  status?: string;
}

export const olls: Case[] = [
  {
    name: '1',
    group: 'Dot',
    algorithm: `R U2 R2 F R F' U2 R' F R F'`,
    image: '/images/oll/1.png',
  },
  {
    name: '2',
    group: 'Dot',
    algorithm: `F R U R' U' F' f R U R' U' f'`,
    image: '/images/oll/2.png',
  },
  {
    name: '3',
    group: 'Dot',
    algorithm: `r' R2 U R' U r U2 r' U M'`,
    image: '/images/oll/3.png',
  },
  {
    name: '4',
    group: 'Dot',
    algorithm: `M U' r U2 r' U' R U' R' M'`,
    image: '/images/oll/4.png',
  },
];

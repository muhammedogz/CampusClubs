import { kulupler } from 'src/data/kulupler';
import { RolesEnum, UyeType } from 'src/types/types';

export const uyeler: UyeType[] = [
  {
    id: 1,
    name: 'Muhammed Oğuz',
    image:
      'https://cdn.pixabay.com/photo/2021/08/25/15/21/man-6576565_960_720.png',
    slug: 'muhammed-oguz',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'Bilgisayar Mühendisliği',
    kulup: kulupler[0],
    role: RolesEnum.UYE,
  },
  {
    id: 2,
    name: 'Ayşe Kaya',
    image:
      'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png',
    slug: 'ayse-kaya',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'Endüstri Mühendisliği',
    kulup: kulupler[0],
    role: RolesEnum.UYE,
  },
  {
    id: 3,
    name: 'Kadir Demir',
    image:
      'https://cdn.pixabay.com/photo/2016/03/31/20/27/avatar-1295773_960_720.png',
    slug: 'kadir-demir',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'Makine Mühendisliği',
    kulup: kulupler[1],
    role: RolesEnum.UYE,
  },
  {
    id: 4,
    name: 'Fatma Yılmaz',
    image:
      'https://cdn.pixabay.com/photo/2017/01/31/19/07/avatar-2026510_960_720.png',
    slug: 'fatma-yilmaz',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'İnşaat Mühendisliği',
    kulup: kulupler[1],
    role: RolesEnum.UYE,
  },
  {
    id: 5,
    name: 'Emre Şahin',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_960_720.png',
    slug: 'emre-sahin',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'Elektrik Elektronik Mühendisliği',
    kulup: kulupler[2],
    role: RolesEnum.UYE,
  },
  {
    id: 6,
    name: 'Suleyman Golbol',
    image:
      'https://cdn.pixabay.com/photo/2021/08/25/15/21/man-6576565_960_720.png',
    slug: 'suleyman-golbol',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'Bilgisayar Mühendisliği',
    kulup: kulupler[2],
    role: RolesEnum.UYE,
  },
];

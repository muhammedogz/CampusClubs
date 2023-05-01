import { kulupler } from 'src/data/kulupler';
import { EtkinlikType } from 'src/types/types';

export const events: EtkinlikType[] = [
  {
    name: 'Geekday 2021',
    date: 'Mayıs 2021',
    location: 'Online Youtube',
    type: 'Workshop',
    description: 'Geekday 2021',
    id: 1,
    image: 'https://abl.gtu.edu.tr/resimler/104/t_10416.jpg?',
    slug: 'geekday-2021',
    kulup: kulupler[0],
  },
  {
    name: 'Startup Weekend Istanbul',
    date: 'June 2023',
    location: 'Istanbul, Turkey',
    type: 'Hackathon',
    description:
      'An event where entrepreneurs come together to pitch ideas, form teams, and build prototypes over the course of a weekend.',
    id: 2,
    image:
      'https://cdn.pixabay.com/photo/2016/11/08/05/26/startup-1807545_960_720.jpg',
    slug: 'startup-weekend-istanbul',
    kulup: kulupler[1],
  },
  {
    name: 'Women in Tech Conference',
    date: 'September 2023',
    location: 'San Francisco, USA',
    type: 'Conference',
    description:
      'A conference that brings together women in technology to network, learn, and share ideas.',
    id: 3,
    image:
      'https://cdn.pixabay.com/photo/2018/08/08/14/10/conference-3593087_960_720.jpg',
    slug: 'women-in-tech-conference',
    kulup: kulupler[2],
  },
  {
    name: 'CodeCamp',
    date: 'July 2023',
    location: 'Boston, USA',
    type: 'Workshop',
    description:
      'A workshop where participants learn to code and build projects in a collaborative environment.',
    id: 4,
    image:
      'https://cdn.pixabay.com/photo/2017/07/31/11/46/laptop-2557586_960_720.jpg',
    slug: 'codecamp',
    kulup: kulupler[2],
  },
  {
    name: 'DevOpsDays London',
    date: 'October 2023',
    location: 'London, UK',
    type: 'Conference',
    description:
      'A conference focused on DevOps practices, tools, and culture.',
    id: 5,
    image:
      'https://cdn.pixabay.com/photo/2016/11/19/22/32/data-1845504_960_720.jpg',
    slug: 'devopsdays-london',
    kulup: kulupler[2],
  },
  {
    name: 'Artificial Intelligence Summit',
    date: 'August 2023',
    location: 'Tokyo, Japan',
    type: 'Summit',
    description:
      'A summit exploring the latest trends and innovations in artificial intelligence.',
    id: 6,
    image:
      'https://cdn.pixabay.com/photo/2018/05/28/14/19/ai-3436190_960_720.jpg',
    slug: 'artificial-intelligence-summit',
    kulup: kulupler[2],
  },
  {
    name: 'Data Science Bootcamp',
    date: 'May 2023',
    location: 'Toronto, Canada',
    type: 'Bootcamp',
    description:
      'A bootcamp designed to teach participants the fundamentals of data science and machine learning.',
    id: 7,
    image:
      'https://cdn.pixabay.com/photo/2017/08/06/11/16/code-2588852_960_720.jpg',
    slug: 'data-science-bootcamp',
    kulup: kulupler[2],
  },
];

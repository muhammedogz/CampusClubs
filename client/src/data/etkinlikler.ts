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
    image: 'https://picsum.photos/200/800',
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
    image: 'https://picsum.photos/200/350',
    slug: 'startup-weekend-istanbul',
    kulup: kulupler[0],
  },
  {
    name: 'Women in Tech Conference',
    date: 'September 2023',
    location: 'San Francisco, USA',
    type: 'Conference',
    description:
      'A conference that brings together women in technology to network, learn, and share ideas.',
    id: 3,
    image: 'https://picsum.photos/205/300',
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
    image: 'https://picsum.photos/200/700',
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
    image: 'https://picsum.photos/250/300',
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
    image: 'https://picsum.photos/200/310',
    slug: 'artificial-intelligence-summit',
    kulup: kulupler[0],
  },
  {
    name: 'Data Science Bootcamp',
    date: 'May 2023',
    location: 'Toronto, Canada',
    type: 'Bootcamp',
    description:
      'A bootcamp designed to teach participants the fundamentals of data science and machine learning.',
    id: 7,
    image: 'https://picsum.photos/255/300',
    slug: 'data-science-bootcamp',
    kulup: kulupler[2],
  },
];

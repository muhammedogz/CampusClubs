import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [name, setName] = useState('John Doe');

  useEffect(() => {
    if (name) {
      console.log('hello');
    }
  }, []);

  return <div>sa</div>;
}

import { Flex, useColorModeValue } from '@chakra-ui/react';
import { Head } from '@/components/Head/Head';
import { useEffect } from 'react';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  heading: string;
};

export const Layout = ({ title, children, heading }: LayoutProps) => {
  useEffect(() => {
    console.log(title, 'mounted');
  }, []);

  return (
    <>
      <Head title={title}></Head>
      
      <Flex id='search-layout' className='min-h-screen flex-col items-center justify-center gap-8 p-4' bg={useColorModeValue('gray.50', 'gray.800')}>
        <h1 className='text-center text-2xl md:text-3xl lg:text-4xl font-semibold'>{heading}</h1>
        {children}
      </Flex>
    </>
  );
};

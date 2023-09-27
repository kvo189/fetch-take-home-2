import { Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import { Head } from '@/components/Head/Head';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  heading: string;
};

export const Layout = ({ title, children, heading }: LayoutProps) => {
  return (
    <>
      <Head title={title}></Head>
      <Flex id='auth-layout' className='flex-col h-screen items-center justify-center gap-8' bg={useColorModeValue('gray.50', 'gray.800')}>
        <Heading fontSize={'4xl'}>{heading}</Heading>
        {children}
      </Flex>
    </>
  );
};

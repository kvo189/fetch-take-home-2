import { Flex, useColorModeValue } from '@chakra-ui/react';
import { Head } from '@/components/Head/Head';

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
  headingClassName?: string;
  heading: string;
  id?: string;
};

export const ContentLayout = ({ id, title, children, heading, headingClassName }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title}></Head>
      
      <Flex id={id} className='min-h-screen flex-col items-center justify-center gap-8 p-4' bg={useColorModeValue('gray.50', 'gray.800')}>
        <h1 className={headingClassName ? headingClassName :`text-center text-2xl md:text-3xl lg:text-4xl font-semibold`}>{heading}</h1>
        {children}
      </Flex>
    </>
  );
};

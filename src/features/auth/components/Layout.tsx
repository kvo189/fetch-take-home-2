import { Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import { Head } from '@/components/Head/Head';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  heading: string;
};
/**
 * Layout Component.
 * 
 * A flexible layout structure to wrap content in. Uses Chakra UI for styling.
 * - Contains a heading at the top, followed by children content.
 * - Configurable title and heading.
 * 
 * Props:
 * - `children`: Content inside the layout.
 * - `title`: Title for the Head component.
 * - `heading`: Text for the heading of the layout.
 */
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

import {
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface SearchDrawerProps {
  header: string;
  drawerText: string;
  Body: ReactNode;
  Footer: ReactNode;
}

export const SearchDrawer = ({ header, Body, Footer, drawerText }: SearchDrawerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDrawer = useBreakpointValue({ base: true, lg: false });

  return isDrawer ? (
    <>
      <Button onClick={onOpen}>{drawerText}</Button>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{header}</DrawerHeader>
          <DrawerBody>{Body}</DrawerBody>
          <DrawerFooter>{Footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  ) : (
    <VStack spacing={2} alignItems={'center'} maxHeight={'100vh'}>
      <div className='sticky top-0 flex flex-col items-center justify-center p-4'>
        {Body}
        {Footer}
      </div>
    </VStack>
  );
};

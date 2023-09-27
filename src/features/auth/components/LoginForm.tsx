import { useEffect, useState } from 'react';
import { Box, FormControl, FormLabel, Input, Checkbox, Stack, Button, useColorModeValue, useToast } from '@chakra-ui/react';
import { loginWithNameAndEmail } from '../api/authService';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Added rememberMe state
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Load saved values from local storage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('rememberedName');
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedName && storedEmail) {
      setName(storedName);
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const loginDisabled = email === '' || name === '';

  const handleLogin = () => {
    if (loginDisabled) {
      return alert('Please fill in your name and email address.');
    }
    setIsLoading(true); // Set loading to true when login starts
    loginWithNameAndEmail({ name, email })
      .then(() => onLoginSuccess())
      .catch((error: any) => {
        toast({
          title: 'Sign In Error',
          description: error.message || 'Failed to sign in. Please try again.', // or a generic message if error.message is undefined
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  };

  const onLoginSuccess = () => {
    if (rememberMe) {
      // If "Remember me" is checked, store the values in local storage
      localStorage.setItem('rememberMe', JSON.stringify(rememberMe));
      localStorage.setItem('rememberedName', name);
      localStorage.setItem('rememberedEmail', email);
    } else {
      // If not checked, remove the values from local storage
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedName');
      localStorage.removeItem('rememberedEmail');
    }

    onSuccess(); // Call the onSuccess function passed in as a prop
  };

  return (
    <Box id='login-form' rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
      <Stack spacing={4}>
        <FormControl id='name'>
          <FormLabel>Name</FormLabel>
          <Input type='text' value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl id='email'>
          <FormLabel>Email</FormLabel>
          <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <Stack spacing={10}>
          <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
            <Checkbox
              isChecked={rememberMe}
              onChange={() => {
                if (rememberMe) {
                  localStorage.removeItem('rememberedName');
                  localStorage.removeItem('rememberedEmail');
                }
                setRememberMe(!rememberMe);
              }}
            >
              Remember me
            </Checkbox>
          </Stack>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{ bg: 'blue.500' }}
            onClick={handleLogin}
            isDisabled={loginDisabled}
            isLoading={isLoading}
            loadingText='Signing in...'
            colorScheme='blue'
          >
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

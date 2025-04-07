import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase/firebaseConfig';

const testSend = async () => {
  const sendPin = httpsCallable(functions, 'sendVerificationPin');
  await sendPin({
    email: 'yourtestemail@gmail.com',
    userId: 'test123',
    username: 'TestUser',
  });
};

testSend();

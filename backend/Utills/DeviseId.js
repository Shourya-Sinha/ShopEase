import { v4 as uuidv4 } from 'uuid';

const generateDeviceId = () => {
    // Generate a unique device ID
    return uuidv4();
  };



  export default generateDeviceId;
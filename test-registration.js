const axios = require('axios');

async function testRegistration() {
  try {
    const testData = {
      name: 'sumeet',
      email: 'sumeet@gmail.com',
      password: 'Sakshi@90',
      phone: '', // Empty phone number
      address: 'Enter your address'
    };

    console.log('Testing registration with data:', testData);

    const response = await axios.post('http://localhost:5000/api/auth/register', testData);
    console.log('Registration successful:', response.data);
  } catch (error) {
    console.error('Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Details:', error.response?.data?.details);
  }
}

testRegistration();

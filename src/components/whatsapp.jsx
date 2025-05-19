const fetchTemplates = async () => {
  try {
    const response = await axios.get('/api/templates', {
      headers: {
        Authorization: `Bearer ${token}` // Make sure you're sending the auth token
      }
    });
    setTemplates(response.data);
  } catch (error) {
    console.error('Failed to fetch templates', error);
  }
};
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const PLANT_ID_API_KEY = process.env.PLANT_ID_API_KEY; // Store your key in .env

// Analyze plant disease using Plant.id API
async function analyzePlantDisease(imagePath) {
  const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

  const response = await axios.post(
    'https://plant.id/api/v2/health_assessment',
    {
      images: [imageBase64],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANT_ID_API_KEY,
      },
    }
  );

  console.log('Plant.id API response:', response.data);

  const suggestions = response.data?.health_assessment?.diseases || [];

  if (suggestions.length > 0) {
    const disease = suggestions[0].name;

    let treatment = 'No treatment advice available.';

    if (suggestions[0].treatment) {
      if (suggestions[0].treatment.advice) {
        treatment = suggestions[0].treatment.advice;
      } else if (Array.isArray(suggestions[0].treatment.recommendations) && suggestions[0].treatment.recommendations.length > 0) {
        treatment = suggestions[0].treatment.recommendations.join(', ');
      }
    }

    return { disease, treatment };
  }

  // هذا الـ return كان ناقص — السبب في الـ syntax error
  return { disease: 'Healthy or unknown', treatment: 'No disease detected.' };
}


exports.detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const imagePath = path.join(__dirname, '../uploads', req.file.filename);
    console.log('API KEY:', PLANT_ID_API_KEY ? 'SET' : 'NOT SET');
    console.log('Image path:', imagePath);
    const result = await analyzePlantDisease(imagePath);

    // Clean up the uploaded file
    fs.unlinkSync(imagePath);

    res.json(result);
  } catch (error) {
    console.error('PlantDiseaseController error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error analyzing image', error: error.message });
  }
};

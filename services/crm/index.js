const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('CRM Microservice is running. API endpoints: /api/crm/customers, /api/crm/health');
});

app.get('/api/crm/customers', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Customer A', status: 'Active' },
      { id: 2, name: 'Customer B', status: 'Lead' }
    ]
  });
});

app.get('/api/crm/health', (req, res) => {
  res.json({ status: 'CRM Service is running' });
});

app.listen(PORT, () => {
  console.log(`CRM Service listening on port ${PORT}`);
});

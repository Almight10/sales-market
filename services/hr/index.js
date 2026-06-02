const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
  res.send('HR Microservice is running. API endpoints: /api/hr/employees, /api/hr/health');
});

app.get('/api/hr/employees', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'John Doe', position: 'Manager' },
      { id: 2, name: 'Jane Smith', position: 'Developer' }
    ]
  });
});

app.get('/api/hr/health', (req, res) => {
  res.json({ status: 'HR Service is running' });
});

app.listen(PORT, () => {
  console.log(`HR Service listening on port ${PORT}`);
});

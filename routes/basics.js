const express = require('express');
const fs = require('fs');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const filePath = './customer.json';

router.get('/', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, jsonString) => {
        if (err) {
            console.log('File read failed:', err);
            res.status(500).send('Error reading customer data.');
            return;
        }
        try {
            const customerData = JSON.parse(jsonString);
            res.send(customerData);
        } catch (err) {
            console.log('Error parsing JSON string:', err);
            res.status(500).send('Error parsing customer data.');
        }
    });
});

router.post('/add', (req, res) => {
    try {
        const newCustomer = {
            Name: req.body.Name,
            Count: req.body.Count,
            Location: req.body.Location
        };
        const customerData = JSON.parse(fs.readFileSync(filePath, 'utf8')) || [];
        customerData.push(newCustomer);
        fs.writeFileSync(filePath, JSON.stringify(customerData, null, 2), 'utf8');

        res.send({ message: 'Customer data added successfully.', customer: newCustomer });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('An error occurred while adding customer data.');
    }
});


router.put('/update/:name', (req, res) => {
  const customerNameToUpdate = req.params.name;
  const updatedData = req.body;

  try {
      const customerData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      let customerUpdated = false;

      customerData.forEach(customer => {
          if (customer.Name === customerNameToUpdate) {
              for (const key in updatedData) {
                  customer[key] = updatedData[key];
              }
              customerUpdated = true;
          }
      });

      if (customerUpdated) {
          fs.writeFileSync(filePath, JSON.stringify(customerData, null, 2), 'utf8');
          res.send(`Customer data with name ${customerNameToUpdate} updated successfully.`);
      } else {
          res.status(404).send(`Customer with name ${customerNameToUpdate} not found.`);
      }
  } catch (error) {
      console.log('Error:', error);
      res.status(500).send('An error occurred while updating customer data.');
  }
});

router.delete('/delete/:name', (req, res) => {
  const customerNameToDelete = req.params.name;

  try {
      // Check if the file exists
      if (fs.existsSync(filePath)) {
          // Read the existing customer data from 'customer.json'
          const customerData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

          // Use filter to create a new array excluding the customer with the provided name
          const filteredCustomers = customerData.filter(customer => customer.Name !== customerNameToDelete);

          if (filteredCustomers.length < customerData.length) {
              // Write the updated data back to 'customer.json'
              fs.writeFileSync(filePath, JSON.stringify(filteredCustomers, null, 2), 'utf8');
              res.send(`Customer with name ${customerNameToDelete} deleted successfully.`);
          } else {
              res.status(404).send(`Customer with name ${customerNameToDelete} not found.`);
          }
      } else {
          res.status(404).send('File not found.');
      }
  } catch (error) {
      console.log('Error:', error);
      res.status(500).send('An error occurred while deleting customer data.');
  }
});


module.exports = router;

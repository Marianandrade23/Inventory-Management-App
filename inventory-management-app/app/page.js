"use client";
import { useState, useEffect } from 'react';
import { firestore } from '.././././../firebase'; // Ensure this path is correct
import { getDocs, collection, query, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'; // Import required Firestore functions
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';

// Custom Label
const CustomLabel = ({ x, y, value }) => {
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={16}
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
    >
      {value}
    </text>
  );
};

const CircleChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const formattedData = data.map((item) => ({
      name: item.name,
      value: item.quantity,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }));
    setChartData(formattedData);
  }, [data]);

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        outerRadius={150}
        innerRadius={70}
        paddingAngle={5}
        label={<CustomLabel />}
        labelLine={false}
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Legend layout="vertical" verticalAlign="middle" align="right" />
    </PieChart>
  );
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // Handle the error appropriately, e.g., display an error message to the user
    }
  };

  const addItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      style={{ backgroundColor: 'black' }}
    >
      {/* Title */}
      <Typography
        variant="h2"
        color="white"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        marginBottom={2}
      >
        Inventory Dashboard
      </Typography>

      <Box
        width="90%"
        display="flex"
        justifyContent="space-between"
        gap={2}
      >
        <Box
          width="45%" // Adjusted width
          height="70vh" // Adjusted height
          display="flex"
          flexDirection="column"
          gap={2}
          bgcolor="#f5f5f5" // Light background for contrast
          padding={2}
          borderRadius={4}
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
          overflow="hidden" // Ensure content stays within bounds
        >
          {/* Left Box for Statistics */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="h4"
              color="#333"
              marginBottom={2}
              fontFamily="Arial, sans-serif"
              textAlign="center" //center the title text
            >
              Inventory Statistics
            </Typography>
            <Box
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {/* Circle Graphic Component */}
              <CircleChart data={inventory} />
            </Box>
          </Box>
        </Box>

        <Box
          width="45%" // Adjusted width
          height="70vh" // Adjusted height
          display="flex"
          flexDirection="column"
          gap={2}
          bgcolor="#f5f5f5" // Light background for contrast
          padding={2}
          borderRadius={4}
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
        >
          {/* Updated Right Box for Inventory List */}
          <Stack
            width="100%"
            height="100%"
            bgcolor="white"
            borderRadius={4}
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            padding={2}
            spacing={2}
            overflow="auto"
          >
            <Stack
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Typography
                variant="h4"
                color="#333"
                fontFamily="Arial, sans-serif"
              >
                Inventory List
              </Typography>
              <Button
                variant="contained"
                style={{ backgroundColor: 'black', color: 'white' }} // Black button with white text
                onClick={() => handleOpen()}
              >
                Add New Item
              </Button>
            </Stack>
            <Stack
              width="100%"
              spacing={2}
            >
              {inventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="80px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="white"
                  padding={2}
                  border="1px solid #ccc"
                  borderRadius={4}
                >
                  <Typography
                    variant="h5"
                    color="#333"
                    fontFamily="Arial, sans-serif"
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                      variant="outlined"
                      onClick={() => removeItem(name)}
                      disabled={quantity <= 0}
                    >
                      -
                    </Button>
                    <Typography
                      variant="h5"
                      color="#333"
                      fontFamily="Arial, sans-serif"
                    >
                      {quantity}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => addItem(name)}
                    >
                      +
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Modal for Adding New Item */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          width="400px"
          margin="auto"
          padding={4}
          bgcolor="white"
          borderRadius={4}
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography
            variant="h5"
            id="modal-title"
            marginBottom={2}
            fontFamily="Arial, sans-serif"
          >
            Add New Item
          </Typography>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (itemName) {
                addItem(itemName);
                setItemName('');
                handleClose();
              }
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

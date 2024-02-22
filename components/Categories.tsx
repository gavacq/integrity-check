'use client'
import { useEffect, useState } from 'react';
import { DBSchema, openDB } from 'idb';

interface MyDB extends DBSchema {
  'categories': {
    value: {
      name: string;
      weight: number;
    };
    key: string;
    // Define any indexes here if needed
  };
  // You can add more stores here if needed
}

async function setupDB() {
  const db = await openDB<MyDB>('MyDatabase', 1, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore('categories', {
        // The 'id' property of the object will be the key.
        keyPath: 'id',
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      // You can create indexes here if needed
    },
  });

  // You can add more setup logic here if needed
}


// Now your db object is strongly typed
// Example of adding a category
async function addCategory(name: string, weight: number) {
  const db = await openDB<MyDB>('MyDatabase', 1);
  await db.add('categories', { name, weight });
}


const Categories = () => {
  const [categories, setCategories] = useState<Array<{name: string, weight: number}>>([]);
  const [showInputs, setShowInputs] = useState(false);
  const [newName, setNewName] = useState('');
  const [newWeight, setNewWeight] = useState('');

  useEffect(() => {
    const fetchData = async () => {
    // Use this function to setup your DB
      await setupDB()
      // Open the database
      const db = await openDB('MyDatabase', 1); // Replace with your database name and version

      // Read all categories from the store
      const tx = db.transaction('categories', 'readonly'); // Replace 'categories' with your actual store name
      const store = tx.objectStore('categories');
      const allCategories = await store.getAll();

      setCategories(allCategories);
    };

    fetchData();
  }, []);


 const handleAddCategory = async () => {
    await addCategory(newName, Number(newWeight));
    setNewName('');
    setNewWeight('');
    setShowInputs(false);
      // Open the database
      const db = await openDB('MyDatabase', 1); // Replace with your database name and version

      // Read all categories from the store
      const tx = db.transaction('categories', 'readonly'); // Replace 'categories' with your actual store name
      const store = tx.objectStore('categories');
      const allCategories = await store.getAll();

      setCategories(allCategories);
  };

  return (
    <div className='flex flex-col mt-4 w-2/3'>
      {!showInputs && (<table className='text-lunar-green-300 border-collapse'>
  <thead>
    <tr className='border-b border-lunar-green-200 '>
      <th className='w-2/3 text-left'>Name</th>
      <th className='w-1/2 text-left'>Weight</th>
    </tr>
  </thead>
  <tbody className='text-lunar-green-100'>
    {categories.map((category, index) => (
<tr key={index} className='border-b border-lunar-green-200'>
  <td className='border-r border-lunar-green-200'>{category.name}</td>
  <td>{category.weight}</td>
</tr>
    ))}
  </tbody>
</table>)}
      <button className='w-full bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-6 mt-2' onClick={() => setShowInputs(!showInputs)}>{showInputs ? 'Close' : 'Add Category'}</button>
      {showInputs && (
        <>
        <div className='w-full items-center my-2 grid grid-cols-2 gap-4 border-b border-lunar-green-200'>
          <label className='text-left text-lunar-green-100'>Name</label>
          <input type='text' value={newName} onChange={(e) => setNewName(e.target.value)} placeholder='Add a name...' className='rounded-sm w-full bg-transparent text-lunar-green-100'/>
          <label className='text-left text-lunar-green-100'>Weight</label>
          <input type='number' value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder='Set a weight...' className='rounded-sm w-full bg-transparent text-lunar-green-100' />
        </div>
        {newName && newWeight && (<button className='w-full bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-6' onClick={handleAddCategory}>Submit</button>)}
        </>
      )}
    </div>
  );
};

export default Categories;

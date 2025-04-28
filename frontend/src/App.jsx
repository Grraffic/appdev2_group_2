import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // State to store all products
  const [products, setProducts] = useState([]);

  // State for the form inputs (create/update)
  const [form, setForm] = useState({ name: "", price: "", category: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to get products from the backend
  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/products") // GET request to backend
      .then((res) => setProducts(res.data)) // Save data in state
      .catch((err) => console.log(err)); // Handle errors
  };

  // Update form state as inputs change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Dynamic update based on input name
  };

  // Handle form submission for both create and update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form._id) {
      // If form has _id, it's an update
      const res = await axios.put(
        `http://localhost:5000/api/products/${form._id}`,
        form
      );
      // Update product in state
      setProducts(products.map((p) => (p._id === form._id ? res.data : p)));
    } else {
      // If no _id, it's a new product
      const res = await axios.post("http://localhost:5000/api/products", form);
      // Add new product to the list
      setProducts([...products, res.data]);
    }

    // Reset form after submit
    setForm({ name: "", price: "", category: "" });
  };

  // Load product data into form for editing
  const handleEdit = (product) => {
    setForm(product);
  };

  // Delete a product after confirmation
  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      // Remove deleted product from state
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Merchandise Manager</h1>

      {/* Form for creating or updating a product */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {form._id ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Display list of products */}
      <ul>
        {products.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price} [{item.category}]
            <button onClick={() => handleEdit(item)} style={{ marginLeft: 10 }}>
              Edit
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              style={{ marginLeft: 5 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

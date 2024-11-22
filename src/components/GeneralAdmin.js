import React, { useState } from 'react';

function GeneralAdminForm() {
  const [adminEmail, setAdminEmail] = useState('');

  const handleChange = (e) => {
    setAdminEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle adding a general admin (e.g., update Firestore or backend)
    console.log('General Admin Email:', adminEmail);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add General Admin</h2>
      <label>Email</label>
      <input
        type="email"
        value={adminEmail}
        onChange={handleChange}
        required
      />

      <button type="submit">Add General Admin</button>
    </form>
  );
}

export default GeneralAdminForm;

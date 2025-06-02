import React, { useState } from "react";

const DisplayNameModal = ({ show, onSave }) => {
  const [name, setName] = useState("");

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div className="bg-white p-4 rounded">
        <h5>¿Cómo te gustaría que te llamemos?</h5>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tu nombre"
            required
          />
          <button type="submit" className="btn btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default DisplayNameModal;
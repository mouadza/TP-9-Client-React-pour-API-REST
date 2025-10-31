import React, { useState } from "react";
import CompteForm from "./components/CompteForm";
import CompteList from "./components/CompteList";

export default function App() {
  const [refreshTick, setRefreshTick] = useState(0);

  const handleCreated = () => {
    // bump the tick so the list re-fetches
    setRefreshTick(t => t + 1);
  };

  return (
    <div className="container mt-4">
      <CompteForm onCreated={handleCreated} />
      <hr />
      <CompteList refreshTick={refreshTick} />
    </div>
  );
}

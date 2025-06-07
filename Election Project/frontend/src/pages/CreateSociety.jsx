import { useState } from "react";
import { addSociety, getSociety, updateSociety, deleteSociety } from "../services/societyService";

export default function CreateSociety() {
  const [societyId, setSocietyId] = useState("");
  const [societyName, setSocietyName] = useState("");
  const [description, setDescription] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [editing, setEditing] = useState(false);
  const [societyLoaded, setSocietyLoaded] = useState(false);

  const clearForm = () => {
    setSocietyId("");
    setSocietyName("");
    setDescription("");
    setCreationDate("");
    setEditing(false);
    setSocietyLoaded(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      society_name: societyName,
      description,
    };

    const result = editing
      ? await updateSociety(societyId, payload)
      : await addSociety(payload);

    console.log("Society save result:", result);
    clearForm();
  };

  if (editing && !societyLoaded) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Society</h1>
        <input
          type="text"
          placeholder="Society ID"
          value={societyId}
          onChange={(e) => setSocietyId(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded mr-2"
          onClick={async () => {
            const society = await getSociety(societyId);
            if (society) {
              setSocietyName(society.society_name);
              setDescription(society.description || "");
              setCreationDate(society.creation_date);
              setSocietyLoaded(true);
            }
          }}
        >
          Load Society
        </button>
        <button
          className="bg-red-500 text-white p-2 rounded mr-2"
          onClick={async () => {
            const result = await deleteSociety(societyId);
            console.log("Delete result:", result);
            clearForm();
          }}
        >
          Delete Society
        </button>
        <button className="p-2" onClick={clearForm}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {editing ? "Update Society" : "Create New Society"}
      </h1>

      {!editing && (
        <button
          className="bg-blue-500 text-white p-2 rounded mb-4"
          onClick={() => setEditing(true)}
        >
          Edit Society
        </button>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Society Name"
          value={societyName}
          onChange={(e) => setSocietyName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        {creationDate && (
          <p className="text-gray-600 text-sm">
            Created on: {new Date(creationDate).toLocaleString()}
          </p>
        )}

        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {editing ? "Update Society" : "Create Society"}
        </button>

        {!editing &&
          <button onClick={() => (window.location.href = "/home")}>Return Home</button>
        }

        {editing && (
          <button className="p-2 text-red-500" onClick={clearForm}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

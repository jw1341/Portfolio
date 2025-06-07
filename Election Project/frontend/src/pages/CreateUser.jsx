import { useState } from "react";
import {
  checkUsernameExists,
  registerUser,
  registerEmployee,
  getUser,
  deleteEmployee,
  updateUser,
  getEmployeeSocieties,
  deleteUser
} from "../services/userService";
import { getSociety } from "../services/societyService";
import { isValidUserName, isValidPassword } from "../services/validation";

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [societyIds, setSocietyIds] = useState([""]);
  const [editing, setEditing] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const [prevRole, setPrevRole] = useState("Member");

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole !== "Employee") {
      // Keep only the first society_id input
      setSocietyIds((prev) => [prev[0]]);
    }
  };

  function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  

  const clearEditing = () => {
    setUsername("");
    setUserId("");
    setPassword("");
    setConfirmPassword("");
    setRole("Member");
    setSocietyIds([""]);
    setPrevRole("Member");

    setEditing(false); 
    setUserLoaded(false);
  }

  const handleSocietyIdChange = (index, value) => {
    setSocietyIds((prev) => {
      const newSocieties = [...prev];
      newSocieties[index] = value;
      return newSocieties;
    });
  };

  const addSocietyId = () => {
    setSocietyIds((prev) => [...prev, ""]);
  };

  const removeSocietyId = (index) => {
    setSocietyIds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    let result;
    e.preventDefault();
    // You can process the form submission here
    let error = document.getElementById('create-user-error');
    if(!isValidUserName(username)){
        error.textContent = "Username does not follow business rules";
        error.style.display = "block";
        return false;
    }
    if(!editing && await checkUsernameExists(username)){
        error.textContent = "That username is already taken.  Please try another";
        error.style.display = "block";
        return false;
    }
    if(!isValidPassword(password)){
        error.textContent = "Password does not follow business rules";
        error.style.display = "block";
        return false;
    }
    if(password !== confirmPassword){
        error.textContent = "Password and Confirm Password do not match";
        error.style.display = "block";
        return false;
    }

    if(role.toLocaleLowerCase() !== "admin"){
      societyIds.forEach(async id => {
          let society = await getSociety(id);
          if(!society){
              error.textContent = `Society ID ${id} does not exist`;
              error.style.display = "block";
              return false;
          }
      });
    }

    const newUser = {
      username,
      password,
      confirmPassword,
      role,
      societyIds,
    };

    if(role.toLocaleLowerCase() === "employee"){
        console.log("User role is employee");
        if(editing){
          console.log("User role is employee and editing is set to true");
          result = await updateUser(user_id, {
            "username": username,
            "password": password,
            "confirmPassword": confirmPassword,
            "role": role.toLocaleLowerCase(),
            "society_id": "",
            "society_ids": societyIds
        });
        }else{
          console.log("User role is employee and editing is set to false");
          result = await registerEmployee(newUser);
        }
    }else {
      console.log("User role is NOT employee: " + role);
      if(prevRole.toLocaleLowerCase() === "employee"){
        console.log("Previous role was found to be employee.  Deleting employee records...");
        let deleteSuccess = result = await deleteEmployee(user_id);
        console.log(deleteSuccess);
      }
      if(editing){
        console.log("User role is NOT employee and editing is true");
        result = await updateUser(user_id, {
          "username": username,
          "password": password,
          "confirmPassword": confirmPassword,
          "role": role.toLocaleLowerCase(),
          "society_id": (role.toLocaleLowerCase() === "admin") ? "" : societyIds[0]
      });
      }else{
        console.log("User role is NOT employee and editing is false");
        result = await registerUser({
            "username": username,
            "password": password,
            "confirmPassword": confirmPassword,
            "role": role.toLocaleLowerCase(),
            "society_id": (role.toLocaleLowerCase() === "admin") ? "" : societyIds[0]
        });
      }
    }

    error.style.display = "none";
    console.log("User in the client:", newUser);
    console.log("Result of handleSubmit:");
    console.log(result);
    clearEditing();
  };

  if(editing && !userLoaded){
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Enter User ID
        </h1>
          <input
          type="text"
          placeholder="user_id"
          value={user_id}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 rounded"
        />

        <button id="load-user"
        onClick={async () => {
          let user = await getUser(user_id);
          if(user){
            setUsername(user.username);
            setPassword(user.hashedPassword);
            setConfirmPassword(user.hashedPassword);
            setRole(capitalizeFirst(user.role));
            setPrevRole(user.role);
            if(user.role === "employee"){
              let societies = await getEmployeeSocieties(user_id);
              setSocietyIds(societies.map(society => society.society.society_id));
            }else{
              setSocietyIds([user.society_id]);
            }
            setUserLoaded(true);
          }
        }}
        >Edit User</button>

        <button id="delete-user"
        onClick={async () => {
          let result = await deleteUser(user_id);
          console.log(result);
          clearEditing();
        }}
        >Delete User</button>

        <button id="cancel-edit-user"
        onClick={clearEditing}
        >Cancel</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {
          (editing) ? 
          "Edit User" :
          "Create New User"
        }
        </h1>
      {!editing &&
      <button id="edit-user"
      onClick={() => {setEditing(true);}}
      >Edit User</button>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <select
          value={role}
          onChange={handleRoleChange}
          className="border p-2 rounded"
        >
          <option value="Member">Member</option>
          <option value="Officer">Officer</option>
          <option value="Employee">Employee</option>
          <option value="Admin">Admin</option>
        </select>

        {role !== 'Admin' && societyIds.map((id, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Society ID"
              value={id}
              onChange={(e) => handleSocietyIdChange(index, e.target.value)}
              className="border p-2 rounded flex-grow"
              required
            />
            {role === "Employee" && index > 0 && (
              <button
                type="button"
                onClick={() => removeSocietyId(index)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {role === "Employee" && (
          <button
            type="button"
            onClick={addSocietyId}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Society ID
          </button>
        )}

        <p id="create-user-error" style={{color: "red", display: "none"}}>Error</p>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded mt-4"
        >
          {(editing) ? "Update User": "Create User"}
        </button>
        {!editing &&
          <button onClick={() => (window.location.href = "/home")}>Return Home</button>
        }
        {editing &&
        <button id="cancel-edit-user"
        onClick={clearEditing}
        >Cancel</button>}

      </form>
    </div>
  );
}
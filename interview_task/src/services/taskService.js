const API_URL = "http://localhost:5000/api/tasks";
const USERS_API_URL = "http://localhost:5000/api/users";
export const createTask = async (taskData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskData),
    });

    return response.json(); 
};

export const getTasks = async () => {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.json();
};

export const updateTaskStatus = async (taskId) => {
  await fetch(`${API_URL}/${taskId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ status: "inactive" }),
  });
};
export const updateTaskCompletion = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}/completion`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating task completion:", error);
  }
};


export const deleteTask = async (taskId) => {
  await fetch(`${API_URL}/${taskId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getUsers = async () => {
  const res = await fetch(USERS_API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  if (!res.ok) {
      throw new Error("Failed to fetch users");
  }

  return res.json();
};
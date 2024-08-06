import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
interface UserData {
  id: number;
  name: string;
  // Age is dynamic.
  // Use static value to be stored with, in this case, born year.
  // Calculate age during request handling.
  age: number;
  address: string;
  role: string;
}

// Data Dummy
let dataDummy: UserData[] = [
  {
    id: 1,
    name: "Rizky",
    age: 20,
    address: "Jakarta",
    role: "Finance",
  },
  {
    id: 2,
    name: "Pohan",
    age: 24,
    address: "Tanggerang",
    role: "Programmer",
  },
  {
    id: 3,
    name: "Rian",
    age: 30,
    address: "Bogor",
    role: "IT Support",
  },
];

// method get show all data
app.get("/users", (c) => {
  return c.json({
    message: "Success",
    data: dataDummy,
  });
});

// method get show data by id
app.get("/users/:id", (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const item = dataDummy.find((data) => data.id === id);

  if (item) {
    return c.json({
      message: "Success",
      data: item,
    });
  } else {
    return c.json(
      {
        message: "Not Found",
        data: {},
      },
      404
    );
  }
});

// method POST add new data
app.post("/users/create", async (c) => {
  try {
    const data = await c.req.json();
    dataDummy.push(data);
    c.status(201);
    return c.json({
      message: "Success Add Data",
      data: data,
    });
  } catch (err: any) {
    return c.json({ message: "Error parsing JSON", error: err.message }, 400);
  }
});

// Method DELETE delete data all users
app.delete("/users", (c) => {
  try {
    dataDummy = [];
    c.status(204);
    return c.json({
      message: "Success Delete All Data",
      data: dataDummy,
    });
  } catch (error: any) {
    return c.json(
      { mesaage: "Error delete all data", error: error.message },
      400
    );
  }
});

// Method DELETE delete data by id
app.delete("/users/:id", (c) => {
  try {
    const dataById = parseInt(c.req.param("id"), 10);
    const filterId = dataDummy.findIndex((data) => data.id === dataById);

    if (filterId === 0) {
      c.status(404);
      return c.json({
        message: "Not Found",
        data: {},
      });
    }

    c.status(204);
    const data = dataDummy.splice(filterId, 1);
    return c.json({
      message: `Succes Delete data id: ${dataById}`,
      data: data,
    });
  } catch (error: any) {
    return c.json({ mesaage: "Error delete data", error: error.mesaage }, 400);
  }
});

// Method PATCH update data by id
app.patch("/users/:id", async (c) => {
  try {
    // Mengambil data dari param id
    const id = parseInt(c.req.param("id"), 10);

    // Mengambil data json untuk di update ke body request
    const dataUpdate = await c.req.json();

    // Mencari index user ingin di cocokan ke param id
    const index = dataDummy.findIndex((data) => data.id === id);

    if (index === -1) {
      return c.json(
        {
          message: "Data Not Found",
          data: {},
        },
        404
      );
    }

    const updatedData = { ...dataDummy[index], ...dataUpdate };

    dataDummy[index] = updatedData;

    return c.json({
      message: `Succes Update data id: ${id}`,
      data: updatedData,
    });
  } catch (error: any) {
    return c.json(
      {
        message: "Failed to update data",
        error: error.message,
      },
      400
    );
  }
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

// Data Dummy
const dataDummy = [
  {
    id: 1,
    name: "Rizky",
    age: 20,
    address: "Jakarta",
    role: "Finence",
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
app.get("/", (c) => {
  return c.json({
    message: "Success",
    data: dataDummy,
  });
});

// method get show data by id
app.get("/:id", (c) => {
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

// app.delete("/:param", (c) => {
//   return c.json({
//     meessage: "This param",
//     query: c.req.query(),
//     param: c.req.param(),
//   });
// });

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

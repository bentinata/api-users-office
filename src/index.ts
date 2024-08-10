import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";

const app = new Hono();
interface UserData {
  id: number;
  name: string;
  // Age is dynamic.
  // Use static value to be stored with, in this case, born year.
  // Calculate bornYear during request handling.
  bornYear: number;
  address: string;
  role: string;
}

// Data Dummy
let dataDummy: UserData[] = [
  {
    id: 1,
    name: "Rizky",
    address: "Jakarta",
    role: "Finance",
    bornYear: 2007,
  },
  {
    id: 2,
    name: "Pohan",
    bornYear: 2001,
    address: "Tanggerang",
    role: "Programmer",
  },
  {
    id: 3,
    name: "Rian",
    bornYear: 1998,
    address: "Bogor",
    role: "IT Support",
  },
];

// REVIEW: Make use of z.infer to extract TypeScript interface from zod schema.
const userSchema = z.object({
  id: z.number().min(1, "ID harus lebih besar dari 0"),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  address: z.string().min(1, "Alamat tidak boleh kosong"),
  role: z.string().min(1, "Role tidak boleh kosong"),
  bornYear: z
    .number()
    .min(1900, "Tahun kelahiran harus lebih besar dari 1900")
    .max(
      new Date().getFullYear(),
      "Tahun kelahiran tidak bisa lebih dari tahun ini"
    ),
});

// REVIEW: Typo. Also, move it out to other files. Make it modular.
const calcualteAge = (bornYear: number) => {
  const currentYear = new Date().getFullYear();
  return currentYear - bornYear;
};

// method get show all data
app.get("/users", (c) => {
  const userWithAge = dataDummy.map((user) => ({
    ...user,
    age: calcualteAge(user.bornYear),
  }));
  return c.json({
    message: "Success",
    data: userWithAge,
  });
});

// method get show data by id
app.get("/users/:id", (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const usersById = dataDummy.find((data) => data.id === id);

  // REVIEW: Try to use guard clause to simplify the code.
  if (usersById) {
    return c.json({
      message: "Success",
      data: {
        ...usersById,
        age: calcualteAge(usersById.bornYear),
      },
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

// REVIEW: Should be just POST /users to be RESTful.
// method POST add new data
app.post("/users/create", async (c) => {
  // REVIEW: try-catch here is not needed, because fail is catched by parsed.success anyway.
  try {
    const data = await c.req.json();

    const parsed = userSchema.safeParse(data);

    if (!parsed.success) {
      // Ini erorr message dari variable userSchema
      const errors = parsed.error.flatten().fieldErrors;

      // Ini error Message Dari sistem contoh required(data tidak boleh kosong)
      const errorMessage = Object.values(errors).flat().join(",");

      // Ini untuk menampilkan erronya
      return c.text(`Validasi gagal: ${errorMessage}`, 400);
    }

    dataDummy.push(parsed.data);

    return c.json({
      message: "Success Add Data",
      data: parsed.data,
    });
  } catch (error) {
    return c.text("Invalid request format", 400);
  }
});

// app.post("/users/create", async (c) => {
//   try {
//     // Parsing request body menjadi JSON
//     const data = await c.req.json();

//     // Validasi data dengan schema
//     const parsed = userSchema.safeParse(data);

//     if (!parsed.success) {
//       // Mengambil detail kesalahan dari hasil parsing
//       const errors = parsed.error.flatten().fieldErrors;

//       // Mengonversi kesalahan ke format pesan string yang lebih mudah dipahami
//       const errorMessage = Object.values(errors).flat().join(", ");

//       return c.text(`Validasi gagal: ${errorMessage}`, 400);
//     }

//     // Tambahkan data ke dataDummy (atau ke database nyata)
//     dataDummy.push(parsed.data);

//     return c.json(
//       {
//         message: "Success Add Data",
//         data: parsed.data,
//       },
//       201
//     );
//   } catch (error) {
//     return c.text("Invalid request format", 400);
//   }
// });

// app.post("/users/create", async (c) => {
//   try {
//     const data = await c.req.json();
//     dataDummy.push(data);
//     c.status(201);
//     return c.json({
//       message: "Success Add Data",
//       data: data,
//     });
//   } catch (err: any) {
//     return c.json({ message: "Error parsing JSON", error: err.message }, 400);
//   }
// });

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

const Joi = require("@hapi/joi");
const express = require("express");

const app = express();
app.use(express.json());

const students = [
  {
    id: 1,
    name: "Gabriel",
    lastname: "White",
    age: 29,
    class: "FBW21",
    location: "BER"
  },
  {
    id: 2,
    name: "Michael",
    lastname: "Flinstone",
    age: 26,
    class: "FBW21",
    location: "BER"
  },
  {
    id: 3,
    name: "Forrest",
    lastname: "Gump",
    age: 38,
    class: "FBW21",
    location: "BER"
  },
  {
    id: 4,
    name: "James",
    lastname: "Auther",
    age: 27,
    class: "FBW21",
    location: "BER"
  },
  {
    id: 5,
    name: "Asta",
    lastname: "Grim",
    age: 18,
    class: "FBW21",
    location: "BER"
  }
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/students/all", (req, res) => {
  res.send(students);
});

app.post("/api/students", (req, res) => {
  const { error } = validateStudents(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const student = {
    id: students.length + 1,
    name: req.body.name,
    lastname: req.body.lastname,
    age: req.body.age,
    class: req.body.class,
    location: req.body.location
  };
  students.push(student);
  res.send(student);
});

app.put("/api/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).send("The student with the given ID was not found");
  }

  if (req.body.name) {
    student.name = req.body.name;
  }
  if (req.body.lastname) {
    student.lastname = req.body.lastname;
  }
  if (req.body.age) {
    student.age = req.body.age;
  }
  if (req.body.class) {
    student.class = req.body.class;
  }
  if (req.body.location) {
    student.location = req.body.location;
  }

  res.send(student);
});

app.delete("/api/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).send("The student was not found");
  }

  const index = students.indexOf(student);
  students.splice(index, 1);
  res.send(student);
});

function validateStudents(student) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required(),
    lastname: Joi.string()
      .min(3)
      .required(),
    age: Joi.number()
      .min(1)
      .required(),
    class: Joi.string()
      .min(4)
      .required(),
    location: Joi.string()
      .min(3)
      .required()
  });

  return schema.validate(student);
}

app.get("/api/students/:id", (req, res) => {
  const student = students.find(c => c.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).send("The student with the given ID was not found");
  }
  res.send(student);
});

app.get("/api/students", (req, res) => {
  let queryParams = req.query;
  let studentsWithinRange = students.filter(
    std =>
      std.age <= parseInt(queryParams.maxAge) &&
      std.age >= parseInt(queryParams.minAge)
  );
  res.send(studentsWithinRange);
});

const port = process.env.PORT || 3000; // in terminal "export PORT=5000" we will then be running server on port 5000
app.listen(port, () => console.log(`Listening on port ${port}...`));

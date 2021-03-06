const express = require("express");
const Joi = require("joi");

const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "Course1" },
  { id: 2, name: "Course2" },
  { id: 3, name: "Course3" }
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The Course You Searched For does not exist!");

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };

  courses.push(course);

  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The Course You Searched For does not exist!");

  const result = validateCourse(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The Course You Searched For does not exist!");

  const index = courses.indexOf(course);

  courses.splice(index, 1);

  res.send(course);
});

const validateCourse = course => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}...`));

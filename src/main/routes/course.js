var express = require("express");
var mustache = require("../common/mustache");
var html = require("../common/html");
var course_portfolio_lib = require("../lib/course_portfolio");
var router = express.Router();

const Course = require("../models/Course");
const Department = require("../models/Department");
const TermType = require("../models/TermType");

async function end_date(id) {
  const course = await Course.query().findById(id);
  var date = new Date(course.end_date);
  date.setDate(date.getDate() + 15);
  return date.toString();
}

const course_manage_page = async (res, course_id, breadcrumbs) => {
  let course_info = {
    end_date: await end_date(course_id),
    student_learning_outcomes: [
      {
        index: 1,
        description: "n/a",
        metrics: [
          {
            name: "n/a",
            exceeds: "n/a",
            meets: "n/a",
            partially: "n/a",
            not: "n/a"
          },
          {
            name: "n/a",
            exceeds: "n/a",
            meets: "n/a",
            partially: "n/a",
            not: "n/a"
          },
          {
            name: "n/a",
            exceeds: "n/a",
            meets: "n/a",
            partially: "n/a",
            not: "n/a"
          },
          {
            name: "n/a",
            exceeds: "n/a",
            meets: "n/a",
            partially: "n/a",
            not: "n/a"
          }
        ],
        artifacts: [
          {
            name: "n/a",
            evaluations: [
              {
                index: 1,
                evaluation: [
                  {
                    metric: 1,
                    value: 6
                  },
                  {
                    metric: 2,
                    value: 6
                  },
                  {
                    metric: 3,
                    value: 6
                  },
                  {
                    metric: 4,
                    value: 6
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  res.render("base_template", {
    title: "CS498 Course Portfolio",
    body: mustache.render("course/manage", course_info),
    breadcrumbs
  });
};

const course_new_page = async (res, department = false, breadcrumbs) => {
  const departments = await Department.query().select();
  const semesters = await (await TermType.query().findById(
    "semester"
  )).$relatedQuery("terms");
  let student_learning_outcomes = false;

  if (department) {
    student_learning_outcomes = await (await Department.query().findById(
      department
    )).$relatedQuery("student_learning_outcomes");
  }

  res.render("base_template", {
    title: "New Course Portfolio",
    body: mustache.render("course/new", {
      departments,
      department,
      student_learning_outcomes,
      semesters
    }),
    breadcrumbs
  });
};

/* GET course home page */
router.route("/").get(
  html.auth_wrapper(async (req, res, next) => {
    res.render("base_template", {
      title: "Course Portfolios",
      body: mustache.render("course/index"),
      breadcrumbs: req.breadcrumbs
    });
  })
);

/* GET course page */
router
  .route("/:id")
  .get(
    html.auth_wrapper(async (req, res, next) => {
      if (req.params.id === "new") {
        await course_new_page(res, false, req.breadcrumbs);
      } else {
        course_manage_page(res, req.params.id, req.breadcrumbs);
      }
    })
  )
  .post(
    html.auth_wrapper(async (req, res, next) => {
      if (req.params.id === "new") {
        if (req.body.course_submit) {
          const course_portfolio = await course_portfolio_lib.new({
            department_id: req.body.department,
            course_number: req.body.course_number,
            instructor: 1,
            semester: req.body.semester,
            year: req.body.course_year,
            num_students: req.body.num_students,
            student_learning_outcomes: Object.entries(req.body)
              .filter(entry => entry[0].startsWith("slo_") && entry[1] === "on")
              .map(entry => entry[0].split("_")[1]),
            section: req.body.course_section
          });

          res.redirect(302, `/course/${course_portfolio.id}`);
        } else {
          await course_new_page(res, req.body.department, req.breadcrumbs);
        }
      } else {
        await course_manage_page(
          res,
          req.params.id,
          req.breadcrumbs,
          end_date(req.params.id)
        );
      }
    })
  );

module.exports = router;
module.exports.end_date = end_date;

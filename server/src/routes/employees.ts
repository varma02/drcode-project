import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import type { Employee, Invite } from '../database/models';

const employeesRouter = express.Router();

employeesRouter.use(ensureAuth);

employeesRouter.get('/all', ensureAdmin, async (req, res) => {
  const employees = (await db.query<Employee[][]>('SELECT * OMIT password, session_key FROM employee'))[0];

  res.status(200).json({
    code: "success",
    message: "All employees retrieved",
    data: { employees },
  });
});

employeesRouter.post('/invite', ensureAdmin, async (req, res) => {
  const invite = (await db.query<Invite[]>("CREATE invite SET author = $author", { author: req.employee?.id }))[0];
  res.status(200).json({
    code: "success",
    message: "Invite created",
    data: { invite },
  });
});

employeesRouter.get('/:id', async (req, res) => {
  if (!req.params.id || !req.params.id.startsWith("employee:")) {
    res.status(404).json({
      code: "not_found",
      message: "This employee does not exist",
    });
    return;
  }
  
  if (isAdmin(req) && req.query.include) {
    const include = (req.query.include as string).trim().split(",")
    .filter((incl) => ["unpaid_work", "classes"].includes(incl));
    const employee = (await db.query<Employee[]>(
      `SELECT *,
        ${include.map((incl, index) => {
          const end = index === include.length-1 ? "" : ",";
          return incl === "unpaid_work" ? `->worked_at[WHERE ! paid].{where:out.*, time:created} as unpaid_work${end}` : 
            incl === "classes" ? `(SELECT * FROM class WHERE $employee IN teachers) as classes${end}` : "";
        }).join("\n")}
      OMIT password, session_key FROM ONLY type::thing($employee)`,
      { employee: req.params.id }))[0];
  
    if (!employee || !employee.name) {
      res.status(404).json({
        code: "not_found",
        message: "This employee does not exist",
      });
      return;
    }
  
    res.status(200).json({
      code: "success",
      message: "Employee data retrieved",
      data: { employee },
    });

  } else {
    const employee = (await db.query<Employee[]>(
      "SELECT * OMIT password, session_key FROM ONLY type::thing($employee)",
      { employee: req.params.id }))[0];
  
    if (!employee || !employee.name) {
      res.status(404).json({
        code: "not_found",
        message: "This employee does not exist",
      });
      return;
    }
  
    res.status(200).json({
      code: "success",
      message: "Employee data retrieved",
      data: { employee },
    });
  }
});

export default employeesRouter;
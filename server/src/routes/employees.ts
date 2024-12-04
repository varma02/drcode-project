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
  const { roles } = req.body;

  if (!roles || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({
      code: "fields_required",
      message: "The roles field is required",
    });
  }

  const invite = (await db.query<Invite[]>("CREATE ONLY invite SET author = $author, roles = $roles", 
    { author: req.employee?.id, roles }))[0];

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
      message: "No employee was found with the provided ID",
    });
    return;
  }
  
  if (req.query.include && isAdmin(req)) {
    const include = new Set((req.query.include as string).trim().split(","));
    const dbResponse = (await db.query<{employee: Employee, unpaid_work: any, classes: any}[]>(`
      RETURN {
        employee: (SELECT * OMIT password, session_key FROM ONLY type::thing($employee)),
        ${include.has("unpaid_work") ?
        "unpaid_work: (SELECT ->worked_at[WHERE ! paid].{where:out.*, time:created} as _ FROM ONLY type::thing($employee))._," : ""}
        ${include.has("classes") ?
        "classes: (SELECT * FROM class WHERE $employee IN teachers)," : ""}
      }`, { employee: req.params.id }))[0];
  
    if (!dbResponse.employee || !dbResponse.employee.name) {
      res.status(404).json({
        code: "not_found",
        message: "No employee was found with the provided ID",
      });
      return;
    }
  
    res.status(200).json({
      code: "success",
      message: "Employee data retrieved",
      data: {
        employee: dbResponse.employee,
        unpaid_work: dbResponse.unpaid_work,
        classes: dbResponse.classes,
      },
    });

  } else {
    const employee = (await db.query<Employee[]>(
      "SELECT * OMIT password, session_key FROM ONLY type::thing($employee)",
      { employee: req.params.id }))[0];
  
    if (!employee || !employee.name) {
      res.status(404).json({
        code: "not_found",
        message: "No employee was found with the provided ID",
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
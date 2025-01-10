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
    const dbResponse = (await db.query<{employee: Employee, unpaid_work: any, groups: any}[]>(`
      RETURN {
        employee: (SELECT * OMIT password, session_key FROM ONLY type::thing($employee)),
        ${include.has("unpaid_work") ?
        "unpaid_work: (SELECT ->worked_at[WHERE ! paid].* as _ FROM ONLY type::thing($employee))._," : ""}
        ${include.has("groups") ?
        "groups: (SELECT * FROM group WHERE $employee IN teachers)," : ""}
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
        groups: dbResponse.groups,
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

employeesRouter.post('/remove', async (req, res) => {
  const { id } = req.body;
  if (!id || !id.startsWith("employee:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The id field is required",
    });
    return;
  }

  const result = await db.query<Employee[]>("DELETE ONLY type::thing($employee) RETURN BEFORE;", { employee: id });

  if (result?.[0]?.email) {
    res.status(200).json({
      code: "success",
      message: "Employee deleted",
    });
  } else {
    res.status(404).json({
      code: "not_found",
      message: "No employee was found with the provided ID",
    });
  }
});

employeesRouter.post("/update", async (req, res) => {
  const { id, name, email, roles } = req.body;
  if (!id || (!name && !email && !roles)) {
    res.status(400).json({
      code: "fields_required",
      message: "The id and at least one updateable fields are required",
    });
    return;
  }

  if (!id.startsWith("employee:") || !Array.isArray(roles) || !roles.every(r => r === "administrator" || r === "teacher")) {
    res.status(400).json({
      code: "fields_invalid",
      message: "One or more fields are invalid",
    });
    return;
  }

  const result = await db.query<Employee[]>(`
    UPDATE ONLY type::thing($employee) MERGE {
      ${name ? "name: $name ," : ""}
      ${email ? "email: $email ," : ""}
      ${roles ? "roles: $roles ," : ""}
    };`, { employee: id, name, email, roles });

  if (result?.[0]?.email) {
    res.status(200).json({
      code: "success",
      message: "Employee updated",
      data: {
        employee: result[0],
      }
    });
  } else {
    res.status(404).json({
      code: "not_found",
      message: "No employee was found with the provided ID",
    });
  }
});

export default employeesRouter;
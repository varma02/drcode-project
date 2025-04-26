import Ajv from 'ajv/dist/2020';
import AjvAddFormats from 'ajv-formats';
import express from 'express';
import JsonRefs from 'json-refs';
import { BadRequestError, ServerError } from './errors';
import mergeAllOf from 'json-schema-merge-allof';

export const spec: any = mergeAllOf((await JsonRefs.resolveRefs((await import("../openapi.spec.json")).default)).resolved);
export const ajv = new Ajv({ keywords: ['example'], removeAdditional: "all", allErrors: true });
AjvAddFormats(ajv);

export function validateRequest(req: express.Request, bodySchema: object | string, querySchema?: object) {
  if (typeof bodySchema === "string") {
    const ref = bodySchema.split(" ");
    const urlSchema = spec.paths?.[ref[1]]?.[ref[0].toLowerCase()];
    if (!urlSchema) {
      console.warn("Route not implemented: ", bodySchema);
      throw new ServerError("Route not implemented");
    }
    bodySchema = spec.paths?.[ref[1]]?.[ref[0].toLowerCase()]?.requestBody?.content?.["application/json"].schema;
    querySchema = spec.paths?.[ref[1]]?.[ref[0].toLowerCase()]?.parameters?.filter((v:any) => v.in == "query");
  }
  if (bodySchema) {
    const validate = ajv.compile(bodySchema as object);
    const valid = validate(req.body);
    if (!valid) {
      console.warn(validate.errors);
      throw new BadRequestError(
        "Invalid request body, "
        + (validate.errors?.[0].keyword == "required" ? "" : "field " + validate.errors?.[0].instancePath + " ")
        + validate.errors?.[0].message
      );
    }
  } else if (Object.keys(req.body).length) {
    req.body = {};
    throw new BadRequestError("No body is allowed for this request.")
  }
  if (querySchema) {
    const querySchemaObj: any = {type: "object", properties: {}};
    (querySchema as any).forEach((v:any) => {querySchemaObj.properties[v.name] = v.schema});
    const validate = ajv.compile(querySchemaObj);
    const query = JSON.parse(JSON.stringify(req.query));
    const valid = validate(query);
    if (!valid) {
      console.warn(req.query, validate.errors);
      throw new BadRequestError("An invalid query parameter was provided");
    }
  } else if (Object.keys(req.body).length) {
    req.query = {};
    throw new BadRequestError("No query parameters are allowed with this request.")
  }
}

export function sanitizeResponse(data: object, schema: object | string) {
  if (typeof schema === "string") {
    const ref = schema.split(" ");
    const originalSchema = schema;
    schema = spec.paths?.[ref[1]]?.[ref[0].toLowerCase()]?.responses?.[ref[2]]?.content?.["application/json"]?.schema;
    if (!schema) {
      console.warn("Route not implemented: ", originalSchema)
      throw new ServerError("Route not implemented")
    };
  }
  data = JSON.parse(JSON.stringify(data));
  const validate = ajv.compile(mergeAllOf(schema as object));
  if (!validate(data)) {
    console.warn("Invalid response:\n", validate.errors);
  }
  return data;
}

export function respond200(res: express.Response, route?: string, data?: object) {
  res.status(200).json(data ? sanitizeResponse({ code: "success", data }, route + " 200") : {code: "success"});
}

export function getReqURI(req: express.Request) {
  return req.originalUrl.slice(
    0,
    req.originalUrl.indexOf("?") == -1
      ? req.originalUrl.length
      : req.originalUrl.indexOf("?")
  );
}
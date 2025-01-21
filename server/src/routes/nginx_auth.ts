import express from "express";

export default (function NginxVerifyAuth(req, res) {
  const originalUri = req.headers['x-original-uri'] as string || req.url;
  const token = new URLSearchParams(originalUri.slice(originalUri.indexOf("?"))).get('token');

  console.log(originalUri, token);

  res.status(401).send()
}) as express.RequestHandler;
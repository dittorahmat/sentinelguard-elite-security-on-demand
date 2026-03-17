import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, GuardEntity, JobEntity, IncidentEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { JobStatus } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env);
    return ok(c, page);
  });
  // GUARDS
  app.get('/api/guards', async (c) => {
    await GuardEntity.ensureSeed(c.env);
    const page = await GuardEntity.list(c.env);
    return ok(c, page);
  });
  // JOBS
  app.get('/api/jobs', async (c) => {
    await JobEntity.ensureSeed(c.env);
    const page = await JobEntity.list(c.env);
    return ok(c, page);
  });
  app.get('/api/jobs/:id', async (c) => {
    const job = new JobEntity(c.env, c.req.param('id'));
    if (!await job.exists()) return notFound(c, 'Job not found');
    return ok(c, await job.getState());
  });
  app.post('/api/jobs', async (c) => {
    const data = await c.req.json();
    const id = crypto.randomUUID();
    const job = await JobEntity.create(c.env, {
      ...data,
      id,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return ok(c, job);
  });
  app.patch('/api/jobs/:id/status', async (c) => {
    const { status } = await c.req.json() as { status: JobStatus };
    const job = new JobEntity(c.env, c.req.param('id'));
    if (!await job.exists()) return notFound(c, 'Job not found');
    return ok(c, await job.setStatus(status));
  });
  app.patch('/api/jobs/:id/location', async (c) => {
    const { lat, lng } = await c.req.json() as { lat: number, lng: number };
    const job = new JobEntity(c.env, c.req.param('id'));
    if (!await job.exists()) return notFound(c, 'Job not found');
    return ok(c, await job.updateLocation(lat, lng));
  });
  app.post('/api/jobs/:id/assign', async (c) => {
    const { guardId } = await c.req.json() as { guardId: string };
    const job = new JobEntity(c.env, c.req.param('id'));
    if (!await job.exists()) return notFound(c, 'Job not found');
    await job.patch({ guardId, updatedAt: Date.now() });
    return ok(c, await job.getState());
  });
  app.post('/api/jobs/:id/panic', async (c) => {
    const jobId = c.req.param('id');
    const job = new JobEntity(c.env, jobId);
    if (!await job.exists()) return notFound(c, 'Job not found');
    await job.setStatus('emergency');
    const incident = await IncidentEntity.create(c.env, {
      id: crypto.randomUUID(),
      jobId,
      timestamp: Date.now(),
      type: 'panic',
      description: 'SILENT DURESS SIGNAL ACTIVATED BY CLIENT',
      severity: 'critical'
    });
    return ok(c, { status: 'emergency', incident });
  });
  // INCIDENTS
  app.get('/api/incidents', async (c) => {
    const page = await IncidentEntity.list(c.env);
    return ok(c, page);
  });
}
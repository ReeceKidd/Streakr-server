import { Router } from "express";
import { deleteAgendaJobMiddlewares } from "../../../RouteMiddlewares/Agenda/deleteAgendaJobMiddleware";

export const agendaJobId = "agendaJobId";

const agendaJobsRouter = Router();

agendaJobsRouter.delete(`/:${agendaJobId}`, ...deleteAgendaJobMiddlewares);

export default agendaJobsRouter;

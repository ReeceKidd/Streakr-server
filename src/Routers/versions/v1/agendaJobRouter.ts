import { Router } from 'express';
import { deleteAgendaJobMiddlewares } from '../../../RouteMiddlewares/Agenda/deleteAgendaJobMiddlewares';

export const agendaJobId = 'agendaJobId';

const agendaJobsRouter = Router();

agendaJobsRouter.delete(`/:${agendaJobId}`, ...deleteAgendaJobMiddlewares);

export { agendaJobsRouter };

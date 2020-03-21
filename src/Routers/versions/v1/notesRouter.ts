import { Router } from 'express';

import { getAllNotesMiddlewares } from '../../../RouteMiddlewares/Notes/getAllNotesMiddlewares';
import { createNoteMiddlewares } from '../../../RouteMiddlewares/Notes/createNoteMiddlewares';
import { getOneNoteMiddlewares } from '../../../RouteMiddlewares/Notes/getOneNoteMiddlewares';
import { deleteNoteMiddlewares } from '../../../RouteMiddlewares/Notes/deleteNoteMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

export const noteId = 'noteId';

const notesRouter = Router();

notesRouter.use(...authenticationMiddlewares);

notesRouter.get(`/`, ...getAllNotesMiddlewares);

notesRouter.get(`/:${noteId}`, ...getOneNoteMiddlewares);

notesRouter.post(`/`, ...createNoteMiddlewares);

notesRouter.delete(`/:${noteId}`, ...deleteNoteMiddlewares);

export { notesRouter };

import { ApiError, apiFetch } from '@tietokilta/ilmomasiina-components';
import type {
  AdminEventSchema, CheckSlugResponse, EditConflictError, EventEditSchema,
  EventID, ListCategoriesResponse, SignupID,
} from '@tietokilta/ilmomasiina-models';
import { DispatchAction, GetState } from '../../store/types';
import { loginExpired } from '../auth/actions';
import {
  CATEGORIES_LOADED,
  EDIT_CONFLICT,
  EDIT_CONFLICT_DISMISSED,
  EVENT_LOAD_FAILED,
  EVENT_LOADED,
  EVENT_SAVE_FAILED,
  EVENT_SAVING,
  EVENT_SLUG_CHECKED,
  EVENT_SLUG_CHECKING,
  MOVE_TO_QUEUE_CANCELED,
  MOVE_TO_QUEUE_WARNING,
  RESET,
} from './actionTypes';
import { EditorEvent, EditorEventType } from './types';

export const defaultEvent = (): EditorEvent => ({
  eventType: EditorEventType.EVENT_WITH_SIGNUP,
  title: '',
  slug: '',
  date: undefined,
  endDate: undefined,
  webpageUrl: '',
  facebookUrl: '',
  category: '',
  location: '',
  description: '',
  price: '',
  signupsPublic: false,

  registrationStartDate: undefined,
  registrationEndDate: undefined,

  openQuotaSize: 0,
  useOpenQuota: false,
  quotas: [
    {
      key: 'new',
      title: 'Kiintiö',
      size: 20,
    },
  ],

  nameQuestion: true,
  emailQuestion: true,
  questions: [],

  verificationEmail: '',

  draft: true,
  listed: true,

  updatedAt: '',
});

export const resetState = () => <const>{
  type: RESET,
};

export const loaded = (event: AdminEventSchema) => <const>{
  type: EVENT_LOADED,
  payload: {
    event,
    isNew: false,
  },
};

export const newEvent = () => <const>{
  type: EVENT_LOADED,
  payload: {
    event: null,
    isNew: true,
  },
};

export const loadFailed = () => <const>{
  type: EVENT_LOAD_FAILED,
};

export const checkingSlugAvailability = () => <const>{
  type: EVENT_SLUG_CHECKING,
};

export const slugAvailabilityChecked = (
  result: CheckSlugResponse | null,
) => <const>{
  type: EVENT_SLUG_CHECKED,
  payload: result,
};

export const saving = () => <const>{
  type: EVENT_SAVING,
};

export const saveFailed = () => <const>{
  type: EVENT_SAVE_FAILED,
};

export const moveToQueueWarning = (count: number) => <const>{
  type: MOVE_TO_QUEUE_WARNING,
  payload: { count },
};

export const moveToQueueCanceled = () => <const>{
  type: MOVE_TO_QUEUE_CANCELED,
};

export const editConflictDetected = (data: EditConflictError) => <const>{
  type: EDIT_CONFLICT,
  payload: data,
};

export const editConflictDismissed = () => <const>{
  type: EDIT_CONFLICT_DISMISSED,
};

export const categoriesLoaded = (categories: string[]) => <const>{
  type: CATEGORIES_LOADED,
  payload: categories,
};

export type EditorActions =
  | ReturnType<typeof resetState>
  | ReturnType<typeof loaded>
  | ReturnType<typeof newEvent>
  | ReturnType<typeof loadFailed>
  | ReturnType<typeof checkingSlugAvailability>
  | ReturnType<typeof slugAvailabilityChecked>
  | ReturnType<typeof saving>
  | ReturnType<typeof saveFailed>
  | ReturnType<typeof moveToQueueWarning>
  | ReturnType<typeof moveToQueueCanceled>
  | ReturnType<typeof editConflictDetected>
  | ReturnType<typeof editConflictDismissed>
  | ReturnType<typeof categoriesLoaded>;

function eventType(event: AdminEventSchema): EditorEventType {
  if (event.date === null) {
    return EditorEventType.ONLY_SIGNUP;
  }
  if (event.registrationStartDate === null) {
    return EditorEventType.ONLY_EVENT;
  }
  return EditorEventType.EVENT_WITH_SIGNUP;
}

export const serverEventToEditor = (event: AdminEventSchema): EditorEvent => ({
  ...event,
  eventType: eventType(event),
  date: event.date ? new Date(event.date) : undefined,
  endDate: event.endDate ? new Date(event.endDate) : undefined,
  registrationStartDate: event.registrationStartDate ? new Date(event.registrationStartDate) : undefined,
  registrationEndDate: event.registrationEndDate ? new Date(event.registrationEndDate) : undefined,
  quotas: event.quotas.map((quota) => ({
    ...quota,
    key: quota.id,
  })),
  useOpenQuota: event.openQuotaSize > 0,
  questions: event.questions.map((question) => ({
    ...question,
    key: question.id,
    options: question.options || [''],
  })),
});

const editorEventToServer = (form: EditorEvent): EventEditSchema => ({
  ...form,
  date: form.eventType === EditorEventType.ONLY_SIGNUP ? null : form.date?.toISOString() ?? null,
  endDate: form.eventType === EditorEventType.ONLY_SIGNUP ? null : form.endDate?.toISOString() ?? null,
  registrationStartDate:
    form.eventType === EditorEventType.ONLY_EVENT ? null : form.registrationStartDate?.toISOString() ?? null,
  registrationEndDate:
    form.eventType === EditorEventType.ONLY_EVENT ? null : form.registrationEndDate?.toISOString() ?? null,
  quotas: form.quotas,
  openQuotaSize: form.useOpenQuota ? form.openQuotaSize : 0,
  questions: form.questions.map((question) => ({
    ...question,
    options: question.type === 'select' || question.type === 'checkbox' ? question.options : null,
  })),
});

export const getEvent = (id: EventID) => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    const response = await apiFetch(
      `admin/events/${id}`,
      { accessToken },
      () => dispatch(loginExpired()),
    ) as AdminEventSchema;
    dispatch(loaded(response));
  } catch (e) {
    dispatch(loadFailed());
  }
};

export const reloadEvent = () => (dispatch: DispatchAction, getState: GetState) => {
  const { event } = getState().editor;
  if (!event) return;
  dispatch(resetState());
  dispatch(getEvent(event.id));
};

export const checkSlugAvailability = (slug: string) => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    const response = await apiFetch(
      `admin/slugs/${slug}`,
      { accessToken },
      () => dispatch(loginExpired()),
    ) as CheckSlugResponse;
    dispatch(slugAvailabilityChecked(response));
  } catch (e) {
    dispatch(slugAvailabilityChecked(null));
  }
};

export const loadCategories = () => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    const response = await apiFetch(
      'admin/categories',
      { accessToken },
      () => dispatch(loginExpired()),
    ) as ListCategoriesResponse;
    dispatch(categoriesLoaded(response));
  } catch (e) {
    dispatch(categoriesLoaded([]));
    throw e;
  }
};

export const publishNewEvent = (data: EditorEvent) => async (dispatch: DispatchAction, getState: GetState) => {
  dispatch(saving());

  const cleaned = editorEventToServer(data);
  const { accessToken } = getState().auth;

  try {
    const response = await apiFetch('admin/events', {
      accessToken,
      method: 'POST',
      body: cleaned,
    }, () => dispatch(loginExpired())) as AdminEventSchema;
    dispatch(loaded(response));
    return response;
  } catch (e) {
    dispatch(saveFailed());
    throw e;
  }
};

export const publishEventUpdate = (
  id: EventID,
  data: EditorEvent,
  moveSignupsToQueue: boolean = false,
) => async (dispatch: DispatchAction, getState: GetState) => {
  dispatch(saving());

  const cleaned = editorEventToServer(data);
  const { accessToken } = getState().auth;

  try {
    const response = await apiFetch(`admin/events/${id}`, {
      accessToken,
      method: 'PATCH',
      body: {
        ...cleaned,
        moveSignupsToQueue,
      },
    }, () => dispatch(loginExpired())) as AdminEventSchema;
    dispatch(loaded(response));
    return response;
  } catch (e) {
    if (e instanceof ApiError && e.className === 'would-move-signups-to-queue') {
      dispatch(moveToQueueWarning(e.data!.count));
      return null;
    }
    if (e instanceof ApiError && e.className === 'edit-conflict') {
      dispatch(editConflictDetected(e.data!));
      return null;
    }
    dispatch(saveFailed());
    throw e;
  }
};

export const deleteSignup = (id: SignupID) => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    await apiFetch(`admin/signups/${id}`, {
      accessToken,
      method: 'DELETE',
    }, () => dispatch(loginExpired()));
    return true;
  } catch (e) {
    return false;
  }
};

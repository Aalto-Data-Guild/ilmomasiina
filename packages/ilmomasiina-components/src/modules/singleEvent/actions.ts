/* eslint-disable import/prefer-default-export */
import type { CreatedSignupSchema, QuotaID } from '@tietokilta/ilmomasiina-models';
import apiFetch from '../../api';

export function beginSignup(quotaId: QuotaID) {
  return apiFetch('signups', {
    method: 'POST',
    body: { quotaId },
  }) as Promise<CreatedSignupSchema>;
}

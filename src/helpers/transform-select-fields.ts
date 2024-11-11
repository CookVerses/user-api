import { set } from 'lodash';

/**
 * Transform a string or an array of string to a select object of typeorm
 *
 * @param {string | string[]} select - the value being transformed
 * @return {object} the select object of typeorm
 */
export function transformSelectFields(
  select: string | string[],
): Record<string, boolean> {
  const selectFields = { id: true };

  if (typeof select === 'string') {
    return {
      ...selectFields,
      [`${select}`]: true,
    };
  }

  for (const key of select) {
    set(selectFields, key, true);
  }

  return selectFields;
}

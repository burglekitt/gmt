// ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sss
export const plainDateTime: RegExp =
  /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]{1,3})?$/;

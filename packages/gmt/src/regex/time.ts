// regex patterns exported for usage
export const hour: RegExp = /^(0[0-9]|1[0-9]|2[0-3])$/;
export const minute: RegExp = /^[0-5][0-9]$/;
export const second: RegExp = /^[0-5][0-9]$/;
export const millisecond: RegExp = /^[0-9]{1,3}$/;

// use Regex interpolation for this:
export const plainTime: RegExp =
  /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]{1,3})?$/;

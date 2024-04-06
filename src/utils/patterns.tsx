export default {
  PRICE_PATTERN: /^\d+(?:[.,]\d+)*$/,
  EMAIL_PATTERN: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  PASSWORD_PATTERN:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  MOBILE_PATTERN: /^(\+\d{1,3}[- ]?)?\d{10}$/,
  OTP_PATTERN: /^\d{1,4}$/,
  IFSC_PATTERN: /^[A-Za-z]{4}\d{7}$/,
  ACCOUNT_NUMBER_PATTERN: /^\d{9,18}$/,
  ACCOUNT_HOLDER_NAME_PATTERN: /^((?:[A-Za-z]+ ?){1,3})$/,
  AADHAR_PATTERN: /^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/,
  PAN_PATTERN: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
  GST_PATTERN: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
  VEHICLE_NUMBER_PATTERN:
    /^[A-Za-z]{2}[ -]?[0-9]{1,2}[ -]?(?:[A-Za-z])?(?:[A-Za-z]*)?[ -]?[0-9]{4}$/,
  DRIVING_LICENCE_NUMBER_PATTERN:
    /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/,
  FRIGHT_PATTERN: /^[1-9][0-9]*$/,
  WEIGHT_PATTERN: /^([0-9]|[1-9][0-9]|100)$/,
  BANK_PATTERN: /^[a-zA-Z0-9]+$/,
};

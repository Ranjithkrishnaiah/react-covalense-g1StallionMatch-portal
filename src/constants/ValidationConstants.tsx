const MIN_LENGTH_PASSWORD = 6;
const MAX_LENGTH_PASSWORD = 50;
const MIN_LENGTH_NAME = 2;
const MAX_LENGTH_NAME = 50;
const MIN_LENGTH_FARM_NAME = 5;
const MAX_LENGTH_FARM_NAME = 50;
const MAX_LENGTH_EMAIL = 50;
const emailValidation = "This is a required field.";
const fullNameValidation = 'This is a required field.';
const farmNameValidation = 'This is a required field.';
const farmWebsiteValidation = 'This is a required field.';
const countryValidation = 'This is a required field.';
const stateValidation = 'This is a required field';
const passwordValidation = 'This is a required field';
const confirmPasswordValidation = 'This is a required field';
const confirmPasswordMismatch = "Password doesn't match";
const acceptTerms = 'Please accept the terms and conditions';
const mareRequired = 'Mare is a required field';
const stallionLocationRequired = 'This is a required field.';
const stallionRequired = 'Stallion is a required field';
const saleLocationRequired = 'Sale location is a required field.';
const saleRequired = 'Sale is a required field';
const currencyRequired = 'Please choose the currency';
const stallionName = 'Stallion Name is a required field';
const year = 'year is a required field';
const emailFormatValidation = 'Invalid email address.';
const fee = "This is a required field";
const name = "Name is a required field"
const mareNameRequired = 'MareName is a required field';
const message = "Message is a required field";
const farmId = "Fee is a required field";
const contactDetailsRequired = "Details is a required field";
const accessLevelValidation = 'This is a required field.';
export const ValidationConstants = {
  minPasswordLength: MIN_LENGTH_PASSWORD,
  maxPasswordLength: MAX_LENGTH_PASSWORD,
  minNameLength: MIN_LENGTH_NAME,
  maxNameLength: MAX_LENGTH_NAME,
  minFarmNameLength: MIN_LENGTH_FARM_NAME,
  maxFarmNameLength: MAX_LENGTH_FARM_NAME,
  maxEmailLength: MAX_LENGTH_EMAIL,
  fullNameValidation,
  farmNameValidation,
  farmWebsiteValidation,
  emailValidation,
  countryValidation,
  stateValidation,
  passwordValidation,
  confirmPasswordValidation,
  confirmPasswordMismatch,
  acceptTerms,
  mareRequired,
  stallionRequired,
  stallionLocationRequired,
  saleLocationRequired,
  saleRequired,
  currencyRequired,
  stallionName,
  year,
  emailFormatValidation,
  fee,
  name,
  mareNameRequired,
  message,
  farmId,
  contactDetailsRequired,
  accessLevelValidation
};

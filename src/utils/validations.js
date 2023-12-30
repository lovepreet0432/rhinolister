import * as Yup from "yup";

export const ManuallyEnterItemSchema = Yup.object().shape({
    identifier:  Yup.number()
    .typeError('Identifier must be a number')
    .positive('Must be a positive number')
    .min(99999, 'Must have at least 5 digits')
    .max(999999999999999999999999999999, 'Can have at most 30 digits')
    .required('Identifier is required'),
    title: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Title must contain only letters')
    .min(5, 'Must have at least 5 characters')
    .max(50, 'Can have at most 50 characters')
    .required('Title is required'),
    price: Yup.number()
    .typeError('Invalid price')
    .min(0.01, 'Must be greater than 0')
    .max(100000, 'Should not be greater than 10000'),
    description: Yup.string()
    .min(20, 'Must have at least 20 characters')
    .max(250, 'Can have at most 250 characters')
    .required("Description is required"),
    quantity: Yup.number()
    .typeError('Invalid quantity')
    .integer('Must be an integer')
    .min(1, 'Must be at least 1')
    .max(100, 'Must be at most 100')
    .required('Quantity is required'),
  });

  export const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    _error: Yup.string(),
  });


  export const RegistrationSchema = Yup.object().shape({
    fullName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only letters')
    .min(5, 'Name must be at least 5 characters')
    .max(50, 'Name can be at most 50 characters')
    .required('Name is required'),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/\d/, "Password must contain a digit")
      .matches(/[a-z]/, "Password must contain a lowercase letter")
      .matches(/[A-Z]/, "Password must contain an uppercase letter")
      .matches(
        /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/,
        "Password must contain a special character"
      )
      .max(50, 'Password can be at most 50 characters')
      .required("Password is required"),
        confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Confirm Password is required"),
  });  

  export const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required")
  });  
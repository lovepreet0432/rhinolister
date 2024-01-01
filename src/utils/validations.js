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

  
export const ProfileValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(/^[A-Za-z ]+$/, "Full name must contain only letters")
    .max(50, "Full Name should not exceed 50 characters")
    .required("Full Name is required"),
  company: Yup.string()
    .max(100, "Company should not exceed 100 characters")
    .nullable(),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  street: Yup.string()
    .max(100, "Street should not exceed 100 characters")
    .required("Street is required"),
  street_two: Yup.string()
    .max(100, "Street 2 should not exceed 100 characters"),
  city: Yup.string()
    .matches(/^[A-Za-z ]+$/, "City must contain only letters")
    .required("City is required"),
  zipcode: Yup.string()
    .matches(/^[A-Z\d]{3,6}$/, "Invalid ZIP code")
    .required("Zipcode is required"),
});


export const ChangePasswordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string()
    .required("New Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm New Password is required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});
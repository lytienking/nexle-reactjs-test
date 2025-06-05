import { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
} from "reactstrap";
import { clearError } from "store/authSlice";
import { getPasswordStrength, signupSchema } from "validation/authSchemas";
import type { RootState } from "store";
import type { AppDispatch } from "store";
import { signup } from "store/authThunk";

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      agree: false,
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      await dispatch(signup(values)).unwrap();
      navigate("/dashboard");
    },
  });

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-illustration">
          <img
            src="/background-signup.png"
            alt="Signup Illustration"
            style={{ width: "100%", maxWidth: 400 }}
          />
        </div>
        <div className="signup-form-wrapper">
          <div className="auth-form">
            <h4>Adventure starts here</h4>
            <p className="text-muted mb-4" style={{ fontSize: 13 }}>
              Make your app management easy and fun!
            </p>
            {error && (
              <Alert color="danger" className="mb-4">
                {error}
              </Alert>
            )}
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label for="firstName">Firstname*</Label>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="johndoe"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  invalid={
                    formik.touched.firstName && !!formik.errors.firstName
                  }
                  disabled={loading}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="error-message">{formik.errors.firstName}</div>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Lastname*</Label>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="johndoe"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  invalid={formik.touched.lastName && !!formik.errors.lastName}
                  disabled={loading}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="error-message">{formik.errors.lastName}</div>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="email">Email*</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="johndoe@gmail.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  invalid={formik.touched.email && !!formik.errors.email}
                  disabled={loading}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error-message">{formik.errors.email}</div>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="password">Password*</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  invalid={formik.touched.password && !!formik.errors.password}
                  disabled={loading}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="error-message">{formik.errors.password}</div>
                )}
                {formik.values.password && !formik.errors.password && (
                  <div
                    className={`password-strength ${getPasswordStrength(
                      formik.values.password
                    )}`}
                  >
                    {getPasswordStrength(formik.values.password)}
                  </div>
                )}
              </FormGroup>
              <FormGroup check className="mb-3">
                <Label style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="agree"
                    onChange={formik.handleChange}
                    checked={formik.values.agree}
                    disabled={loading}
                    style={{ marginRight: 6 }}
                  />
                  I agree to <a href="#">privacy policy & terms</a>
                </Label>
              </FormGroup>
              <Button
                type="submit"
                color="primary"
                block
                disabled={loading || !formik.isValid || !formik.values.agree}
                style={{ marginBottom: 10 }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Sign Up
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </Form>
            <div className="auth-links mb-2">
              <span style={{ fontSize: 13 }}>
                Already have an account?{" "}
                <Link to="/login">Sign in instead</Link>
              </span>
            </div>
            <div
              className="text-center mb-2"
              style={{ fontSize: 12, color: "#888" }}
            >
              or
            </div>
            <div className="d-flex justify-content-center gap-2">
              <Button
                color="primary"
                outline
                size="sm"
                className="rounded-circle"
              >
                <i className="fab fa-facebook-f"></i>
              </Button>
              <Button color="info" outline size="sm" className="rounded-circle">
                <i className="fab fa-twitter"></i>
              </Button>
              <Button
                color="danger"
                outline
                size="sm"
                className="rounded-circle"
              >
                <i className="fab fa-google"></i>
              </Button>
              <Button color="dark" outline size="sm" className="rounded-circle">
                <i className="fab fa-github"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
